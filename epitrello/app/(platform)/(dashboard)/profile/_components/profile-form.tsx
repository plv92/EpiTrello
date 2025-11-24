"use client";

import { useState, useTransition } from "react";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { User as UserIcon, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { updateProfile } from "@/actions/update-profile";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user.email.charAt(0).toUpperCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditingPassword && (!currentPassword || !newPassword)) {
      toast.error("Veuillez remplir tous les champs du mot de passe");
      return;
    }

    startTransition(async () => {
      const result = await updateProfile({
        name,
        email,
        currentPassword: isEditingPassword ? currentPassword : undefined,
        newPassword: isEditingPassword ? newPassword : undefined,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Profil mis à jour avec succès!");
        setCurrentPassword("");
        setNewPassword("");
        setIsEditingPassword(false);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <Card className="border-2 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Photo de profil</CardTitle>
          <CardDescription>Uploadez votre propre image ou utilisez l'avatar généré</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24 border-4 border-primary/10">
                <AvatarImage 
                  src={user.customImage || user.imageUrl || undefined} 
                  alt={user.name || user.email} 
                />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {user.customImage && (
                <p className="text-xs text-green-600 font-medium">Image personnalisée</p>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                {user.customImage 
                  ? "Vous utilisez une image personnalisée. Vous pouvez la remplacer ou revenir à l'avatar automatique."
                  : "Uploadez votre propre image de profil pour personnaliser votre compte."}
              </p>
              <ImageUpload
                value={user.customImage || ""}
                onChange={(url) => {
                  // Mettre à jour directement via une action
                  startTransition(async () => {
                    const result = await updateProfile({
                      name,
                      email,
                      customImage: url,
                    });
                    if (result.error) {
                      toast.error(result.error);
                    } else {
                      toast.success("Photo mise à jour!");
                    }
                  });
                }}
                disabled={isPending}
                aspectRatio="avatar"
                className="max-w-[200px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="border-2 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Mettez à jour vos informations de base</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              Nom complet
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              disabled={isPending}
              className="transition-all duration-150 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              disabled={isPending}
              className="transition-all duration-150 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="border-2 hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mot de passe</CardTitle>
              <CardDescription>Changez votre mot de passe de connexion</CardDescription>
            </div>
            {!isEditingPassword && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingPassword(true)}
                disabled={isPending}
              >
                Modifier
              </Button>
            )}
          </div>
        </CardHeader>
        {isEditingPassword && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Mot de passe actuel
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isPending}
                  className="pr-10 transition-all duration-150 focus:ring-2 focus:ring-primary/20"
                  required={isEditingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isPending}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isPending}
                  className="pr-10 transition-all duration-150 focus:ring-2 focus:ring-primary/20"
                  required={isEditingPassword}
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isPending}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 6 caractères
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditingPassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                }}
                disabled={isPending}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-150 min-w-[140px]"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Enregistrer
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
