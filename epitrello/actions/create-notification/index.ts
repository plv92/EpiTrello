"use server";

import { db } from "@/lib/db";

interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  cardId?: string;
  boardId?: string;
  invitationId?: string;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  cardId,
  boardId,
  invitationId,
}: CreateNotificationParams) {
  try {
    await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        cardId,
        boardId,
        invitationId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { error: "Erreur lors de la création de la notification" };
  }
}
