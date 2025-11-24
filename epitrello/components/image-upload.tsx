"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
  aspectRatio?: "square" | "video" | "avatar";
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  className,
  aspectRatio = "square",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifications côté client
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux. Maximum 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      // Créer une preview locale
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload le fichier
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'upload");
      }

      const data = await response.json();
      onChange(data.url);
      toast.success("Image uploadée avec succès!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'upload");
      setPreview(value || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    avatar: "aspect-square rounded-full",
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          <div className={cn("relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300", aspectClasses[aspectRatio])}>
            <Image
              src={preview}
              alt="Preview"
              fill
              className={cn("object-cover", aspectRatio === "avatar" && "rounded-full")}
            />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full border-2 border-dashed hover:border-primary/50 transition-colors",
            aspectClasses[aspectRatio]
          )}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Upload en cours...</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8" />
                <div className="text-sm">
                  <span className="font-semibold">Cliquez pour uploader</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF ou WebP (max 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </Button>
      )}
    </div>
  );
}
