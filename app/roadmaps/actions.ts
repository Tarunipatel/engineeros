"use server";

import { db } from "@/db/client";
import { roadmapTopics } from "@/db/schema";
import type { RoadmapStatus } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { today } from "@/lib/date";

export async function updateTopicStatus(topicId: number, status: RoadmapStatus, path: string) {
  await db
    .update(roadmapTopics)
    .set({ status, completedAt: status === "completed" ? today() : null })
    .where(eq(roadmapTopics.id, topicId));
  revalidatePath(path);
  revalidatePath("/");
}

export async function updateTopicNotes(topicId: number, notes: string, path: string) {
  await db.update(roadmapTopics).set({ notes }).where(eq(roadmapTopics.id, topicId));
  revalidatePath(path);
}
