import { z } from "zod";

export const UpdateCardCover = z.object({
  id: z.string(),
  boardId: z.string(),
  coverImage: z.string().nullable(),
});
