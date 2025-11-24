"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Organization {
  organizationId: string;
  organization: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

interface OrganizationSelectorProps {
  organizations: Organization[];
}

export function OrganizationSelector({ organizations }: OrganizationSelectorProps) {
  const router = useRouter();

  const handleSelect = async (orgId: string) => {
    // Définir l'organisation active via l'API
    await fetch("/api/set-organization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: orgId }),
    });
    
    router.push(`/organization/${orgId}`);
    router.refresh();
  };

  return (
    <div className="space-y-2">
      {organizations.map(({ organization }) => (
        <Button
          key={organization.id}
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleSelect(organization.id)}
        >
          <div className="flex items-center gap-x-2">
            {organization.imageUrl ? (
              <img
                src={organization.imageUrl}
                alt={organization.name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                {organization.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span>{organization.name}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
