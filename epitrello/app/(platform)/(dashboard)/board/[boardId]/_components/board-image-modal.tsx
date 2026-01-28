"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateBoard } from "@/actions/update-board";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FormPicker } from "@/components/form/form-picker";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BoardImageModalProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

export const BoardImageModal = ({ id, isOpen, onClose }: BoardImageModalProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedImage, setSelectedImage] = useState<string>("");

    const onSubmit = async () => {
        if (!selectedImage) {
            toast.error("Veuillez sélectionner une image");
            return;
        }

        startTransition(async () => {
            const result = await updateBoard({
                id,
                image: selectedImage,
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Image de fond mise à jour !");
                router.refresh();
                onClose();
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Changer l&apos;image de fond</DialogTitle>
                    <DialogDescription>
                        Sélectionnez une nouvelle image de fond pour ce board
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <FormPicker
                        id="board-image"
                        onImageSelect={setSelectedImage}
                        allowCustomUpload={true}
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={onSubmit}
                            disabled={isPending || !selectedImage}
                        >
                            {isPending ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
