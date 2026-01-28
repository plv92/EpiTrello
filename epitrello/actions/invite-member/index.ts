"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/actions/create-notification";

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

    // Récupérer l'organisation
    const organization = await db.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return { error: "Organisation non trouvée" };
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

    // Vérifier s'il y a déjà une invitation en attente
    const existingInvitation = await db.organizationInvitation.findFirst({
      where: {
        organizationId,
        userId: userToInvite.id,
        status: "pending",
      },
    });

    if (existingInvitation) {
      return {
        error: "Une invitation est déjà en attente pour cet utilisateur",
      };
    }

    // Créer l'invitation
    const invitation = await db.organizationInvitation.create({
      data: {
        organizationId,
        userId: userToInvite.id,
        invitedBy: userId,
      },
    });

    // Créer une notification pour l'utilisateur invité
    await createNotification({
      userId: userToInvite.id,
      type: "organization_invite",
      title: "Nouvelle invitation",
      message: `Vous avez été invité à rejoindre l'organisation "${organization.name}"`,
      invitationId: invitation.id,
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
