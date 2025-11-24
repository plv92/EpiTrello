import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET() {
    try {
        const { userId, orgId } = await auth();

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

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
                        customImage: true,
                    },
                },
            },
        });

        const formattedMembers = members.map((member) => ({
            id: member.user.id,
            name: member.user.name || "",
            email: member.user.email,
            imageUrl: member.user.customImage || member.user.imageUrl,
        }));

        return NextResponse.json(formattedMembers);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
