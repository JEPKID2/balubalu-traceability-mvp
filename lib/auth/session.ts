import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

export type AuthRole = "admin" | "analyst" | "viewer";

export type AuthUser = {
  username: string;
  password: string;
  role: AuthRole;
  displayName: string;
};

export type AuthSession = {
  username: string;
  role: AuthRole;
  displayName: string;
  exp: number;
};

const SESSION_COOKIE_NAME = "balu_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

const devFallbackUsers: AuthUser[] = [
  {
    username: "admin",
    password: "balu12345",
    role: "admin",
    displayName: "Administrador Balú"
  }
];

function getAuthSecret() {
  if (process.env.BALU_AUTH_SECRET) {
    return process.env.BALU_AUTH_SECRET;
  }

  if (process.env.NODE_ENV !== "production") {
    return "balu-dev-secret-change-me";
  }

  throw new Error("BALU_AUTH_SECRET no está configurada.");
}

export function getConfiguredUsers(): AuthUser[] {
  const rawUsers = process.env.BALU_AUTH_USERS;

  if (!rawUsers) {
    return process.env.NODE_ENV === "production" ? [] : devFallbackUsers;
  }

  try {
    const parsed = JSON.parse(rawUsers) as Partial<AuthUser>[];

    return parsed
      .filter((user) => user.username && user.password && user.role)
      .map((user) => ({
        username: user.username as string,
        password: user.password as string,
        role: user.role as AuthRole,
        displayName: user.displayName ?? (user.username as string)
      }));
  } catch {
    return process.env.NODE_ENV === "production" ? [] : devFallbackUsers;
  }
}

export function authenticateUser(username: string, password: string) {
  const normalizedUsername = username.trim().toLowerCase();

  return (
    getConfiguredUsers().find(
      (user) =>
        user.username.trim().toLowerCase() === normalizedUsername &&
        user.password === password
    ) ?? null
  );
}

function encodeSegment(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decodeSegment(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

export function createSessionToken(user: AuthUser) {
  const session: AuthSession = {
    username: user.username,
    role: user.role,
    displayName: user.displayName,
    exp: Date.now() + SESSION_DURATION_MS
  };

  const payload = encodeSegment(JSON.stringify(session));
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(decodeSegment(payload)) as AuthSession;

    if (!session.exp || session.exp < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return verifySessionToken(token);
}

export async function setServerSession(user: AuthUser) {
  const cookieStore = await cookies();
  const token = createSessionToken(user);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(Date.now() + SESSION_DURATION_MS)
  });
}

export async function clearServerSession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });
}

export function userHasRole(session: AuthSession | null, allowedRoles: AuthRole[]) {
  if (!session) {
    return false;
  }

  return allowedRoles.includes(session.role);
}
