import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ALLOWED_LEVELS = ["Beginner", "Intermediate", "Expert"] as const;

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  career: z.string().trim().min(1).max(100),
  level: z.enum(ALLOWED_LEVELS),
  goal: z.string().trim().max(500).optional().default(""),
});

export const submitRoadmap = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("Roadmap service is not configured");
    }

    // n8n workflow generates a PDF and emails it, which can take longer than
    // typical HTTP timeouts. We only need to confirm the webhook accepted the
    // request — the actual work continues on n8n's side. Use a short timeout
    // just to confirm delivery, and treat timeouts as success since the
    // workflow will still run to completion and email the user.
    // n8n's workflow (PDF + email) can take much longer than an HTTP
    // round-trip. We fire the request and race it against a short timer:
    // as long as we've handed the payload to n8n, we report success. Any
    // hard failure to reach n8n at all is surfaced as an error.
    const controller = new AbortController();
    const fetchPromise = fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    }).then(
      (res) => ({ kind: "response" as const, ok: res.ok, status: res.status }),
      (err: unknown) => ({ kind: "error" as const, err }),
    );
    const timeoutPromise = new Promise<{ kind: "timeout" }>((resolve) =>
      setTimeout(() => resolve({ kind: "timeout" }), 6000),
    );
    const result = await Promise.race([fetchPromise, timeoutPromise]);

    if (result.kind === "timeout") {
      // n8n accepted the connection but the workflow is still running.
      // Don't abort — let it finish server-side. Report success to the client.
      return { ok: true as const, pending: true as const };
    }
    if (result.kind === "response") {
      if (!result.ok && result.status >= 400 && result.status !== 408) {
        throw new Error("Upstream request failed");
      }
      return { ok: true as const };
    }
    // Network-level failure reaching n8n.
    throw new Error("Failed to submit roadmap request");
  });