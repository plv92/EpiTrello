"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { auth } from "@/lib/auth";

import { RemoveCardAssignee } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId: currentUserId, orgId } = await auth();

  if (!currentUserId || !orgId) {
    return {
      error: "Non autorisé",
    };
  }

  const { cardId, userId } = data;

  try {
    // Vérifier que la carte existe et appartient à l'organisation
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

    // Supprimer l'assignation
    const assignee = await db.cardAssignee.delete({
      where: {
        cardId_userId: {
          cardId,
          userId,
        },
      },
    });

    revalidatePath(`/board/${card.list.boardId}`);
    return { data: assignee };
  } catch (error) {
    return {
      error: "Échec de la suppression de l'assigné",
    };
  }
};

export const removeCardAssignee = createSafeAction(RemoveCardAssignee, handler);
