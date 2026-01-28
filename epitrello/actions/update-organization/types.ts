import { z } from "zod";

import { UpdateOrganization } from "./schema";

export type InputType = z.infer<typeof UpdateOrganization>;
export type ReturnType = { error?: string; success?: boolean };
