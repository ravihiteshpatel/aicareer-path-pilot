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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error("Upstream request failed");
      }
      return { ok: true as const };
    } catch {
      throw new Error("Failed to submit roadmap request");
    } finally {
      clearTimeout(timeout);
    }
  });