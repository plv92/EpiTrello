import { db } from "@/lib/db";
import { ListContainer } from "./_components/list-container";
import { cookies } from "next/headers";

interface BoardIdPageProps {
    params: {
        boardId: string;
    };
};

const BoardIdPage = async ({
    params,
}: BoardIdPageProps) => {
    const cookieStore = cookies();
    const orgId = cookieStore.get("currentOrgId")?.value;

    const lists = await db.list.findMany({
        where: {
            boardId: params.boardId,
            board: {
                orgId
            },
        },
        include: {
            cards: {
                orderBy: {
                    order: "asc",
                },
                include: {
                    labels: true,
                    assignees: true,
                },
            },
        },
        orderBy: {
            order: "asc",
        },
    });

    return ( 
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer
                boardId={params.boardId}
                data={lists}
            />
        </div>
    );
}

export default BoardIdPage;
