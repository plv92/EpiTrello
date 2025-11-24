import { z } from "zod";

export const AddCardAssignee = z.object({
  cardId: z.string(),
  userId: z.string(),
});
