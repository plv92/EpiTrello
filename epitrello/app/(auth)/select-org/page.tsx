import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrganizationSelector } from "./_components/organization-selector";
import { CreateOrganizationForm } from "./_components/create-organization-form";

export default async function SelectOrgPage() {
  const authResult = await auth();

  if (!authResult.isValid || !authResult.userId) {
    return <div>Please sign in</div>;
  }

  const userId = authResult.userId;

  const organizations = await db.organizationMember.findMany({
    where: {
      userId: userId,
    },
    include: {
      organization: true,
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sélectionnez une organisation</h1>
          <p className="text-gray-500">
            Choisissez l&apos;organisation avec laquelle vous souhaitez travailler
          </p>
        </div>

        {organizations.length > 0 && (
          <OrganizationSelector organizations={organizations} />
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Ou créer une nouvelle organisation
            </span>
          </div>
        </div>

        <CreateOrganizationForm />
      </div>
    </div>
  );
}
