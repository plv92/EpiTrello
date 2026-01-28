"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Organization {
  id: string;
  name: string;
  imageUrl: string | null;
}

interface OrganizationSwitcherProps {
  organizations: Organization[];
  currentOrganizationId?: string;
}

export function OrganizationSwitcher({
  organizations,
  currentOrganizationId,
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentOrg = organizations.find((org) => org.id === currentOrganizationId);

  const handleOrgChange = async (orgId: string) => {
    if (orgId === currentOrganizationId) return;
    
    startTransition(async () => {
      try {
        // Navigation immédiate pour une meilleure UX
        router.push(`/organization/${orgId}`);
        
        // Définir l'organisation en arrière-plan
        fetch("/api/set-organization", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organizationId: orgId }),
        }).catch(console.error);
      } catch (error) {
        console.error("Error switching organization:", error);
      }
    });
  };

  if (!currentOrg) {
    return null;
  }

  const initials = currentOrg.name.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          disabled={isPending}
        >
          <div className="flex items-center gap-x-2">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Avatar className="h-7 w-7">
                <AvatarImage src={currentOrg.imageUrl || undefined} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            )}
            <span className="truncate">{currentOrg.name}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Organisations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleOrgChange(org.id)}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={org.imageUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {org.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{org.name}</span>
              </div>
              {org.id === currentOrganizationId && (
                <Check className="h-4 w-4" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/select-org" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            <span>Créer une organisation</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
