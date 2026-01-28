import { db } from "@/lib/db";

export async function getCardComments(cardId: string) {
  return db.comment.findMany({
    where: { cardId },
    orderBy: { createdAt: "asc" },
    include: {
      user: true,
    },
  });
}
