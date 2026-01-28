"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { createSafeAction } from "@/lib/create-safe-actions";
import { UpdateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { title, id, image } = data;
    let board;

    try {
        // Préparer les données à mettre à jour
        const updateData: {
            title?: string;
            imageId?: string;
            imageThumbUrl?: string;
            imageFullUrl?: string;
            imageLinkHTML?: string;
            imageUserName?: string;
            customImage?: string | null;
        } = {};

        if (title !== undefined) {
            updateData.title = title;
        }

        if (image !== undefined) {
            // Vérifier si c'est une image personnalisée uploadée
            if (image.startsWith("/uploads/") || (image.startsWith("http") && image.includes("/uploads/"))) {
                // C'est une image personnalisée
                updateData.customImage = image;
                updateData.imageId = "custom";
                updateData.imageThumbUrl = image;
                updateData.imageFullUrl = image;
                updateData.imageLinkHTML = "";
                updateData.imageUserName = "Custom Upload";
            } else {
                // C'est une image Unsplash
                const imageParts = image.split("|");
                
                if (imageParts.length === 5) {
                    const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] = imageParts;
                    updateData.imageId = imageId;
                    updateData.imageThumbUrl = imageThumbUrl;
                    updateData.imageFullUrl = imageFullUrl;
                    updateData.imageLinkHTML = imageLinkHTML;
                    updateData.imageUserName = imageUserName;
                    updateData.customImage = null;
                }
            }
        }

        board = await db.board.update({
            where: {
                id,
                orgId,
            },
            data: updateData,
        });

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.UPDATE,
        });
    } catch (error) {
        return {
            error: "Failed to update."
        }
    }

    revalidatePath(`/board/${id}`);
    return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
