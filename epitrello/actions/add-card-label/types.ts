import { z } from "zod";
import { CardLabel } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-actions";

import { AddCardLabel } from "./schema";

export type InputType = z.infer<typeof AddCardLabel>;
export type ReturnType = ActionState<InputType, CardLabel>;
