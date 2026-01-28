import { z } from "zod";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { AddCardCommentSchema } from "./schema";
import { AddCardCommentInput, AddCardCommentOutput } from "./types";

export const addCardComment = createSafeAction(
  AddCardCommentSchema,
  async (values: AddCardCommentInput): Promise<AddCardCommentOutput> => {
    const { cardId, userId, content } = values;
    const comment = await db.comment.create({
      data: {
        cardId,
        userId,
        content,
      },
      include: {
        user: true,
      },
    });
    return { comment };
  }
);
