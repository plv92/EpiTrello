import { z } from "zod";

export const AddCardLabel = z.object({
  cardId: z.string(),
  name: z.string().min(1, "Le nom est requis"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Couleur hexadécimale invalide"),
});
