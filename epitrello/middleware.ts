import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/api/webhook"];
const authRoutes = ["/sign-in", "/sign-up", "/select-org"];

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const key = new TextEncoder().encode(SECRET_KEY);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les fichiers statiques et les routes Next.js internes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Récupérer le token de session
  const sessionToken = request.cookies.get("session")?.value;
  const session = sessionToken ? await verifyToken(sessionToken) : null;
  let orgId = request.cookies.get("currentOrgId")?.value;

  // Routes publiques (accessible sans connexion)
  const isPublicRoute = publicRoutes.includes(pathname);

  // 1. Si pas connecté
  if (!session) {
    // Autoriser les routes publiques et les pages d'auth
    if (isPublicRoute || pathname === "/sign-in" || pathname === "/sign-up") {
      return NextResponse.next();
    }
    // Rediriger vers sign-in pour toute autre route
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 2. Si connecté - gérer les redirections
  
  // Rediriger depuis sign-in/sign-up vers le dashboard
  if (pathname === "/sign-in" || pathname === "/sign-up") {
    const redirectPath = orgId ? `/organization/${orgId}` : "/select-org";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Autoriser la home même si connecté (pas de redirection)
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Autoriser /select-org pour choisir une organisation
  if (pathname === "/select-org") {
    return NextResponse.next();
  }

  // Détecter si on est sur une page d'organisation et mettre à jour le cookie
  const orgMatch = pathname.match(/^\/organization\/([^/]+)/);
  if (orgMatch) {
    const newOrgId = orgMatch[1];
    const response = NextResponse.next();
    response.cookies.set("currentOrgId", newOrgId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  // Détecter si on est sur un board et mettre à jour le cookie avec l'org du board
  const boardMatch = pathname.match(/^\/board\/([^/]+)/);
  if (boardMatch) {
    // On ne peut pas faire de requête DB ici, donc on utilise une approche différente
    // Le cookie sera mis à jour via l'API set-organization appelée par le client
    return NextResponse.next();
  }

  // 3. Si connecté mais pas d'organisation, rediriger vers select-org
  if (!orgId) {
    return NextResponse.redirect(new URL("/select-org", request.url));
  }

  // Laisser passer toutes les autres routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
