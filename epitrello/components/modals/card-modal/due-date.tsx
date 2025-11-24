"use client";

import { CardWithList } from "@/types";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateCardDueDate } from "@/actions/update-card-due-date";
import { useAction } from "@/hooks/use-actions";
import { cn } from "@/lib/utils";

interface DueDateProps {
  data: CardWithList;
}

export const DueDate = ({ data }: DueDateProps) => {
  const queryClient = useQueryClient();

  const { execute, isLoading } = useAction(updateCardDueDate, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      toast.success("Date mise à jour");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    execute({
      cardId: data.id,
      dueDate: dateValue || undefined,
    });
  };

  const isOverdue = data.dueDate && new Date(data.dueDate) < new Date() && !data.isCompleted;
  const isDueSoon = data.dueDate && new Date(data.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000) && !data.isCompleted;

  return (
    <div className="flex items-start gap-x-3 w-full">
      <Calendar className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Date d'échéance</p>
        <div className="flex items-center gap-2">
          <Input
            type="datetime-local"
            value={data.dueDate ? format(new Date(data.dueDate), "yyyy-MM-dd'T'HH:mm") : ""}
            onChange={handleDateChange}
            disabled={isLoading}
            className="max-w-[240px]"
          />
          {data.dueDate && (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  isOverdue && "bg-red-100 text-red-700",
                  isDueSoon && !isOverdue && "bg-yellow-100 text-yellow-700",
                  !isOverdue && !isDueSoon && "bg-green-100 text-green-700",
                  data.isCompleted && "bg-green-100 text-green-700"
                )}
              >
                {data.isCompleted ? (
                  "Terminée"
                ) : isOverdue ? (
                  "En retard"
                ) : isDueSoon ? (
                  "Bientôt"
                ) : (
                  "À venir"
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execute({ cardId: data.id, dueDate: undefined })}
                disabled={isLoading}
              >
                Retirer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

DueDate.Skeleton = function DueDateSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-5 w-5 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-4 w-24 mb-2 bg-neutral-200" />
        <Skeleton className="h-10 w-[240px] bg-neutral-200" />
      </div>
    </div>
  );
};
