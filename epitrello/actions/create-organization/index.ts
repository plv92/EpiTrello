"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CreateOrganizationSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
});

export async function createOrganization(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Non authentifié" };
  }

  const validatedFields = CreateOrganizationSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      error: "Champs invalides",
    };
  }

  const { name } = validatedFields.data;

  // Créer un slug à partir du nom
  let baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Vérifier si le slug existe déjà et ajouter un suffixe unique si nécessaire
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existingOrg = await db.organization.findUnique({
      where: { slug },
    });

    if (!existingOrg) {
      break; // Le slug est disponible
    }

    // Slug existe déjà, ajouter un suffixe
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // Créer l'organisation
  const organization = await db.organization.create({
    data: {
      name,
      slug,
      members: {
        create: {
          userId,
          role: "admin",
        },
      },
    },
  });

  revalidatePath("/select-org");
  redirect(`/organization/${organization.id}`);
}
