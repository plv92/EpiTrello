"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { auth } from "@/lib/auth";

import { UpdateCardDueDate } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Non autorisé",
    };
  }

  const { cardId, dueDate } = data;

  try {
    const card = await db.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          include: {
            board: true,
          },
        },
      },
    });

    if (!card || card.list.board.orgId !== orgId) {
      return {
        error: "Carte non trouvée",
      };
    }

    const updatedCard = await db.card.update({
      where: { id: cardId },
      data: {
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    revalidatePath(`/board/${card.list.boardId}`);
    return { data: updatedCard };
  } catch (error) {
    return {
      error: "Échec de la mise à jour de la date d'échéance",
    };
  }
};

export const updateCardDueDate = createSafeAction(UpdateCardDueDate, handler);
