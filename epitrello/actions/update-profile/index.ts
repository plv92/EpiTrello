"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { auth } from "@/lib/auth";

import { UpdateProfile } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: "Non autorisé",
    };
  }

  const { name, username, email, customImage, currentPassword, newPassword } = data;

  try {
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      return {
        error: "Cet email est déjà utilisé",
      };
    }

    // Vérifier si le username est déjà utilisé
    if (username) {
      const existingUsername = await db.user.findUnique({
        where: { username },
      });

      if (existingUsername && existingUsername.id !== userId) {
        return {
          error: "Ce pseudo est déjà utilisé",
        };
      }
    }

    // Si changement de mot de passe, vérifier le mot de passe actuel
    if (newPassword && currentPassword) {
      const user = await db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          error: "Utilisateur non trouvé",
        };
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return {
          error: "Mot de passe actuel incorrect",
        };
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          name,
          username,
          email,
          customImage,
          password: hashedPassword,
        },
      });

      revalidatePath("/profile");
      return { data: updatedUser };
    }

    // Mise à jour sans changement de mot de passe
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        email,
        customImage,
      },
    });

    revalidatePath("/profile");
    return { data: updatedUser };
  } catch (error) {
    return {
      error: "Échec de la mise à jour du profil",
    };
  }
};

export const updateProfile = createSafeAction(UpdateProfile, handler);
