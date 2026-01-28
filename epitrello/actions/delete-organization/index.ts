"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const DeleteOrganizationSchema = z.object({
  organizationId: z.string(),
});

export async function deleteOrganization(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Non authentifié" };
  }

  const validatedFields = DeleteOrganizationSchema.safeParse({
    organizationId: formData.get("organizationId"),
  });

  if (!validatedFields.success) {
    return {
      error: "Champs invalides",
    };
  }

  const { organizationId } = validatedFields.data;

  try {
    // Vérifier que l'utilisateur est membre de l'organisation
    const membership = await db.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
      },
    });

    if (!membership) {
      return {
        error: "Vous n'êtes pas membre de cette organisation",
      };
    }

    // Vérifier que l'utilisateur est admin
    if (membership.role !== "admin") {
      return {
        error: "Seul un administrateur peut supprimer l'organisation",
      };
    }

    // Supprimer toutes les données associées
    // 1. Récupérer tous les boards de l'organisation
    const boards = await db.board.findMany({
      where: { orgId: organizationId },
      select: { id: true },
    });

    const boardIds = boards.map((b) => b.id);

    // 2. Récupérer toutes les listes de ces boards
    const lists = await db.list.findMany({
      where: { boardId: { in: boardIds } },
      select: { id: true },
    });

    const listIds = lists.map((l) => l.id);

    // 3. Supprimer dans l'ordre (relations en cascade)
    
    // Supprimer les cartes et leurs relations
    if (listIds.length > 0) {
      // Supprimer les assignés des cartes
      await db.cardAssignee.deleteMany({
        where: {
          card: {
            listId: { in: listIds },
          },
        },
      });

      // Supprimer les labels des cartes
      await db.cardLabel.deleteMany({
        where: {
          card: {
            listId: { in: listIds },
          },
        },
      });

      // Supprimer les items de checklist
      await db.checklistItem.deleteMany({
        where: {
          card: {
            listId: { in: listIds },
          },
        },
      });

      // Supprimer les attachments
      await db.cardAttachment.deleteMany({
        where: {
          card: {
            listId: { in: listIds },
          },
        },
      });

      // Supprimer les commentaires
      await db.comment.deleteMany({
        where: {
          card: {
            listId: { in: listIds },
          },
        },
      });

      // Supprimer les cartes
      await db.card.deleteMany({
        where: {
          listId: { in: listIds },
        },
      });
    }

    // Supprimer les listes
    if (boardIds.length > 0) {
      await db.list.deleteMany({
        where: {
          boardId: { in: boardIds },
        },
      });
    }

    // Supprimer les audit logs
    await db.auditLog.deleteMany({
      where: {
        orgId: organizationId,
      },
    });

    // Supprimer les boards
    await db.board.deleteMany({
      where: {
        orgId: organizationId,
      },
    });

    // Supprimer les membres de l'organisation
    await db.organizationMember.deleteMany({
      where: {
        organizationId,
      },
    });

    // Supprimer l'organisation elle-même
    await db.organization.delete({
      where: {
        id: organizationId,
      },
    });

    // Nettoyer le cookie si c'était l'organisation courante
    const cookieStore = cookies();
    const currentOrgId = cookieStore.get("currentOrgId")?.value;
    
    if (currentOrgId === organizationId) {
      cookieStore.delete("currentOrgId");
    }

    revalidatePath("/select-org");
    return { success: true };
  } catch (error) {
    console.error("Error deleting organization:", error);
    return {
      error: "Erreur lors de la suppression de l'organisation",
    };
  }
}
