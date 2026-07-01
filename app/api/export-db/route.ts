import { readFile } from "node:fs/promises";
import path from "node:path";
import { isLocalFileDb } from "@/db/env";

export async function GET() {
  if (!isLocalFileDb) {
    return Response.json(
      { error: "Export isn't available for a remote database. Use `turso db shell` or the Turso dashboard instead." },
      { status: 501 }
    );
  }

  const filePath = path.join(process.cwd(), "db", "engineeros.db");
  const buffer = await readFile(filePath);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="engineeros-${new Date().toISOString().slice(0, 10)}.db"`,
    },
  });
}
