"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-actions";
import { CopyList } from "./schema";
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
    let list;

    try {
        const listToCopy = await db.list.findUnique({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                },
            },
            include : {
                cards: true
            },
        });

        if (!listToCopy) {
            return { error: "List not found"};
        }

        const lastList = await db.list.findFirst({
            where: { boardId },
            orderBy: {order: "desc"},
            select: { order: true },
        });

        const newOrder = lastList ? lastList.order + 1 : 1;

        list = await db.list.create({
            data: {
                boardId,
                title: `${listToCopy.title} - Copy`,
                order: newOrder,
                cards: {
                    createMany: {
                        data: listToCopy.cards.map((card) => ({
                            title: card.title,
                            description: card.description,
                            order: card.order,
                        })),
                    },
                },
            },
            include: {
                cards: true,
            },
        });

        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.UPDATE,
        });
    } catch (error) {
        return {
            error: "Failed to copy."
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);
