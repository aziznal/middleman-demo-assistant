import { z } from "zod";

export const assistantRequestSchema = z.object({
  threadId: z.string().optional(),
  message: z.object({
    content: z.string(),
  }),
});

export type AssistantRequest = z.infer<typeof assistantRequestSchema>;
