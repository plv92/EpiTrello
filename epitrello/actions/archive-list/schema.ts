import { z } from "zod";

export const ArchiveListSchema = z.object({
  listId: z.string(),
  archive: z.boolean().default(true),
});

export type ArchiveListInput = z.infer<typeof ArchiveListSchema>;
