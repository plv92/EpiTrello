"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function signOut() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (sessionToken) {
    // Supprimer la session de la base de données
    await db.session.deleteMany({
      where: { sessionToken },
    });
  }

  // Supprimer les cookies
  cookieStore.delete("session");
  cookieStore.delete("currentOrgId");

  redirect("/");
}
