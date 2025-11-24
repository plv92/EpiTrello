import { Plus } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { FormPopover } from "@/components/form/form-popover";
import { getCurrentUser, auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = async () => {
    const user = await getCurrentUser();
    const { orgId } = await auth();

    if (!user) {
        return null;
    }

    // Récupérer les organisations de l'utilisateur
    const organizations = await db.organizationMember.findMany({
        where: {
            userId: user.id,
        },
        include: {
            organization: true,
        },
    });

    const orgs = organizations.map((om) => om.organization);

    return (
        <nav className="fixed px-4 z-50 top-0 w-full h-14 border-b shadow-sm bg-white flex items-center">
            <MobileSidebar organizations={orgs} currentOrgId={orgId || undefined} />
            <div className="flex items-center gap-x-4">
                <Logo href={orgId ? `/organization/${orgId}` : "/select-org"} />
                <FormPopover align="start" side="bottom" sideOffset={18}>
                    <Button variant="primary" size="sm" className="rounded-sm hidden md:block h-auto py-1.5 px-2">
                        Create
                    </Button>
                </FormPopover>
                <FormPopover>
                    <Button variant="primary" size="sm" className="rounded-sm block md:hidden">
                        <Plus className="h-4 w-4"/>
                    </Button>
                </FormPopover>
            </div>
            <div className="ml-auto flex items-center gap-x-2">
                <OrganizationSwitcher 
                    organizations={orgs}
                    currentOrganizationId={orgId || undefined}
                />
                <UserButton user={user} />
            </div>
        </nav>
    );
};
