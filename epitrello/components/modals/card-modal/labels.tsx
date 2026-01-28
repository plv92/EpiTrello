"use client";

import { useState } from "react";
import { CardWithList } from "@/types";
import { Tag, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addCardLabel } from "@/actions/add-card-label";
import { useAction } from "@/hooks/use-actions";

interface LabelsProps {
  data: CardWithList;
}

const PRESET_COLORS = [
  { name: "Rouge", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Jaune", color: "#eab308" },
  { name: "Vert", color: "#22c55e" },
  { name: "Bleu", color: "#3b82f6" },
  { name: "Violet", color: "#a855f7" },
  { name: "Rose", color: "#ec4899" },
  { name: "Gris", color: "#6b7280" },
];

export const Labels = ({ data }: LabelsProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [labelName, setLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].color);

  const { execute, isLoading } = useAction(addCardLabel, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      toast.success("Label ajouté");
      setLabelName("");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!labelName.trim()) return;
        execute({
          cardId: data.id,
          name: labelName.trim(),
          color: selectedColor,
        });
      };

      return (
        <div className="flex items-start gap-x-3 w-full">
          <Tag className="h-5 w-5 mt-0.5 text-neutral-700" />
          <div className="w-full">
            <p className="font-semibold text-neutral-700 mb-2">Labels</p>
            <div className="flex flex-wrap gap-2">
              {data.labels.map((label) => (
                <div
                  key={label.id}
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 rounded-full"
                onClick={() => setIsOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-80">
                  <DialogHeader>
                    <DialogTitle>Ajouter un label</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nom du label</Label>
                      <Input
                        value={labelName}
                        onChange={(e) => setLabelName(e.target.value)}
                        placeholder="ex: Urgent"
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Couleur</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {PRESET_COLORS.map((preset) => (
                          <button
                            key={preset.color}
                            type="button"
                            tabIndex={0}
                            onClick={e => {
                              e.preventDefault();
                              setSelectedColor(preset.color);
                            }}
                            className={
                              `h-10 rounded transition-transform hover:scale-110 focus:outline focus:outline-2 focus:outline-black border-2 ${selectedColor === preset.color ? 'ring-2 ring-black border-black' : 'border-transparent'}`
                            }
                            style={{ backgroundColor: preset.color, cursor: 'pointer' }}
                            title={preset.name}
                            aria-label={preset.name}
                          >
                            {selectedColor === preset.color && (
                              <div className="flex items-center justify-center">
                                <div className="h-3 w-3 bg-white rounded-full" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading || !labelName.trim()}
                      className="w-full"
                    >
                      {isLoading ? "Ajout..." : "Ajouter le label"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      );
};

Labels.Skeleton = function LabelsSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-5 w-5 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-4 w-20 mb-2 bg-neutral-200" />
        <Skeleton className="h-7 w-24 bg-neutral-200" />
      </div>
    </div>
  );
};
