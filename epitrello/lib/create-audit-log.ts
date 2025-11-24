import { auth, getCurrentUser } from "@/lib/auth";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

interface Props {
    entityId: string;
    entityType: ENTITY_TYPE;
    entityTitle: string;
    action: ACTION;
};

export const createAuditLog = async (props: Props) => {
    try {
        const { orgId } = await auth();
        const user = await getCurrentUser();

        if (!user || !orgId) {
            throw new Error("User not found!");
        }

        const { entityId, entityType, entityTitle, action } = props;

        await db.auditLog.create({
            data: {
                orgId,
                entityId,
                entityType,
                entityTitle,
                action,
                userId: user.id,
                userImage: user?.imageUrl || "",
                userName: user?.name || user.email,
            }
        });

        console.log(`${entityTitle} created`);
    } catch (error) {
        console.log("[AUDIT_LOG_ERROR]", error);
    };
};
