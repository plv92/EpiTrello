"use server";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { auth } from "@/lib/auth";

import { z } from "zod";

const ArchiveCardSchema = z.object({
  cardId: z.string(),
  archive: z.boolean().default(true),
});

export const archiveCard = createSafeAction(
  ArchiveCardSchema,
  async ({ cardId, archive }) => {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return { error: "Non autorisé" };
    }
    const card = await db.card.findUnique({
      where: { id: cardId },
      include: { list: { include: { board: true } } },
    });
    if (!card || card.list.board.orgId !== orgId) {
      return { error: "Carte non trouvée" };
    }
    await db.card.update({
      where: { id: cardId },
      data: { isArchived: archive },
    });
    return { data: true };
  }
);
