"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const RemoveMemberSchema = z.object({
  organizationId: z.string(),
  memberId: z.string(),
});

export async function removeMemberFromOrganization(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Non authentifié" };
  }

  const validatedFields = RemoveMemberSchema.safeParse({
    organizationId: formData.get("organizationId"),
    memberId: formData.get("memberId"),
  });

  if (!validatedFields.success) {
    return {
      error: "Champs invalides",
    };
  }

  const { organizationId, memberId } = validatedFields.data;

  try {
    // Vérifier que l'utilisateur est admin de l'organisation
    const membership = await db.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
      },
    });

    if (!membership || membership.role !== "admin") {
      return {
        error: "Seul un administrateur peut retirer des membres",
      };
    }

    // Récupérer le membre à retirer
    const memberToRemove = await db.organizationMember.findUnique({
      where: { id: memberId },
    });

    if (!memberToRemove || memberToRemove.organizationId !== organizationId) {
      return {
        error: "Membre non trouvé",
      };
    }

    // Empêcher de se retirer soi-même s'il n'y a qu'un seul admin
    if (memberToRemove.userId === userId) {
      const adminCount = await db.organizationMember.count({
        where: {
          organizationId,
          role: "admin",
        },
      });

      if (adminCount === 1) {
        return {
          error: "Vous ne pouvez pas vous retirer en tant que seul administrateur",
        };
      }
    }

    // Retirer le membre
    await db.organizationMember.delete({
      where: { id: memberId },
    });

    revalidatePath(`/organization/${organizationId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Error removing member:", error);
    return {
      error: "Erreur lors du retrait du membre",
    };
  }
}
