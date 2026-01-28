"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, X, Crown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inviteMemberToOrganization } from "@/actions/invite-member";
import { removeMemberFromOrganization } from "@/actions/remove-member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
}

interface MembersManagementProps {
  organizationId: string;
  members: Member[];
  currentUserId: string;
}

export const MembersManagement = ({ organizationId, members, currentUserId }: MembersManagementProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Veuillez entrer un email");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("organizationId", organizationId);
      formData.append("email", email);

      const result = await inviteMemberToOrganization(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Membre invité avec succès");
      setEmail("");
      window.location.reload();
    } catch (error) {
      toast.error("Erreur lors de l'invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("organizationId", organizationId);
      formData.append("memberId", memberId);

      const result = await removeMemberFromOrganization(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Membre retiré avec succès");
      window.location.reload();
    } catch (error) {
      toast.error("Erreur lors du retrait du membre");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membres de l'organisation</CardTitle>
        <CardDescription>
          Gérez les membres qui ont accès à cette organisation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire d'invitation */}
        <form onSubmit={handleInvite} className="flex gap-2">
          <Input
            type="email"
            placeholder="Email du membre à inviter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter
          </Button>
        </form>

        {/* Liste des membres */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Membres actuels ({members.length})</h4>
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.user.imageUrl || undefined} />
                    <AvatarFallback>
                      {(member.user.name || member.user.email).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {member.user.name || member.user.email}
                      {member.user.id === currentUserId && (
                        <span className="text-xs text-muted-foreground ml-2">(Vous)</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                  </div>
                  {member.role === "admin" ? (
                    <Badge variant="default" className="ml-2">
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="ml-2">
                      <User className="h-3 w-3 mr-1" />
                      Membre
                    </Badge>
                  )}
                </div>
                
                {member.user.id !== currentUserId && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={isLoading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Retirer ce membre ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir retirer{" "}
                          <strong>{member.user.name || member.user.email}</strong> de
                          l'organisation ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemove(member.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Retirer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
