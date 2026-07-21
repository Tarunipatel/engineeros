"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { createSession, destroyCurrentSession } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string };

const GENERIC_ERROR = "Incorrect email or password.";
const RATE_LIMIT_ERROR = "Too many attempts. Wait a few minutes and try again.";

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(`login:${ip}`, 10, 5 * 60 * 1000)) {
    return { error: RATE_LIMIT_ERROR };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  // Same generic error whether the email doesn't exist or the password is
  // wrong — distinguishing them lets an attacker enumerate valid accounts.
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: GENERIC_ERROR };
  }

  await createSession(user.id);

  // A leading "/" alone isn't enough: "//evil.com" or "/\evil.com" also
  // start with "/" but browsers resolve them as protocol-relative absolute
  // URLs to an external host, turning this into an open redirect.
  const isSafeInternalPath = /^\/(?!\/|\\)/.test(redirectTo);
  redirect(isSafeInternalPath ? redirectTo : "/");
}

export async function logout() {
  await destroyCurrentSession();
  redirect("/login");
}
