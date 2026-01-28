import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrganizationList } from "./_components/organization-list";

const SelectOrgPage = async () => {
    const { userId, isValid } = await auth();

    if (!isValid || !userId) {
        redirect("/sign-in");
    }

    // Récupérer les organisations de l'utilisateur
    const organizations = await db.organizationMember.findMany({
        where: {
            userId: userId,
        },
        include: {
            organization: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const orgs = organizations.map((om) => om.organization);

    return (
        <div className="w-full mb-20">
            <OrganizationList organizations={orgs} />
        </div>
    );
};

export default SelectOrgPage;
