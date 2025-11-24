import { z } from "zod";

export const ToggleChecklistItem = z.object({
  id: z.string(),
  isCompleted: z.boolean(),
});
