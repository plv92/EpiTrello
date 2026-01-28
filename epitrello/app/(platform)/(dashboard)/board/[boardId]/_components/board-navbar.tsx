"use client";

import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArchiveModal } from "@/components/modals/archive-modal";

interface BoardNavbarProps {
    data: Board;
    orgId: string;
}

export const BoardNavbar = ({
    data,
    orgId,
}: BoardNavbarProps) => {
    const router = useRouter();
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

    const handleBack = () => {
        router.push(`/organization/${orgId}`);
    };

    return ( 
        <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
            <Button
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
            </Button>
            <BoardTitleForm data={data}/>
            <div className="ml-auto flex items-center gap-x-2">
                <Button
                    onClick={() => setIsArchiveModalOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                >
                    <Archive className="h-4 w-4 mr-2" />
                    Archives
                </Button>
                <BoardOptions id={data.id} />
            </div>
            <ArchiveModal
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                boardId={data.id}
            />
        </div>
    );
}
