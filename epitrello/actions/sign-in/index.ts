"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import { encrypt } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const SignInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export async function signIn(formData: FormData) {
  const validatedFields = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: "Champs invalides",
    };
  }

  const { email, password } = validatedFields.data;

  // Chercher l'utilisateur
  const user = await db.user.findUnique({
    where: { email },
    include: {
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!user) {
    return {
      error: "Email ou mot de passe incorrect",
    };
  }

  // Vérifier le mot de passe
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return {
      error: "Email ou mot de passe incorrect",
    };
  }

  // Créer une session
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
  const sessionToken = await encrypt({ userId: user.id, email: user.email });

  await db.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires,
    },
  });

  // Définir le cookie de session
  const cookieStore = cookies();
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });

  // Si l'utilisateur a des organisations, définir la première comme active
  if (user.organizations.length > 0) {
    cookieStore.set("currentOrgId", user.organizations[0].organizationId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  revalidatePath("/");
  redirect(user.organizations.length > 0 ? `/organization/${user.organizations[0].organizationId}` : "/select-org");
}
