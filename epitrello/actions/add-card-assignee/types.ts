import { z } from "zod";
import { CardAssignee } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-actions";

import { AddCardAssignee } from "./schema";

export type InputType = z.infer<typeof AddCardAssignee>;
export type ReturnType = ActionState<InputType, CardAssignee>;
