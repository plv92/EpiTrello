"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { auth } from "@/lib/auth";

import { AddCardLabel } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Non autorisé",
    };
  }

  const { cardId, name, color } = data;

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

    const label = await db.cardLabel.create({
      data: {
        cardId,
        name,
        color,
      },
    });

    revalidatePath(`/board/${card.list.boardId}`);
    return { data: label };
  } catch (error) {
    return {
      error: "Échec de l'ajout du label",
    };
  }
};

export const addCardLabel = createSafeAction(AddCardLabel, handler);
