import { z } from "zod";

export const UpdateOrganization = z.object({
  organizationId: z.string(),
  name: z.string().min(3, {
    message: "Le nom doit contenir au moins 3 caractères",
  }).optional(),
  customImage: z.string().optional(),
});
