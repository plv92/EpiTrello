import { z } from "zod";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { createNotification } from "@/actions/create-notification";
import { AddCardCommentSchema } from "./schema";
import { AddCardCommentInput, AddCardCommentOutput } from "./types";

export const addCardComment = createSafeAction(
  AddCardCommentSchema,
  async (values: AddCardCommentInput): Promise<AddCardCommentOutput> => {
    const { cardId, userId, content } = values;
    
    // Récupérer la carte avec ses assignés
    const card = await db.card.findUnique({
      where: { id: cardId },
      include: {
        assignees: true,
        list: {
          select: {
            boardId: true,
          },
        },
      },
    });

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

    // Notifier tous les assignés de la carte (sauf l'auteur du commentaire)
    if (card?.assignees) {
      for (const assignee of card.assignees) {
        if (assignee.userId !== userId) {
          await createNotification({
            userId: assignee.userId,
            type: "comment_added",
            title: "Nouveau commentaire",
            message: `${comment.user.name || comment.user.email} a ajouté un commentaire sur "${card.title}"`,
            cardId,
            boardId: card.list.boardId,
          });
        }
      }
    }

    return { comment };
  }
);
