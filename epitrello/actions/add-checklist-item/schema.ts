import { z } from "zod";

export const AddChecklistItem = z.object({
  cardId: z.string(),
  title: z.string().min(1, "Le titre est requis"),
});
