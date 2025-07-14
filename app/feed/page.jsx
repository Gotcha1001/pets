import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { db } from "@/configs/db";
import { pets } from "@/configs/schema";
import { ilike, desc } from "drizzle-orm";

import PetImage from "../components/PetImage";

export default async function Feed({ searchParams }) {
    const search = searchParams?.type?.trim().toLowerCase().replace(/\s+/g, ' ') || "";
    console.log("Search term:", search);
    const page = Math.max(1, parseInt(searchParams?.page) || 1);
    const petsPerPage = 10;

    try {
        // Build the query
        const query = db
            .select({
                id: pets.id,
                name: pets.name,
                type: pets.type,
                age: pets.age,
                health: pets.health,
                imageUrl: pets.imageUrl,
                isSelling: pets.isSelling,
                price: pets.price,
            })
            .from(pets)
            .orderBy(desc(pets.createdAt));

        // Log all pets without filter to check database state
        const allPetsNoFilter = await db
            .select({
                id: pets.id,
                name: pets.name,
                type: pets.type,
                created_at: pets.createdAt,
            })
            .from(pets)
            .orderBy(desc(pets.createdAt))
            .execute();
        console.log("All pets in database (no filter):", allPetsNoFilter);

        // Apply search filter only if search term is provided
        const allPets = await (search
            ? query.where(ilike(pets.type, `%${search}%`))
            : query
        ).execute();
        console.log("All pets fetched (with filter):", allPets);

        const totalPages = Math.max(1, Math.ceil(allPets.length / petsPerPage));
        const paginatedPets = allPets.slice((page - 1) * petsPerPage, page * petsPerPage);
        console.log("Paginated pets:", paginatedPets);
        console.log("Total pages:", totalPages, "Current page:", page);

        return (
            <div className="container mx-auto py-8 pt-10 md:pt-8 p-2">
                <h1 className="text-3xl font-bold mb-4 text-purple-900 text-center">Available Pets</h1>
                <form className="mb-4 flex gap-2" action="/feed">
                    <Input
                        name="type"
                        placeholder="Search by pet type (e.g., Dog, Cat)"
                        defaultValue={search}
                        className="bg-purple-800/50 text-purple-200 border-purple-400"
                    />
                    <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full"
                    >
                        Search
                    </Button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedPets.length === 0 ? (
                        <p className="text-purple-200">No pets found.</p>
                    ) : (
                        paginatedPets.map((pet) => (
                            <Card key={pet.id} className="bg-purple-800/80 border-purple-400">
                                <CardHeader>
                                    <CardTitle className="text-purple-200">{pet.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <PetImage src={pet.imageUrl} alt={pet.name} />
                                    <p className="text-purple-200">Type: {pet.type}</p>
                                    <p className="text-purple-200">Age: {pet.age}</p>
                                    <p className="text-purple-200">Health: {pet.health || "N/A"}</p>
                                    <p className="text-purple-200">
                                        Adoption: {pet.isSelling === "selling" ? `For Sale: $${pet.price || "Not specified"}` : "Free"}
                                    </p>
                                    <Link href={`/pets/${pet.id}`}>
                                        <Button className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full">
                                            View Details
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
                <div className="mt-4 flex gap-2 justify-center">
                    {totalPages > 1 &&
                        Array.from({ length: totalPages }, (_, i) => (
                            <Link
                                key={i}
                                href={`/feed?page=${i + 1}${search ? `&type=${encodeURIComponent(search)}` : ""}`}
                            >
                                <Button
                                    variant={page === i + 1 ? "default" : "outline"}
                                    className={
                                        page === i + 1
                                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                            : "border-purple-400 text-purple-200 hover:bg-purple-800/50"
                                    }
                                >
                                    {i + 1}
                                </Button>
                            </Link>
                        ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Feed query error:", error.message, error);
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-4 text-purple-200">Available Pets</h1>
                <p className="text-red-400">Error loading pets: {error.message}</p>
            </div>
        );
    }
}