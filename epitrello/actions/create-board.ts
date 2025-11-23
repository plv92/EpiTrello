"use server"

import { z} from "zod";

import { db } from "@/lib/db";
import { title } from "process";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";

export type State = {
    errors?: {
        title?: string;
    },
    message?: string | null;
}

const CreateBoard = z.object({
    title: z.string().min(3, {
        message: "Minimum length is 3 characters",
    }),
});

export async function create(prevState: State | undefined, formData: FormData) {
    const validatedFields= CreateBoard.safeParse({
        title: formData.get("title"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields."
        }
    }
    const { title } = validatedFields.data;
    try {
        await db.board.create({
            data: {
                title,
            }
        });
    } catch (error) {
        return {
            message: "Database error.",
        }
    }
    revalidatePath("/organization/org_35mb4Y0JbXrqbrfLJvw6JkGqeL9");
}