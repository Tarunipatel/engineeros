import "dotenv/config";

export const DATABASE_URL = process.env.DATABASE_URL ?? "file:./db/engineeros.db";
export const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
export const isLocalFileDb = DATABASE_URL.startsWith("file:");
