"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markNotificationRead(notificationId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Non authentifié" };
  }

  try {
    await db.notification.update({
      where: {
        id: notificationId,
        userId, // S'assurer que la notification appartient à l'utilisateur
      },
      data: {
        isRead: true,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "Erreur lors de la mise à jour de la notification" };
  }
}

export async function markAllNotificationsRead() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Non authentifié" };
  }

  try {
    await db.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { error: "Erreur lors de la mise à jour des notifications" };
  }
}
