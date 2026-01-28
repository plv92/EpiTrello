import { z } from "zod";

export const ArchiveCardSchema = z.object({
  cardId: z.string(),
  archive: z.boolean().default(true),
});

export type ArchiveCardInput = z.infer<typeof ArchiveCardSchema>;
