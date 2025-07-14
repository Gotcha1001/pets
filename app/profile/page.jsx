import { db } from "@/configs/db";
import { likes, pets } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import ProfileClient from "../components/ProfileClient";

export default async function Profile() {
    const user = await currentUser();

    if (!user) return <ProfileClient user={null} userLikes={[]} />;

    // Serialize user data to plain object
    const serializedUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddresses?.[0]?.emailAddress || "",
        imageUrl: user.imageUrl,
    };

    // Using raw SQL with type casting to handle the mismatch
    const userLikesRaw = await db
        .select({
            likeId: likes.id,
            petId: pets.id,
            petName: pets.name,
            petType: pets.type,
            petAge: pets.age,
            petImageUrl: pets.imageUrl,
            isSelling: pets.isSelling,
            price: pets.price,
        })
        .from(likes)
        .leftJoin(pets, sql`${likes.petId}::integer = ${pets.id}`)
        .where(eq(likes.userId, user.id));

    // Restructure the data to match your original structure
    const userLikes = userLikesRaw.map((row) => ({
        id: row.likeId,
        pet: row.petId
            ? {
                id: row.petId,
                name: row.petName,
                type: row.petType,
                age: row.petAge,
                imageUrl: row.petImageUrl,
                isSelling: row.isSelling,
                price: row.price,
            }
            : null,
    }));

    return <ProfileClient user={serializedUser} userLikes={userLikes} />;
}