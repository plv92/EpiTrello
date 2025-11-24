"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { auth } from "@/lib/auth";

import { ToggleChecklistItem } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Non autorisé",
    };
  }

  const { id, isCompleted } = data;

  try {
    const checklistItem = await db.checklistItem.findUnique({
      where: { id },
      include: {
        card: {
          include: {
            list: {
              include: {
                board: true,
              },
            },
          },
        },
      },
    });

    if (!checklistItem || checklistItem.card.list.board.orgId !== orgId) {
      return {
        error: "Élément non trouvé",
      };
    }

    const updatedItem = await db.checklistItem.update({
      where: { id },
      data: { isCompleted },
    });

    revalidatePath(`/board/${checklistItem.card.list.boardId}`);
    return { data: updatedItem };
  } catch (error) {
    return {
      error: "Échec de la mise à jour",
    };
  }
};

export const toggleChecklistItem = createSafeAction(ToggleChecklistItem, handler);
