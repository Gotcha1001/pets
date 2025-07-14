import { db } from "@/configs/db";
import { pets, likes } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { PawPrint } from "lucide-react";
import { toggleLike } from "../../lib/actions";
import PetDetailsClient from "../../components/PetDetailsClient";

export default async function PetDetails({ params }) {
    try {
        const pet = await db
            .select({
                id: pets.id,
                name: pets.name,
                type: pets.type,
                age: pets.age,
                health: pets.health,
                inoculations: pets.inoculations,
                habits: pets.habits,
                imageUrl: pets.imageUrl,
                contactNumber: pets.contactNumber,
                emailAddress: pets.emailAddress,
                isSelling: pets.isSelling,
                price: pets.price,
            })
            .from(pets)
            .where(eq(pets.id, parseInt(params.id)))
            .execute()
            .then((res) => res[0]);

        if (!pet) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="text-center">
                        <PawPrint className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pet Not Found</h1>
                        <p className="text-gray-600">The pet you're looking for doesn't exist.</p>
                    </div>
                </div>
            );
        }

        const user = await currentUser();
        let isLiked = false;

        if (user) {
            isLiked = await db
                .select({ id: likes.id })
                .from(likes)
                .where(eq(likes.userId, user.id))
                .where(eq(likes.petId, params.id))
                .execute()
                .then((res) => res.length > 0);
        }

        return (
            <PetDetailsClient
                pet={pet}
                isLiked={isLiked}
                hasUser={!!user}
                petId={params.id}
                toggleLike={toggleLike}
            />
        );
    } catch (error) {
        console.error("PetDetails error:", error.message, error);
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <PawPrint className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 mb-2">Error Loading Pet</h1>
                        <p className="text-gray-600 mb-4">{error.message}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}