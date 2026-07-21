"use server";

import { db } from "@/db/client";
import { roadmapTopics } from "@/db/schema";
import type { RoadmapStatus } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { today } from "@/lib/date";
import { requireAuthenticatedUser } from "@/lib/session";

export async function updateTopicStatus(topicId: number, status: RoadmapStatus, path: string) {
  const user = await requireAuthenticatedUser();
  await db
    .update(roadmapTopics)
    .set({ status, completedAt: status === "completed" ? today() : null })
    .where(and(eq(roadmapTopics.id, topicId), eq(roadmapTopics.userId, user.id)));
  revalidatePath(path);
  revalidatePath("/");
}

export async function updateTopicNotes(topicId: number, notes: string, path: string) {
  const user = await requireAuthenticatedUser();
  await db
    .update(roadmapTopics)
    .set({ notes })
    .where(and(eq(roadmapTopics.id, topicId), eq(roadmapTopics.userId, user.id)));
  revalidatePath(path);
}
