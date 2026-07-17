const encoder = new TextEncoder();

async function hmac(secret: string, message: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const AUTH_COOKIE = "eos_session";

/**
 * Single shared session token, derived from the admin credentials via HMAC
 * rather than stored as the raw password, so the cookie itself never
 * contains the password. Runs on both the Edge (middleware) and Node
 * (server actions) runtimes via the Web Crypto API.
 */
export async function getSessionToken() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD are not set");
  return hmac(password, `engineeros-session:${email}`);
}

function timingSafeEqual(a: string, b: string) {
  const encoded = [encoder.encode(a), encoder.encode(b)];
  const length = Math.max(encoded[0].length, encoded[1].length, 1);
  let diff = encoded[0].length ^ encoded[1].length;
  for (let i = 0; i < length; i++) {
    diff |= (encoded[0][i] ?? 0) ^ (encoded[1][i] ?? 0);
  }
  return diff === 0;
}

/**
 * Compares against fixed-length inputs so a plain `===` (which short-circuits
 * on the first mismatched character) can't leak how many leading characters
 * of the guess were correct via response-time differences.
 */
export function verifyCredentials(email: string, password: string) {
  const emailOk = timingSafeEqual(email, process.env.ADMIN_EMAIL ?? "");
  const passwordOk = timingSafeEqual(password, process.env.ADMIN_PASSWORD ?? "");
  return emailOk && passwordOk;
}
