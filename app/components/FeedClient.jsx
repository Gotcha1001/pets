'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import PetImage from "../components/PetImage";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { petTypes } from "../data/petTypes";

export default function FeedClient({ paginatedPets, totalPages, search, page, error }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Handle icon click to filter by pet type
    const handleIconFilter = useCallback((type) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('type', type.toLowerCase());
        newParams.set('page', '1'); // Reset to first page on new filter
        router.push(`/feed?${newParams.toString()}`);
    }, [router, searchParams]);

    return (
        <div className="container mx-auto py-8 pt-20 md:pt-8 p-2">
            <h1 className="text-3xl font-bold mb-4 text-purple-900 text-center">Available Pets</h1>

            {/* Icon Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                {petTypes.map(({ type, icon: Icon, label }) => (
                    <Button
                        key={type}
                        onClick={() => handleIconFilter(type)}
                        className={`p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transition-all duration-300 transform hover:scale-110 ${search.toLowerCase() === type.toLowerCase() ? 'ring-2 ring-purple-300' : ''
                            }`}
                        title={`Filter by ${label}`}
                    >
                        <Icon className="w-6 h-6" />
                        <span className="ml-2 hidden sm:inline">{label}</span>
                    </Button>
                ))}
                <Button
                    onClick={() => router.push('/feed?page=1')}
                    className={`p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transition-all duration-300 transform hover:scale-110 ${!search ? 'ring-2 ring-purple-300' : ''
                        }`}
                    title="Show All Pets"
                >
                    <span className="hidden sm:inline">All</span>
                    <span className="sm:hidden">All</span>
                </Button>
            </div>

            {/* Search Form */}
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

            {error ? (
                <p className="text-red-400">Error loading pets: {error}</p>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
}