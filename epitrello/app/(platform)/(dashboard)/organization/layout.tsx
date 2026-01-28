import { Sidebar } from "../_components/sidebar";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const OrganizationLayout = async ({
    children,
}: {
    children: React.ReactNode
}) => {
    const cookieStore = cookies();
    const orgId = cookieStore.get("currentOrgId")?.value;
    const authResult = await auth();

    // Si session invalide, rediriger vers sign-in
    if (!authResult.isValid || !authResult.userId) {
        redirect("/sign-in");
    }

    const userId = authResult.userId;

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

    // Si aucune organisation, rediriger vers select-org
    if (orgs.length === 0) {
        redirect("/select-org");
    }

    // Vérifier que l'orgId dans les cookies existe vraiment
    if (orgId && !orgs.some(org => org.id === orgId)) {
        // L'organisation n'existe plus - rediriger vers select-org
        redirect("/select-org");
    }

    return (
        <main className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
            <div className="flex gap-x-7">
                <div className="w-64 shrink-0 hidden md:block">
                    <Sidebar organizations={orgs} currentOrgId={orgId || undefined} />
                </div>
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </main>
    )
};

export default OrganizationLayout;
