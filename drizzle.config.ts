import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from "./db/env";

export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema/index.ts",
  dialect: "turso",
  dbCredentials: {
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  },
});
