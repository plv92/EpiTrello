"use client";

import { useCardModal } from "@/hooks/use-card-modal";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";

interface CardItemProps {
    data: Card;
    index: number;
};

export const CardItem = ({
    data,
    index,
}: CardItemProps) => {
    const cardModal = useCardModal();

    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    role="button"
                    onClick={() => cardModal.onOpen(data.id)}
                    className="truncate border-2 border-transparent hover:border-black bg-white rounded-md shadow-sm overflow-hidden"
                >
                    {data.coverImage && (
                        <div className="w-full h-24 relative">
                            <img
                                src={data.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="py-2 px-3 text-sm">
                        {data.title}
                    </div>
                </div>
            )}
        </Draggable>
    );
};
