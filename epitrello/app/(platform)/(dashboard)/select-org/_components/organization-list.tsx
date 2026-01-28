"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { createOrganization } from "@/actions/create-organization";

interface Organization {
  id: string;
  name: string;
  imageUrl: string | null;
}

interface OrganizationListProps {
  organizations: Organization[];
}

export const OrganizationList = ({ organizations }: OrganizationListProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [orgName, setOrgName] = useState("");

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orgName.trim()) {
      toast.error("Le nom de l'organisation est requis");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createOrganization({ name: orgName });

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.data) {
          toast.success("Organisation créée avec succès!");
          setIsOpen(false);
          setOrgName("");
          router.push(`/organization/${result.data.id}`);
        }
      } catch (error) {
        toast.error("Une erreur est survenue");
      }
    });
  };

  const handleSelectOrg = async (orgId: string) => {
    try {
      await fetch("/api/set-organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: orgId }),
      });
      
      router.push(`/organization/${orgId}`);
    } catch (error) {
      toast.error("Erreur lors de la sélection de l'organisation");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {organizations.length > 0 ? "Vos organisations" : "Bienvenue sur Epitrello"}
        </h1>
        <p className="text-muted-foreground">
          {organizations.length > 0 
            ? "Sélectionnez une organisation ou créez-en une nouvelle"
            : "Créez votre première organisation pour commencer"
          }
        </p>
      </div>

      {/* Liste des organisations existantes */}
      {organizations.length > 0 && (
        <div className="space-y-2 mb-6">
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => handleSelectOrg(org.id)}
              className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={org.imageUrl || undefined} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {org.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{org.name}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}

      {/* Bouton créer une organisation */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full">
            <Plus className="h-5 w-5 mr-2" />
            Créer une organisation
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une organisation</DialogTitle>
            <DialogDescription>
              Donnez un nom à votre organisation pour commencer
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateOrg} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'organisation</Label>
              <Input
                id="name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Mon équipe"
                disabled={isPending}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Création..." : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
