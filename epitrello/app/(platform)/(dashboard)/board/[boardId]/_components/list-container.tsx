"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-actions";
import { updateListOrder } from "@/actions/update-list-order";
import { ListWithCards } from "@/types";
import { CardLabel, CardAssignee } from "@prisma/client";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListItem } from "./list-item";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number){
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const ListContainer = ({
    data,
    boardId,
}: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data);
    const [search, setSearch] = useState("");
    // Filtres avancés
    const [selectedLabel, setSelectedLabel] = useState<string>("");
    const [selectedAssignee, setSelectedAssignee] = useState<string>("");

    const { execute: executeUpdateListOrder} = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List reordered");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { execute: executeUpdateCardOrder} = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Card reordered");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    useEffect(() => {
        setOrderedData(data)
    }, [data]);

    const onDragEnd = (result: any) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }
        
        // id dropped in the same position
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // User moves a list
        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index
            ).map(((item, index) => ({...item, order: index})));

            setOrderedData(items);
            executeUpdateListOrder({ items, boardId });
        }

        // User moves a card
        if (type === "card") {
            let newOrderedData = [...orderedData];

            // Source and destination list
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destList = newOrderedData.find(list => list.id === destination.droppableId);

            if (!sourceList || !destList) {
                return;
            }

            // Check if cards exists on the sourceList
            if (!sourceList.cards) {
                sourceList.cards = [];
            }

            // Check if cards exists on the destList
            if (!destList.cards) {
                destList.cards = [];
            }

            // Moving the card in the same list
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                );

            reorderedCards.forEach((card, idx) => {
                card.order = idx;
            });

            sourceList.cards = reorderedCards;

            setOrderedData(newOrderedData);
            executeUpdateCardOrder({
                boardId: boardId,
                items: reorderedCards,
            });
            // User moves the card to another list
            } else {
                // Remove card from the source list
                const [movedCard] = sourceList.cards.splice(source.index, 1);

                // Assign the new listId to the moved card
                movedCard.listId = destination.droppableId;

                // Add card to the destination list
                destList.cards.splice(destination.index, 0, movedCard);

                sourceList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                // Update the order for each card in the destList
                destList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                setOrderedData(newOrderedData);
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: destList.cards,
                });
            }
        }
    }

    // Extraction des labels et assignees uniques pour les filtres
    const allLabels: CardLabel[] = [];
    const allAssignees: CardAssignee[] = [];
    orderedData.forEach(list => {
        list.cards.forEach(card => {
            if (Array.isArray(card.labels)) {
                card.labels.forEach(label => {
                    if (!allLabels.find(l => l.id === label.id)) allLabels.push(label);
                });
            }
            if (Array.isArray(card.assignees)) {
                card.assignees.forEach(assignee => {
                    if (!allAssignees.find(a => a.id === assignee.id)) allAssignees.push(assignee);
                });
            }
        });
    });

    // Filtrage combiné
    const filteredData = orderedData.map(list => ({
        ...list,
        cards: list.cards.filter(card => {
            // Recherche texte
            let match = true;
            if (search.trim()) {
                const s = search.trim().toLowerCase();
                match = card.title.toLowerCase().includes(s) || (card.description?.toLowerCase().includes(s) ?? false);
            }
            // Filtre label
            if (selectedLabel) {
                match = match && Array.isArray(card.labels) && card.labels.some(l => l.id === selectedLabel);
            }
            // Filtre assignee
            if (selectedAssignee) {
                match = match && Array.isArray(card.assignees) && card.assignees.some(a => a.id === selectedAssignee);
            }
            return match;
        })
    }));

    return (
        <div className="mb-4">
            <div className="flex flex-wrap gap-2 items-center mb-4">
                <Input
                    type="text"
                    placeholder="Rechercher une carte..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-64"
                />
                <select
                    className="border rounded px-2 py-1"
                    value={selectedLabel}
                    onChange={e => setSelectedLabel(e.target.value)}
                >
                    <option value="">Tous les labels</option>
                    {allLabels.map(label => (
                        <option key={label.id} value={label.id}>{label.name}</option>
                    ))}
                </select>
                <select
                    className="border rounded px-2 py-1"
                    value={selectedAssignee}
                    onChange={e => setSelectedAssignee(e.target.value)}
                >
                    <option value="">Tous les assignés</option>
                    {allAssignees.map(assignee => (
                        <option key={assignee.id} value={assignee.id}>{assignee.name || assignee.email}</option>
                    ))}
                </select>
                {/* TODO: Ajouter un filtre par date si besoin */}
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="lists" type="list" direction="horizontal">
                    {(provided) => (
                        <ol
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex gap-x-3 h-full"
                        >
                            {filteredData.map((list, index) => {
                                return (
                                    <ListItem
                                        key={list.id}
                                        index={index}
                                        data={list}
                                    />
                                )
                            })}
                            {provided.placeholder}
                            <ListForm />
                            <div className="flex shrink-0 w-1"/>
                        </ol>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}
