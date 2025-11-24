import { startCase } from "lodash";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function generateMetadata() {
    const { orgId } = await auth();

    if (!orgId) {
        return {
            title: "Organization",
        };
    }

    const organization = await db.organization.findUnique({
        where: { id: orgId },
    });

    return {
        title: startCase(organization?.slug || "organization"),
    };
}

const OrganizationIdLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return <>{children}</>;
};

export default OrganizationIdLayout;
