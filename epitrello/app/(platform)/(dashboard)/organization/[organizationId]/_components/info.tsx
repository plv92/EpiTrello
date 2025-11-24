import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Image from "next/image";

export const Info = async () => {
    const { orgId } = await auth();

    if (!orgId) {
        return (
            <div className="flex items-center gap-x-4">
                <div className="text-sm text-muted-foreground">No organization selected</div>
            </div>
        );
    }

    const organization = await db.organization.findUnique({
        where: {
            id: orgId,
        },
    });

    if (!organization) {
        return (
            <div className="flex items-center gap-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="text-sm text-yellow-800">
                    <p className="font-semibold">Organization not found</p>
                    <p className="text-xs mt-1">The organization ID in your session doesn't exist. Please select a valid organization.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative">
                {organization.imageUrl ? (
                    <Image 
                        fill
                        src={organization.imageUrl}
                        alt="Organization"
                        className="rounded-md object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-2xl rounded-md">
                        {organization.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-xl">
                    {organization.name}
                </p>
            </div>
        </div>
    );
};

Info.Skeleton = function SkeletonInfo() {
    return (
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative">
                <Skeleton className="w-full h-full absolute"/>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-10 w-[200px]" />
            </div>
        </div>
    );
};
