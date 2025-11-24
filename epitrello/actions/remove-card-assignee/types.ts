import { z } from "zod";
import { CardAssignee } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-actions";

import { RemoveCardAssignee } from "./schema";

export type InputType = z.infer<typeof RemoveCardAssignee>;
export type ReturnType = ActionState<InputType, CardAssignee>;
