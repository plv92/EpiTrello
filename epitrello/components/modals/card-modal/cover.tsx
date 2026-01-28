"use client";

import { CardWithList } from "@/types";
import { Layout, X } from "lucide-react";
import { FormPicker } from "@/components/form/form-picker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-actions";
import { updateCardCover } from "@/actions/update-card-cover";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useState } from "react";

interface CoverProps {
  data: CardWithList;
}

export const Cover = ({ data }: CoverProps) => {
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const { execute: executeUpdateCover } = useAction(updateCardCover, {
    onSuccess: () => {
      toast.success("Couverture mise à jour");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleImageSelect = (image: string) => {
    const boardId = params.boardId as string;
    executeUpdateCover({
      id: data.id,
      boardId,
      coverImage: image,
    });
  };

  const handleRemoveCover = () => {
    const boardId = params.boardId as string;
    executeUpdateCover({
      id: data.id,
      boardId,
      coverImage: null,
    });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <Layout className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Couverture</p>
        
        {data.coverImage && !isEditing ? (
          <div className="relative group">
            <img
              src={data.coverImage}
              alt="Cover"
              className="w-full h-32 object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition rounded-md flex items-center justify-center gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition"
              >
                Changer
              </Button>
              <Button
                onClick={handleRemoveCover}
                variant="destructive"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <FormPicker
              id="cover-image"
              onImageSelect={handleImageSelect}
            />
            {isEditing && (
              <Button
                onClick={() => setIsEditing(false)}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Annuler
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-32 bg-neutral-200" />
      </div>
    </div>
  );
};
