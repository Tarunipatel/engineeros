import { libsqlClient, db } from "@/db/client";
import { runProductionMigration } from "@/db/scripts/migrate-production-logic";

/**
 * One-time production cutover for the multi-user migration. Protected by a
 * secret token (not session auth — the users/sessions tables don't exist
 * yet when this first runs, so there's nothing to log in with). Excluded
 * from middleware's auth matcher for the same reason. Remove this route
 * once the migration has run successfully in production.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token || token !== process.env.MIGRATION_SECRET) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const ownerEmail = process.env.ADMIN_EMAIL ?? process.env.OWNER_EMAIL;
  const ownerPassword = process.env.ADMIN_PASSWORD ?? process.env.OWNER_PASSWORD;
  if (!ownerEmail || !ownerPassword) {
    return Response.json({ error: "ADMIN_EMAIL/ADMIN_PASSWORD (or OWNER_EMAIL/OWNER_PASSWORD) not set" }, { status: 500 });
  }

  const result = await runProductionMigration(libsqlClient, db, {
    ownerEmail,
    ownerPassword,
    ownerName: process.env.OWNER_NAME ?? "Taruni Patel",
  });

  return Response.json(result, { status: result.ok ? 200 : 500 });
}
