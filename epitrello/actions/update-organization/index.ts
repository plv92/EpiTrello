"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { UpdateOrganization } from "./schema";

export async function updateOrganization(data: InputType): Promise<ReturnType> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Non autorisé" };
  }

  const validatedFields = UpdateOrganization.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Champs invalides" };
  }

  const { organizationId, name, customImage } = validatedFields.data;

  try {
    // Vérifier que l'utilisateur est admin de l'organisation
    const membership = await db.organizationMember.findFirst({
      where: {
        organizationId,
        userId: session.user.id,
        role: "ADMIN",
      },
    });

    if (!membership) {
      return { error: "Vous devez être administrateur pour modifier l'organisation" };
    }

    // Préparer les données à mettre à jour
    const updateData: { name?: string; customImage?: string | null } = {};
    
    if (name !== undefined) {
      updateData.name = name;
    }
    
    if (customImage !== undefined) {
      updateData.customImage = customImage || null;
    }

    // Mettre à jour l'organisation
    await db.organization.update({
      where: { id: organizationId },
      data: updateData,
    });

    revalidatePath(`/organization/${organizationId}`);
    revalidatePath(`/organization/${organizationId}/settings`);

    return { success: true };
  } catch (error) {
    console.error("Error updating organization:", error);
    return { error: "Erreur lors de la mise à jour de l'organisation" };
  }
}
