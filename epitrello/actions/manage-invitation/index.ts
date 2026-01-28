"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function acceptInvitation(invitationId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Non authentifié" };
  }

  try {
    const invitation = await db.organizationInvitation.findUnique({
      where: { id: invitationId },
      include: { organization: true },
    });

    if (!invitation) {
      return { error: "Invitation non trouvée" };
    }

    if (invitation.userId !== userId) {
      return { error: "Cette invitation ne vous est pas destinée" };
    }

    if (invitation.status !== "pending") {
      return { error: "Cette invitation a déjà été traitée" };
    }

    // Vérifier si l'utilisateur n'est pas déjà membre
    const existingMember = await db.organizationMember.findFirst({
      where: {
        organizationId: invitation.organizationId,
        userId,
      },
    });

    if (existingMember) {
      // Mettre à jour le statut de l'invitation
      await db.organizationInvitation.update({
        where: { id: invitationId },
        data: { status: "accepted" },
      });
      return { error: "Vous êtes déjà membre de cette organisation" };
    }

    // Ajouter l'utilisateur à l'organisation
    await db.organizationMember.create({
      data: {
        organizationId: invitation.organizationId,
        userId,
        role: "member",
      },
    });

    // Mettre à jour le statut de l'invitation
    await db.organizationInvitation.update({
      where: { id: invitationId },
      data: { status: "accepted" },
    });

    // Marquer la notification comme lue
    await db.notification.updateMany({
      where: {
        invitationId,
        userId,
      },
      data: { isRead: true },
    });

    revalidatePath("/");
    return { success: true, organizationId: invitation.organizationId };
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return { error: "Erreur lors de l'acceptation de l'invitation" };
  }
}

export async function declineInvitation(invitationId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Non authentifié" };
  }

  try {
    const invitation = await db.organizationInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      return { error: "Invitation non trouvée" };
    }

    if (invitation.userId !== userId) {
      return { error: "Cette invitation ne vous est pas destinée" };
    }

    if (invitation.status !== "pending") {
      return { error: "Cette invitation a déjà été traitée" };
    }

    // Mettre à jour le statut de l'invitation
    await db.organizationInvitation.update({
      where: { id: invitationId },
      data: { status: "declined" },
    });

    // Marquer la notification comme lue
    await db.notification.updateMany({
      where: {
        invitationId,
        userId,
      },
      data: { isRead: true },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error declining invitation:", error);
    return { error: "Erreur lors du refus de l'invitation" };
  }
}
