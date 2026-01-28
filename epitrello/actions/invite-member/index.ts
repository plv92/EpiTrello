"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const InviteMemberSchema = z.object({
  organizationId: z.string(),
  email: z.string().email("Email invalide"),
});

export async function inviteMemberToOrganization(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Non authentifié" };
  }

  const validatedFields = InviteMemberSchema.safeParse({
    organizationId: formData.get("organizationId"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      error: "Champs invalides",
    };
  }

  const { organizationId, email } = validatedFields.data;

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
        error: "Seul un administrateur peut inviter des membres",
      };
    }

    // Vérifier si l'utilisateur à inviter existe
    const userToInvite = await db.user.findUnique({
      where: { email },
    });

    if (!userToInvite) {
      return {
        error: "Aucun utilisateur trouvé avec cet email",
      };
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMember = await db.organizationMember.findFirst({
      where: {
        organizationId,
        userId: userToInvite.id,
      },
    });

    if (existingMember) {
      return {
        error: "Cet utilisateur est déjà membre de l'organisation",
      };
    }

    // Ajouter l'utilisateur à l'organisation
    await db.organizationMember.create({
      data: {
        organizationId,
        userId: userToInvite.id,
        role: "member",
      },
    });

    revalidatePath(`/organization/${organizationId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Error inviting member:", error);
    return {
      error: "Erreur lors de l'invitation du membre",
    };
  }
}
