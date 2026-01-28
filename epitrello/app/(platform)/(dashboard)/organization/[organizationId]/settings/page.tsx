import { Separator } from "@/components/ui/separator";
import { Info } from "../_components/info";
import { OrganizationSettings } from "./_components/organization-settings";
import { MembersManagement } from "./_components/members-management";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const SettingsPage = async () => {
    const cookieStore = cookies();
    const orgId = cookieStore.get("currentOrgId")?.value;
    const { userId } = await auth();

    if (!userId) {
        return <div>Non authentifié</div>;
    }

    const organization = await db.organization.findUnique({
        where: {
            id: orgId,
        },
    });

    if (!organization) {
        return <div>Organization not found</div>;
    }

    // Récupérer les membres de l'organisation
    const members = await db.organizationMember.findMany({
        where: {
            organizationId: orgId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    imageUrl: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return ( 
        <div className="w-full space-y-4">
            <Info />
            <Separator className="my-4"/>
            <MembersManagement 
                organizationId={organization.id} 
                members={members}
                currentUserId={userId}
            />
            <OrganizationSettings organization={organization} />
        </div>
    );
};

export default SettingsPage;
