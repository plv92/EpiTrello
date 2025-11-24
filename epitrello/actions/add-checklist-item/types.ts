import { z } from "zod";
import { ChecklistItem } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-actions";

import { AddChecklistItem } from "./schema";

export type InputType = z.infer<typeof AddChecklistItem>;
export type ReturnType = ActionState<InputType, ChecklistItem>;
