import { Separator } from "@/components/ui/separator";
import { Info } from "../_components/info";
import { OrganizationSettings } from "./_components/organization-settings";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const SettingsPage = async () => {
    const cookieStore = cookies();
    const orgId = cookieStore.get("currentOrgId")?.value;

    const organization = await db.organization.findUnique({
        where: {
            id: orgId,
        },
    });

    if (!organization) {
        return <div>Organization not found</div>;
    }

    return ( 
        <div className="w-full">
            <Info />
            <Separator className="my-4"/>
            <OrganizationSettings organization={organization} />
        </div>
    );
};

export default SettingsPage;
