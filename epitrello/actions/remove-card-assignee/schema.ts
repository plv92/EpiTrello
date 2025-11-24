import { z } from "zod";

export const RemoveCardAssignee = z.object({
  cardId: z.string(),
  userId: z.string(),
});
