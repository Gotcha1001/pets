import { db } from "@/configs/db";
import { pets } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { uploadImage } from "../../lib/cloudinary";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) {
      console.error("No user found in currentUser");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const file = formData.get("image");
    if (!file) {
      console.error("Image missing in formData");
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    const type = formData.get("type")?.trim().toLowerCase();
    if (!type) {
      console.error("Pet type is missing or invalid");
      return NextResponse.json(
        { error: "Pet type is required" },
        { status: 400 }
      );
    }
    const imageUrl = await uploadImage(file);
    const petData = {
      name: formData.get("name"),
      type: type, // Normalized to lowercase
      age: formData.get("age"),
      health: formData.get("health") || "",
      inoculations: formData.get("inoculations") || "",
      habits: formData.get("habits") || "",
      imageUrl,
      userId: user.id,
      contactNumber: formData.get("contactNumber"),
      emailAddress: formData.get("emailAddress"),
      isSelling: formData.get("isSelling"),
      price: formData.get("price") || null,
    };
    const insertedPet = await db.insert(pets).values(petData).returning();
    console.log("Pet inserted successfully:", insertedPet[0]); // Log inserted pet
    // Log all pets to confirm database state
    const allPets = await db.select().from(pets).execute();
    console.log("All pets in database after insertion:", allPets);
    revalidatePath("/feed"); // Invalidate feed cache
    return NextResponse.json({ success: true, pet: insertedPet[0] });
  } catch (error) {
    console.error("API /pets error:", error.message, error);
    return NextResponse.json(
      { error: error.message || "Failed to upload pet" },
      { status: 500 }
    );
  }
}
