import { z } from "zod";

export const memeSchema = z.object({
  id: z.string(),
  embedding: z.array(z.number()),
  title: z.string(),
  path: z.string(),
  description: z.string(),
  tags: z.string().optional(),
  similarity: z.number().optional(),
});

export type Meme = z.infer<typeof memeSchema>;
