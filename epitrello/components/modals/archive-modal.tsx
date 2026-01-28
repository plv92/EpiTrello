"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { Card, List } from "@prisma/client";
import { useAction } from "@/hooks/use-actions";
import { archiveCard } from "@/actions/archive-card";
import { archiveList } from "@/actions/archive-list";
import { toast } from "sonner";
import { RotateCcw, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ArchiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    boardId: string;
}

export const ArchiveModal = ({ isOpen, onClose, boardId }: ArchiveModalProps) => {
    const { data: archivedData, refetch } = useQuery<{
        lists: (List & { cards: Card[] })[];
        cards: (Card & { list: { title: string } })[];
    }>({
        queryKey: ["archived", boardId],
        queryFn: () => fetcher(`/api/boards/${boardId}/archived`),
        enabled: isOpen && !!boardId,
    });

    const { execute: executeUnarchiveCard } = useAction(archiveCard, {
        onSuccess: () => {
            toast.success("Carte restaurée");
            refetch();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { execute: executeUnarchiveList } = useAction(archiveList, {
        onSuccess: () => {
            toast.success("Liste restaurée");
            refetch();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Éléments archivés</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Listes archivées */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Listes archivées</h3>
                        {archivedData?.lists && archivedData.lists.length > 0 ? (
                            <div className="space-y-2">
                                {archivedData.lists.map((list) => (
                                    <div
                                        key={list.id}
                                        className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{list.title}</p>
                                            <p className="text-xs text-neutral-500">
                                                {list.cards.length} carte(s)
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                executeUnarchiveList({
                                                    listId: list.id,
                                                    archive: false,
                                                })
                                            }
                                        >
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Restaurer
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500">Aucune liste archivée</p>
                        )}
                    </div>

                    <Separator />

                    {/* Cartes archivées */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Cartes archivées</h3>
                        {archivedData?.cards && archivedData.cards.length > 0 ? (
                            <div className="space-y-2">
                                {archivedData.cards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{card.title}</p>
                                            <p className="text-xs text-neutral-500">
                                                dans {card.list.title}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                executeUnarchiveCard({
                                                    cardId: card.id,
                                                    archive: false,
                                                })
                                            }
                                        >
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Restaurer
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500">Aucune carte archivée</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
