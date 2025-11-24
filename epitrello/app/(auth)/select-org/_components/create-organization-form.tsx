"use client";

import { createOrganization } from "@/actions/create-organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

export function CreateOrganizationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createOrganization(formData);
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        // Succès - le formulaire sera réinitialisé et redirigé par l'action
        formRef.current?.reset();
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l&apos;organisation</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Mon équipe"
          required
          minLength={3}
          disabled={isPending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Création..." : "Créer une organisation"}
      </Button>
    </form>
  );
}
