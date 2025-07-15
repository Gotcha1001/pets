import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { db } from "@/configs/db";
import { pets } from "@/configs/schema";
import { ilike, desc } from "drizzle-orm";
import PetImage from "../components/PetImage";
import FeedClient from "../components/FeedClient";

async function fetchPets(search = "", page = 1) {
    const petsPerPage = 10;
    try {
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

        const allPets = await (search
            ? query.where(ilike(pets.type, `%${search}%`))
            : query
        ).execute();

        console.log("All pets fetched (with filter):", allPets);

        const totalPages = Math.max(1, Math.ceil(allPets.length / petsPerPage));
        const paginatedPets = allPets.slice((page - 1) * petsPerPage, page * petsPerPage);

        console.log("Paginated pets:", paginatedPets);
        console.log("Total pages:", totalPages, "Current page:", page);

        return { paginatedPets, totalPages, search, page };
    } catch (error) {
        console.error("Feed query error:", error.message, error);
        return { error: error.message, paginatedPets: [], totalPages: 1, search, page };
    }
}

export default async function Feed({ searchParams }) {
    const search = searchParams?.type?.trim().toLowerCase().replace(/\s+/g, ' ') || "";
    const page = Math.max(1, parseInt(searchParams?.page) || 1);
    const { paginatedPets, totalPages, error } = await fetchPets(search, page);

    return (
        <FeedClient
            paginatedPets={paginatedPets}
            totalPages={totalPages}
            search={search}
            page={page}
            error={error}
        />
    );
}