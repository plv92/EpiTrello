"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import { encrypt } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const SignUpSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export async function signUp(formData: FormData) {
  const validatedFields = SignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: "Champs invalides",
    };
  }

  const { name, email, password } = validatedFields.data;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      error: "Cet email est déjà utilisé",
    };
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer l'utilisateur
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

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

  revalidatePath("/");
  redirect("/select-org");
}
