import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";
import { BoardOrgSync } from "./_components/board-org-sync";
import { Board } from "@prisma/client";
import { cookies } from "next/headers";
interface generateMetadataProps {
    params: {
        boardId: string
    };
};

export async function generateMetadata({
    params,
}: generateMetadataProps) {
    const { orgId } = await auth();

    if (!orgId) {
        return {
            title: "Board",
        };
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        },
    });

    return {
        title: board?.title || "Board",
    };
};

interface BoardIdLayoutProps {
    children: React.ReactNode;
    params: {
        boardId: string
    };
};

const BoardIdLayout = async ({
    children,
    params,
}: BoardIdLayoutProps) => {
    const board = await db.board.findFirst({
        where: {
            id: params.boardId,
        },
    });

    if (!board) {
        notFound();
    }

    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${board.imageFullUrl})` }}
        >
            <BoardOrgSync orgId={board.orgId} />
            <BoardNavbar data={board} orgId={board.orgId} />
            <div className="absolute inset-0 bg-black/10" />
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </div>
    );
};

export default BoardIdLayout;
