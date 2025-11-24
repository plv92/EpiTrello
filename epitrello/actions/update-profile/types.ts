import { z } from "zod";
import { User } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-actions";

import { UpdateProfile } from "./schema";

export type InputType = z.infer<typeof UpdateProfile>;
export type ReturnType = ActionState<InputType, User>;
