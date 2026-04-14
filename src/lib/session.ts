import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  userId?: string;
};

function resolveSessionPassword(): string {
  const trimmed = process.env.SESSION_SECRET?.trim() ?? "";
  if (trimmed.length >= 32) return trimmed;
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[stockflow] SESSION_SECRET missing or shorter than 32 characters; using a built-in fallback. Set SESSION_SECRET in production.",
    );
  }
  return "local-dev-only-stockflow-session-secret-min-32!!";
}

export const sessionOptions: SessionOptions = {
  password: resolveSessionPassword(),
  cookieName: "stockflow_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 14,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
