"use client";

import {
    Popover,
    PopoverContent,
    PopoverClose,
    PopoverTrigger
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-actions";
import { createBoard } from "@/actions/create-board";

import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { FormPicker } from "./form-picker";
import { ElementRef, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BOARD_TEMPLATES } from "@/constants/board-templates";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface FormPopoverProps {
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

export const FormPopover = ({
    children,
    side = "bottom",
    align,
    sideOffset = 0,
}: FormPopoverProps) => {
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null);
    const [selectedTemplate, setSelectedTemplate] = useState("blank");

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success("Board created!")
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;

        execute({ title, image, templateId: selectedTemplate });
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
                align={align}
                className="w-80 pt-3"
                side={side}
                sideOffset={sideOffset}
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create Board
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant="ghost"
                    >
                        <X className="h-4 w-4"/>
                    </Button>
                </PopoverClose>
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <FormPicker
                            id="image"
                            errors={fieldErrors}
                            allowCustomUpload={true}
                        />
                        <FormInput 
                            id="title"
                            label="Board Title"
                            type="text"
                            errors={fieldErrors}
                        />
                        
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">
                                Template
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                {BOARD_TEMPLATES.map((template) => (
                                    <button
                                        key={template.id}
                                        type="button"
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={cn(
                                            "p-3 rounded-lg border-2 text-left transition-all hover:border-blue-500",
                                            selectedTemplate === template.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200"
                                        )}
                                    >
                                        <div className="font-medium text-sm">
                                            {template.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {template.description}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <FormSubmit className="w-full">
                        Create
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}
