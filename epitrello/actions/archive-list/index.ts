"use server";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { auth } from "@/lib/auth";

import { z } from "zod";

const ArchiveListSchema = z.object({
  listId: z.string(),
  archive: z.boolean().default(true),
});

export const archiveList = createSafeAction(
  ArchiveListSchema,
  async ({ listId, archive }) => {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return { error: "Non autorisé" };
    }
    const list = await db.list.findUnique({
      where: { id: listId },
      include: { board: true },
    });
    if (!list || list.board.orgId !== orgId) {
      return { error: "Liste non trouvée" };
    }
    await db.list.update({
      where: { id: listId },
      data: { isArchived: archive },
    });
    return { data: true };
  }
);
