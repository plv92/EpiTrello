import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  const { cardId } = params;
  const comments = await db.comment.findMany({
    where: { cardId },
    orderBy: { createdAt: "asc" },
    include: { user: true },
  });
  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { cardId } = params;
  const { content } = await req.json();
  if (!content || typeof content !== "string" || content.length < 1 || content.length > 1000) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }
  const comment = await db.comment.create({
    data: {
      cardId,
      userId: user.id,
      content,
    },
    include: { user: true },
  });
  return NextResponse.json(comment);
}
