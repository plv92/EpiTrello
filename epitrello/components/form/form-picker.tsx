"use client";

import { useEffect, useState } from "react";

import { unsplash } from "@/lib/unsplash";
import { Check, Loader2, Upload } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { defaultImages } from "@/constants/images";
import Link from "next/link";
import { FormErrors } from "./form-errors";
import { ImageUpload } from "@/components/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormPickerProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
    onImageSelect?: (image: string) => void;
    allowCustomUpload?: boolean;
};

export const FormPicker = ({
    id,
    errors,
    onImageSelect,
    allowCustomUpload = false,
}: FormPickerProps) => {
    const { pending } = useFormStatus();

    const [images, setImages] = useState<Array<Record<string, any>>>(defaultImages);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState(null);
    const [customImageUrl, setCustomImageUrl] = useState<string>("");

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const result = await unsplash.photos.getRandom({
                    collectionIds: ["317099"],
                    count: 9,
                });

                if (result && result.response) {
                    const newImages = (result.response as Array<Record<string, any>>);
                    setImages(newImages);
                } else {
                    console.error("Failed te get images from unsplash")
                }
            } catch (error) {
                console.log(error);
                setImages(defaultImages);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-sky-700 animate-spin"/>
            </div>
        );
    }

    const content = (
        <div className="grid grid-cols-3 gap-2 mb-2">
            {images.map((image) => (
                <div 
                    key={image.id}
                    className={cn(
                        "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
                        pending && "opacity-50 hover:opacity-50 cursor-auto"
                    )}
                    onClick={() => {
                        if (pending) return;
                        setSelectedImageId(image.id);
                        setCustomImageUrl("");
                        if (onImageSelect) {
                            const imageValue = `${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`;
                            // Pour la couverture, on utilise juste l'URL thumb
                            onImageSelect(image.urls.full);
                        }
                    }}
                >
                    <input
                        type="radio"
                        id={id}
                        name={id}
                        className="hidden"
                        checked={selectedImageId === image.id}
                        disabled={pending}
                        value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
                    />
                    <Image
                        src={image.urls.thumb}
                        alt="Unsplash image"
                        className="object-cover rounded-sm"
                        fill
                    />
                    {selectedImageId === image.id && (
                        <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white"/>
                        </div>
                    )}
                    <Link 
                        href={image.links.html}
                        target="_blank"
                        className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"

                    >
                        {image.user.name}
                    </Link>
                </div>
            ))}
        </div>
    );

    if (!allowCustomUpload) {
        return (
            <div className="relative">
                {content}
                <FormErrors 
                    id="image"
                    errors={errors}
                />
            </div>
        );
    }

    return (
        <div className="relative">
            <Tabs defaultValue="unsplash" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-2">
                    <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
                    <TabsTrigger value="upload">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="unsplash">
                    {content}
                </TabsContent>
                <TabsContent value="upload">
                    <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            Uploadez votre propre image de fond pour ce board
                        </p>
                        <ImageUpload
                            value={customImageUrl}
                            onChange={(url) => {
                                setCustomImageUrl(url);
                                setSelectedImageId(null);
                                if (onImageSelect) {
                                    onImageSelect(url);
                                }
                            }}
                            disabled={pending}
                            aspectRatio="16/9"
                        />
                    </div>
                </TabsContent>
            </Tabs>
            <FormErrors 
                id="image"
                errors={errors}
            />
        </div>
    );
};
