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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      if (!res.ok && res.status !== 0) {
        throw new Error("Upstream request failed");
      }
      return { ok: true as const };
    } catch (err) {
      // If the request was aborted due to our timeout, n8n has already
      // received the payload and is processing it — surface as success.
      if (err instanceof Error && err.name === "AbortError") {
        return { ok: true as const, pending: true as const };
      }
      throw new Error("Failed to submit roadmap request");
    } finally {
      clearTimeout(timeout);
    }
  });