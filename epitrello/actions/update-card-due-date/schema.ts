import { z } from "zod";

export const UpdateCardDueDate = z.object({
  cardId: z.string(),
  dueDate: z.string().optional(),
});
