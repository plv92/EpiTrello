"use client";

import { useState } from "react";
import { deleteBoard } from "@/actions/delete-board";
import { useAction } from "@/hooks/use-actions";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { MoreHorizontal, X, Image, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BoardImageModal } from "./board-image-modal";

export const BoardOptions = ({
    id,
}: {
    id: string;
}) => {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const { execute, isLoading } = useAction(deleteBoard, {
        onError: (error) => {
            toast.error(error);
        }
    });

    const onDelete = () => {
        execute({ id });
    };

    return (
        <>
            <BoardImageModal
                id={id}
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
            />
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="h-auto w-auto p-2" variant="transparent">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="px-0 pt-3 pb-3"
                    side="bottom"
                    align="start"
                >
                    <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                        Board actions
                    </div>
                    <PopoverClose asChild>
                        <Button
                            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                            variant="ghost"
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    </PopoverClose>
                    <Button
                        variant="ghost"
                        onClick={() => setIsImageModalOpen(true)}
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    >
                        <Image className="h-4 w-4 mr-2" />
                        Changer l&apos;image de fond
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onDelete}
                        disabled={isLoading}
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-rose-600 hover:text-rose-600 hover:bg-rose-50"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete this board
                    </Button>
                </PopoverContent>
            </Popover>
        </>
    )
}
