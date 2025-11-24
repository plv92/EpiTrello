import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

// Version pour le middleware (sans cookies())
export async function verifySession(token: string) {
  const payload = await decrypt(token);
  if (!payload) return null;

  try {
    const dbSession = await db.session.findUnique({
      where: { sessionToken: token },
      include: {
        user: true,
      },
    });

    if (!dbSession || dbSession.expires < new Date()) {
      return null;
    }

    return dbSession;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) return null;

  const payload = await decrypt(session);
  if (!payload) return null;

  // Vérifier si la session existe dans la base de données
  const dbSession = await db.session.findUnique({
    where: { sessionToken: session },
    include: {
      user: {
        include: {
          organizations: {
            include: {
              organization: true,
            },
          },
        },
      },
    },
  });

  if (!dbSession || dbSession.expires < new Date()) {
    return null;
  }

  return {
    user: dbSession.user,
    sessionToken: session,
  };
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function getCurrentOrganization() {
  const cookieStore = cookies();
  const orgId = cookieStore.get("currentOrgId")?.value;
  
  if (!orgId) return null;

  const session = await getSession();
  if (!session) return null;

  const orgMember = session.user.organizations.find(
    (om: any) => om.organizationId === orgId
  );

  return orgMember?.organization || null;
}

export async function setCurrentOrganization(orgId: string) {
  const cookieStore = cookies();
  cookieStore.set("currentOrgId", orgId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function auth() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("session")?.value;
  const orgId = cookieStore.get("currentOrgId")?.value;

  if (!sessionToken) {
    return {
      userId: null,
      orgId: null,
      user: null,
      isValid: false,
    };
  }

  // Décrypter le JWT
  const payload = await decrypt(sessionToken);
  
  if (!payload || !payload.userId) {
    return {
      userId: null,
      orgId: null,
      user: null,
      isValid: false,
    };
  }

  // Vérifier que la session en DB est valide
  let dbSession = null;
  try {
    dbSession = await db.session.findUnique({
      where: { sessionToken },
    });
  } catch (error) {
    // Erreur DB
  }

  // Si session expirée ou n'existe pas en DB, invalider
  if (!dbSession || dbSession.expires < new Date()) {
    return {
      userId: null,
      orgId: null,
      user: null,
      isValid: false,
    };
  }

  // Charger le user depuis la DB
  let user = null;
  try {
    user = await db.user.findUnique({
      where: { id: payload.userId as string },
    });
  } catch (error) {
    // Erreur DB
  }

  // Si user n'existe pas, invalider la session
  if (!user) {
    return {
      userId: null,
      orgId: null,
      user: null,
      isValid: false,
    };
  }

  return {
    userId: user.id,
    orgId: orgId || null,
    user: user,
    isValid: true,
  };
}
