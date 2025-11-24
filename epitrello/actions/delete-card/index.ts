"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-actions";
import { DeleteCard } from "./schema";
import { redirect } from "next/navigation";
import { copyFile } from "fs";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, boardId } = data;
    let card;

    try {
        card = await db.card.delete({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    },
                },
            },
        });

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.DELETE,
        });
    } catch (error) {
        return {
            error: "Failed to delete."
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
