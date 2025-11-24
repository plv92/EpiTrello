import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  
  // Supprimer tous les cookies de session
  cookieStore.delete("session");
  cookieStore.delete("currentOrgId");
  
  // Rediriger vers sign-in
  return NextResponse.redirect(new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}
