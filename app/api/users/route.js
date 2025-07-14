import { db } from "@/configs/db";
import { users } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const user = await currentUser();

    if (!user) {
      console.log("No user found in currentUser");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      id: clerkId,
      primaryEmailAddress,
      firstName,
      lastName,
      publicMetadata,
    } = user;
    const email = primaryEmailAddress?.emailAddress;
    const name = `${firstName || ""} ${lastName || ""}`.trim() || "Unknown";
    const isAdmin = !!publicMetadata?.admin;

    console.log("User data to save:", { clerkId, email, name, isAdmin });

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .execute();

    if (existingUser.length > 0) {
      // Update existing user
      const updatedUser = await db
        .update(users)
        .set({
          email,
          name,
          isAdmin,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, clerkId))
        .returning();

      console.log("User updated:", updatedUser[0]);
      return NextResponse.json({
        message: "User updated successfully",
        user: updatedUser[0],
      });
    }

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        clerkId,
        email,
        name,
        isAdmin,
      })
      .returning();

    console.log("User created:", newUser[0]);
    return NextResponse.json({
      message: "User created successfully",
      user: newUser[0],
    });
  } catch (error) {
    console.error("Error processing user:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
