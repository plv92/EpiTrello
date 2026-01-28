import { z } from "zod";

export const AddCardCommentSchema = z.object({
  cardId: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string().min(1).max(1000),
});
