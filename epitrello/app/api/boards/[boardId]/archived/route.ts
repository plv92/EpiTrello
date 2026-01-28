import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: { boardId: string } }
) {
    try {
        const { userId, orgId } = await auth();

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Vérifier que le board appartient à l'organisation
        const board = await db.board.findUnique({
            where: {
                id: params.boardId,
                orgId,
            },
        });

        if (!board) {
            return new NextResponse("Board not found", { status: 404 });
        }

        // Récupérer les listes archivées avec leurs cartes
        const archivedLists = await db.list.findMany({
            where: {
                boardId: params.boardId,
                isArchived: true,
            },
            include: {
                cards: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        // Récupérer les cartes archivées (dans des listes non archivées)
        const archivedCards = await db.card.findMany({
            where: {
                list: {
                    boardId: params.boardId,
                    isArchived: false,
                },
                isArchived: true,
            },
            include: {
                list: {
                    select: {
                        title: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return NextResponse.json({
            lists: archivedLists,
            cards: archivedCards,
        });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
