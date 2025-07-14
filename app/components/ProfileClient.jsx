"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { removeLike } from "@/app/lib/actions";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";

export default function ProfileClient({ user, userLikes }) {
    if (!user)
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-xl"
                >
                    Please sign in
                </motion.div>
            </div>
        );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const cardVariants = {
        hidden: {
            scale: 0.8,
            opacity: 0,
            rotateX: -15,
        },
        visible: {
            scale: 1,
            opacity: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden ">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,69,193,0.1),transparent_70%)]"></div>
            <motion.div
                className="container mx-auto py-12 px-4 relative z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section */}
                <motion.div
                    className="text-center mb-16"
                    variants={itemVariants}
                >
                    <motion.div
                        className="inline-flex items-center gap-3 mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mt-20">
                            {user.firstName}'s Profile
                        </h1>
                    </motion.div>
                    <motion.h2
                        className="text-3xl font-semibold text-purple-200 mb-8"
                        variants={itemVariants}
                    >
                        Liked Pets
                    </motion.h2>
                </motion.div>
                {/* Content Section */}
                <motion.div variants={itemVariants}>
                    {userLikes.length === 0 ? (
                        <motion.div
                            className="text-center py-20"
                            variants={cardVariants}
                        >
                            <motion.div
                                className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <Heart className="w-12 h-12 text-purple-300" />
                            </motion.div>
                            <p className="text-purple-200 text-xl">No liked pets yet.</p>
                            <p className="text-purple-400 mt-2">Start exploring to find your perfect companion!</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                        >
                            {userLikes.map((like, index) =>
                                like.pet ? (
                                    <motion.div
                                        key={like.id}
                                        variants={cardVariants}
                                        whileHover={{
                                            scale: 1.05,
                                            rotateY: 5,
                                            z: 50,
                                        }}
                                        className="perspective-1000"
                                    >
                                        <Card className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 backdrop-blur-sm border-purple-600/30 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                                                    <motion.div
                                                        className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                                                        animate={{
                                                            scale: [1, 1.2, 1],
                                                            opacity: [1, 0.7, 1],
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            delay: index * 0.2,
                                                        }}
                                                    />
                                                    {like.pet.name}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <motion.div
                                                    className="relative overflow-hidden rounded-xl"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                >
                                                    <img
                                                        src={like.pet.imageUrl}
                                                        alt={like.pet.name}
                                                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </motion.div>
                                                <div className="space-y-2">
                                                    <motion.p
                                                        className="text-purple-200 flex items-center gap-2"
                                                        whileHover={{ x: 5 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                    >
                                                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                                        Type: <span className="text-white font-medium">{like.pet.type}</span>
                                                    </motion.p>
                                                    <motion.p
                                                        className="text-purple-200 flex items-center gap-2"
                                                        whileHover={{ x: 5 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                    >
                                                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                                        Age: <span className="text-white font-medium">{like.pet.age}</span>
                                                    </motion.p>
                                                    <motion.p
                                                        className="text-purple-200 flex items-center gap-2"
                                                        whileHover={{ x: 5 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                    >
                                                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                                        Adoption: <span className="text-white font-medium">
                                                            {like.pet.isSelling === "selling" ? `For Sale: $${like.pet.price || "Not specified"}` : "Free"}
                                                        </span>
                                                    </motion.p>
                                                </div>
                                                <form action={removeLike}>
                                                    <input type="hidden" name="likeId" value={like.id} />
                                                    <motion.div
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <Button
                                                            type="submit"
                                                            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 group"
                                                        >
                                                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                            Remove
                                                        </Button>
                                                    </motion.div>
                                                </form>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ) : null
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}