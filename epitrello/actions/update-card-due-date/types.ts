import { z } from "zod";
import { Card } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-actions";

import { UpdateCardDueDate } from "./schema";

export type InputType = z.infer<typeof UpdateCardDueDate>;
export type ReturnType = ActionState<InputType, Card>;
