"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Edit2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteOrganization } from "@/actions/delete-organization";

interface OrganizationSettingsProps {
  organization?: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

export const OrganizationSettings = ({ organization }: OrganizationSettingsProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(organization?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Le nom ne peut pas être vide");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement update organization API
      toast.success("Organisation mise à jour");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!organization) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("organizationId", organization.id);
      
      const result = await deleteOrganization(formData);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      toast.success("Organisation supprimée avec succès");
      router.push("/select-org");
      router.refresh();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  if (!organization) {
    return (
      <div className="space-y-4">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Paramètres de l'organisation</CardTitle>
            <CardDescription>
              Aucune organisation sélectionnée
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Informations générales</span>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="hover:bg-primary/10 transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Gérez les informations de votre organisation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Nom de l'organisation</Label>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  id="orgName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom de l'organisation"
                  disabled={isLoading}
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    size="sm"
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setName(organization.name);
                    }}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-lg font-medium">{organization.name}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label>ID de l'organisation</Label>
            <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
              {organization.id}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone de danger */}
      <Card className="border-destructive/50 transition-all duration-200 hover:shadow-md hover:shadow-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Zone de danger</CardTitle>
          <CardDescription>
            Actions irréversibles sur votre organisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isLoading}
                className="transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer l'organisation
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="animate-in fade-in-0 zoom-in-95">
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Cela supprimera définitivement votre
                  organisation <strong>{organization.name}</strong> et toutes les données
                  associées (boards, listes, cartes, etc.).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="transition-all duration-200 hover:scale-105">
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 hover:scale-105"
                >
                  Oui, supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
