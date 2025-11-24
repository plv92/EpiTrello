import { z } from "zod";

export const UpdateProfile = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  customImage: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").optional(),
});
