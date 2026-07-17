"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, getSessionToken, verifyCredentials } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  if (!verifyCredentials(email, password)) {
    return { error: "Incorrect email or password." };
  }

  const token = await getSessionToken();
  (await cookies()).set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  // A leading "/" alone isn't enough: "//evil.com" or "/\evil.com" also
  // start with "/" but browsers resolve them as protocol-relative absolute
  // URLs to an external host, turning this into an open redirect.
  const isSafeInternalPath = /^\/(?!\/|\\)/.test(redirectTo);
  redirect(isSafeInternalPath ? redirectTo : "/");
}

export async function logout() {
  (await cookies()).delete(AUTH_COOKIE);
  redirect("/login");
}
