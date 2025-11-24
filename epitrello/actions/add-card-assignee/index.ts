"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { auth } from "@/lib/auth";

import { AddCardAssignee } from "./schema";
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

    // Vérifier que l'utilisateur fait partie de l'organisation
    const member = await db.organizationMember.findFirst({
      where: {
        userId,
        organizationId: orgId,
      },
    });

    if (!member) {
      return {
        error: "L'utilisateur n'est pas membre de cette organisation",
      };
    }

    // Vérifier si l'assignation existe déjà
    const existingAssignee = await db.cardAssignee.findUnique({
      where: {
        cardId_userId: {
          cardId,
          userId,
        },
      },
    });

    if (existingAssignee) {
      return {
        error: "Cet utilisateur est déjà assigné à cette carte",
      };
    }

    // Créer l'assignation
    const assignee = await db.cardAssignee.create({
      data: {
        cardId,
        userId,
      },
    });

    revalidatePath(`/board/${card.list.boardId}`);
    return { data: assignee };
  } catch (error) {
    return {
      error: "Échec de l'ajout de l'assigné",
    };
  }
};

export const addCardAssignee = createSafeAction(AddCardAssignee, handler);
