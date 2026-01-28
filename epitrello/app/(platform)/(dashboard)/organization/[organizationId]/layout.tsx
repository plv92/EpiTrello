import { startCase } from "lodash";
import { db } from "@/lib/db";

interface OrganizationIdLayoutProps {
    children: React.ReactNode;
    params: {
        organizationId: string;
    };
}

export async function generateMetadata({ params }: { params: { organizationId: string } }) {
    const organization = await db.organization.findUnique({
        where: { id: params.organizationId },
    });

    return {
        title: startCase(organization?.slug || "organization"),
    };
}

const OrganizationIdLayout = async ({
    children,
}: OrganizationIdLayoutProps) => {
    return <>{children}</>;
};

export default OrganizationIdLayout;
