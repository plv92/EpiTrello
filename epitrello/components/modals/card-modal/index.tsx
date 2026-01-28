"use client";

import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { AuditLog } from "@prisma/client";
import { Activity } from "./activity";
import { Assignees } from "./assignees";
import { Labels } from "./labels";
import { DueDate } from "./due-date";
import { Checklist } from "./checklist";
import { Cover } from "./cover";

import { Separator } from "@/components/ui/separator";
import { Comments } from "./comments";

export const CardModal = () => {
    const id = useCardModal((state) => state.id);
    const isOpen = useCardModal((state) => state.isOpen);
    const onClose = useCardModal((state) => state.onClose);

    const { data: cardData } = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`),
        enabled: !!id,
    });

    const { data: auditLogData } = useQuery<AuditLog[]>({
        queryKey: ["card-logs", id],
        queryFn: () => fetcher(`/api/cards/${id}/logs`),
        enabled: !!id,
    });

    // Récupérer les membres de l'organisation
    const { data: membersData } = useQuery<Array<{ id: string; name: string; email: string; imageUrl: string | null }>>({
        queryKey: ["org-members"],
        queryFn: () => fetcher(`/api/organization/members`),
        enabled: !!id,
    });

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}

                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                    <div className="col-span-3">
                        <div className="w-full space-y-6">
                            {!cardData ? (
                                <>
                                    <Cover.Skeleton />
                                    <Assignees.Skeleton />
                                    <Labels.Skeleton />
                                    <DueDate.Skeleton />
                                </>
                            ) : (
                                <>
                                    <Cover data={cardData} />
                                    <Assignees data={cardData} members={membersData ?? []} />
                                    <Labels data={cardData} />
                                    <DueDate data={cardData} />
                                </>
                            )}

                            <Separator />

                            {!cardData ? <Description.Skeleton /> : <Description data={cardData} />}

                            {!cardData ? <Checklist.Skeleton /> : <Checklist data={cardData} />}

                            <Separator />

                            {/* Section Commentaires */}
                            {cardData && <Comments cardId={cardData.id} />}

                            <Separator />

                            {!auditLogData ? <Activity.Skeleton /> : <Activity items={auditLogData} />}
                        </div>
                    </div>

                    {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
                </div>
            </DialogContent>
        </Dialog>
    );
};
