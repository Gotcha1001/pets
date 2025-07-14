"use server";

import { db } from "@/configs/db";
import { likes } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export async function removeLike(formData) {
  const likeId = formData.get("likeId");
  await db
    .delete(likes)
    .where(eq(likes.id, parseInt(likeId)))
    .execute();
  revalidatePath("/profile");
}

export async function toggleLike(formData) {
  const petId = formData.get("petId");
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const existingLike = await db
    .select({ id: likes.id })
    .from(likes)
    .where(eq(likes.userId, user.id))
    .where(eq(likes.petId, petId))
    .execute()
    .then((res) => res[0]);

  if (existingLike) {
    await db.delete(likes).where(eq(likes.id, existingLike.id)).execute();
  } else {
    await db.insert(likes).values({ userId: user.id, petId }).execute();
  }

  revalidatePath(`/pets/${petId}`);
}
