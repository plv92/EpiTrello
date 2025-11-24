import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion } from "@/components/ui/accordion";
import { Organization } from "@prisma/client";

import { NavItem } from "./nav-item";

interface SidebarProps {
    storageKey?: string;
    organizations: Organization[];
    currentOrgId?: string;
}

export const Sidebar = ({
    storageKey = "t-sidebar_state",
    organizations,
    currentOrgId,
}: SidebarProps) => {
    const orgs = organizations.map((org) => ({
        id: org.id,
        slug: org.slug,
        imageUrl: org.imageUrl,
        name: org.name,
    }));

    return (
        <>
            <div className="font-medium text-xs flex items-center mb-1">
                <span className="pl-4">Workspaces</span>
                <Button
                    asChild
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="ml-auto"
                >
                    <Link href="/select-org">
                        <Plus className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
            <Accordion
                type="multiple"
                defaultValue={[currentOrgId || ""]}
                className="space-y-2"
            >
                {orgs.map((organization) => (
                    <NavItem
                        key={organization.id}
                        isActive={currentOrgId === organization.id}
                        isExpanded={currentOrgId === organization.id}
                        organization={organization}
                    />
                ))}
            </Accordion>
        </>
    );
};
