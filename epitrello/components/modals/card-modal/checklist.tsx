"use client";

import { useState } from "react";
import { CardWithList } from "@/types";
import { CheckSquare, Plus } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { addChecklistItem } from "@/actions/add-checklist-item";
import { toggleChecklistItem } from "@/actions/toggle-checklist-item";
import { useAction } from "@/hooks/use-actions";

interface ChecklistProps {
  data: CardWithList;
}

export const Checklist = ({ data }: ChecklistProps) => {
  const queryClient = useQueryClient();
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { execute: executeAdd, isLoading: isAddLoading } = useAction(addChecklistItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      toast.success("Élément ajouté");
      setNewItemTitle("");
      setIsAdding(false);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeToggle } = useAction(toggleChecklistItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    
    executeAdd({
      cardId: data.id,
      title: newItemTitle.trim(),
    });
  };

  const completedCount = data.checklist.filter((item) => item.isCompleted).length;
  const totalCount = data.checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="flex items-start gap-x-3 w-full">
      <CheckSquare className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-neutral-700">Checklist</p>
          {totalCount > 0 && (
            <span className="text-xs text-neutral-500">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>

        {totalCount > 0 && (
          <div className="space-y-1">
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500">{Math.round(progress)}% terminé</p>
          </div>
        )}

        <div className="space-y-2">
          {data.checklist.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-neutral-50 transition"
            >
              <Checkbox
                checked={item.isCompleted}
                onCheckedChange={(checked) => {
                  executeToggle({
                    id: item.id,
                    isCompleted: checked as boolean,
                  });
                }}
              />
              <span
                className={`flex-1 text-sm ${
                  item.isCompleted ? "line-through text-neutral-500" : ""
                }`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {isAdding ? (
          <form onSubmit={handleAddItem} className="space-y-2">
            <Input
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Ajouter un élément..."
              disabled={isAddLoading}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isAddLoading || !newItemTitle.trim()}
              >
                Ajouter
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setNewItemTitle("");
                }}
                disabled={isAddLoading}
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un élément
          </Button>
        )}
      </div>
    </div>
  );
};

Checklist.Skeleton = function ChecklistSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-5 w-5 bg-neutral-200" />
      <div className="w-full space-y-2">
        <Skeleton className="h-4 w-24 bg-neutral-200" />
        <Skeleton className="h-8 w-full bg-neutral-200" />
      </div>
    </div>
  );
};
