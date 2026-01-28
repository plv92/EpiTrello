"use server";

import { auth } from "@/lib/auth";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-actions";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { BOARD_TEMPLATES } from "@/constants/board-templates";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { title, image, templateId } = data;

    let imageId: string;
    let imageThumbUrl: string;
    let imageFullUrl: string;
    let imageLinkHTML: string;
    let imageUserName: string;
    let customImage: string | null = null;

    // Vérifier si c'est une image personnalisée uploadée
    if (image.startsWith("/uploads/") || image.startsWith("http") && image.includes("/uploads/")) {
        // C'est une image personnalisée
        customImage = image;
        imageId = "custom";
        imageThumbUrl = image;
        imageFullUrl = image;
        imageLinkHTML = "";
        imageUserName = "Custom Upload";
    } else {
        // C'est une image Unsplash
        const imageParts = image.split("|");
        
        if (imageParts.length !== 5) {
            return {
                error: "Missing fields. Failed to create board."
            };
        }

        [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] = imageParts;

        if (!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML) {
            return {
                error: "Missing fields. Failed to create board."
            };
        }
    }

    console.log({
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
        customImage,
    });

    let board;

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML,
                customImage,
            }
        });

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE,
        });

        // Créer les listes du template si un template est sélectionné
        if (templateId && templateId !== "blank") {
            const template = BOARD_TEMPLATES.find(t => t.id === templateId);
            if (template && template.lists.length > 0) {
                await Promise.all(
                    template.lists.map((listTitle, index) =>
                        db.list.create({
                            data: {
                                title: listTitle,
                                boardId: board.id,
                                order: index,
                            },
                        })
                    )
                );
            }
        }
    } catch(error) {
        return {
            error: "Failed to create."
        }
    }

    revalidatePath(`/board/${board.id}`);
    return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
