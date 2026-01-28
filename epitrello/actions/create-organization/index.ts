"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CreateOrganizationSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
});

export async function createOrganization(data: FormData | { name: string }) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Non authentifié" };
  }

  // Extraire le nom selon le type de données
  const name = data instanceof FormData ? data.get("name") : data.name;

  const validatedFields = CreateOrganizationSchema.safeParse({
    name,
  });

  if (!validatedFields.success) {
    return {
      error: "Champs invalides",
    };
  }

  // Vérifier si l'utilisateur a déjà créé une organisation avec ce nom
  const existingUserOrg = await db.organizationMember.findFirst({
    where: {
      userId,
      organization: {
        name: {
          equals: name,
          mode: 'insensitive', // Comparaison insensible à la casse
        },
      },
    },
    include: {
      organization: true,
    },
  });

  if (existingUserOrg) {
    return {
      error: "Vous avez déjà créé une organisation avec ce nom",
    };
  }

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
  
  return {
    data: {
      id: organization.id,
      name: organization.name,
    }
  };
}
