"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { auth } from "@/lib/auth";

import { AddChecklistItem } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Non autorisé",
    };
  }

  const { cardId, title } = data;

  try {
    const card = await db.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          include: {
            board: true,
          },
        },
        checklist: true,
      },
    });

    if (!card || card.list.board.orgId !== orgId) {
      return {
        error: "Carte non trouvée",
      };
    }

    const maxOrder = card.checklist.reduce((max, item) => Math.max(max, item.order), 0);

    const checklistItem = await db.checklistItem.create({
      data: {
        cardId,
        title,
        order: maxOrder + 1,
      },
    });

    revalidatePath(`/board/${card.list.boardId}`);
    return { data: checklistItem };
  } catch (error) {
    return {
      error: "Échec de l'ajout de l'élément de checklist",
    };
  }
};

export const addChecklistItem = createSafeAction(AddChecklistItem, handler);
