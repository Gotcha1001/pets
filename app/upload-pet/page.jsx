"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Heart, Sparkles } from "lucide-react";

const petSchema = z.object({
    name: z.string().min(1, "Pet name is required"),
    type: z.string().min(1, "Pet type is required"),
    age: z.string().min(1, "Age is required"),
    health: z.string().optional(),
    inoculations: z.string().optional(),
    habits: z.string().optional(),
    contactNumber: z.string().min(1, "Contact number is required").regex(/^\+?\d{10,15}$/, "Invalid phone number"),
    emailAddress: z.string().email("Invalid email address").min(1, "Email address is required"),
    isSelling: z.enum(["selling", "free"]).default("free"),
    price: z.string().optional(),
    image: z
        .any()
        .refine((file) => file instanceof File && file.size > 0, "Image is required")
        .refine((file) => file?.type.startsWith("image/"), "File must be an image"),
}).superRefine((data, ctx) => {
    if (data.isSelling === "selling") {
        if (!data.price) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Price is required when selling",
                path: ["price"],
            });
        } else if (isNaN(parseFloat(data.price)) || parseFloat(data.price) <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Price must be a positive number when selling",
                path: ["price"],
            });
        }
    }
});

export default function UploadPet() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(petSchema),
        defaultValues: {
            name: "",
            type: "",
            age: "",
            health: "",
            inoculations: "",
            habits: "",
            contactNumber: "",
            emailAddress: "",
            isSelling: "free",
            price: "",
            image: null,
        },
    });

    const isSelling = form.watch("isSelling");

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            form.setValue("image", e.dataTransfer.files[0]);
        }
    };

    async function onSubmit(data) {
        setIsSubmitting(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("image", data.image);
            formData.append("name", data.name);
            formData.append("type", data.type);
            formData.append("age", data.age);
            formData.append("health", data.health || "");
            formData.append("inoculations", data.inoculations || "");
            formData.append("habits", data.habits || "");
            formData.append("contactNumber", data.contactNumber);
            formData.append("emailAddress", data.emailAddress);
            formData.append("isSelling", data.isSelling);
            if (data.isSelling === "selling" && data.price) {
                formData.append("price", data.price);
            }

            const response = await fetch("/api/pets", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                router.push("/feed");
            } else {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    throw new Error("Server returned an invalid response");
                }
                throw new Error(errorData.error || "Failed to upload pet");
            }
        } catch (error) {
            console.error("Upload error:", error.message);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                duration: 0.6,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    const floatingElements = Array.from({ length: 6 }, (_, i) => (
        <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
            animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
            }}
            transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
            }}
            style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 10}%`,
            }}
        />
    ));

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden pt-10">
            <div className="absolute inset-0">
                {floatingElements}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            <motion.div
                className="container mx-auto py-8 px-4 relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="flex items-center justify-center mb-8"
                    variants={itemVariants}
                >
                    <Heart className="w-8 h-8 text-pink-400 mr-3" />
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200">
                        Upload a Pet for Adoption
                    </h1>
                    <Sparkles className="w-8 h-8 text-purple-400 ml-3 animate-pulse" />
                </motion.div>
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-500/20 border border-red-400/50 text-red-200 p-4 rounded-lg mb-6 backdrop-blur-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    className="max-w-2xl mx-auto"
                    variants={itemVariants}
                >
                    <div className="bg-purple-900/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/20 shadow-2xl">
                        <Form {...form}>
                            <motion.form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                                variants={containerVariants}
                            >
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-purple-200 font-semibold">Pet Name</FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Input
                                                            placeholder="What's your pet's name?"
                                                            className="bg-purple-800/50 text-purple-100 border-purple-400/50 placeholder-purple-300/50 rounded-lg h-12 focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                                                            {...field}
                                                        />
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-purple-200 font-semibold">Pet Type</FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Input
                                                            placeholder="e.g., Dog, Cat, Rabbit"
                                                            className="bg-purple-800/50 text-purple-100 border-purple-400/50 placeholder-purple-300/50 rounded-lg h-12 focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                                                            {...field}
                                                        />
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-purple-200 font-semibold">Age</FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Input
                                                            placeholder="e.g., 2 years, 6 months"
                                                            className="bg-purple-800/50 text-purple-100 border-purple-400/50 placeholder-purple-300/50 rounded-lg h-12 focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                                                            {...field}
                                                        />
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="health"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-purple-200 font-semibold">Health Information</FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Textarea
                                                            placeholder="Tell us about your pet's health status..."
                                                            className="bg-purple-800/50 text-purple-100 border-purple-400/50 placeholder-purple-300/50 rounded-lg min-h-24 focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200 resize-none"
                                                            {...field}
                                                        />
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="inoculations"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-purple-200 font-semibold">Inoculations</FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Textarea
                                                            placeholder="List vaccinations and medical treatments..."
                                                            className="bg-purple-800/50 text-purple-100 border-purple-400/50 placeholder-purple-300/50 rounded-lg min-h-24 focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200 resize-none"
                                                            {...field}
                                                        />
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="habits"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-purple-200 font-semibold">Habits & Personality</FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Textarea
                                                            placeholder="Describe your pet's personality, habits, and preferences..."
                                                            className="bg-purple-800/50 text-purple-100 border-purple-400/50 placeholder-purple-300/50 rounded-lg min-h-24 focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200 resize-none"
                                                            {...field}
                                                        />
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="contactNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-purple-200 font-semibold">Contact Number</FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Input
                                                            placeholder="e.g., +1234567890"
                                                            className="bg-purple-800/50 text-purple-100 border-purple-400/50 placeholder-purple-300/50 rounded-lg h-12 focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                                                            {...field}
                                                        />
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="emailAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-purple-200 font-semibold">Email Address</FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Input
                                                            placeholder="e.g., example@domain.com"
                                                            className="bg-purple-800/50 text-purple-100 border-purple-400/50 placeholder-purple-300/50 rounded-lg h-12 focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                                                            {...field}
                                                        />
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="isSelling"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-purple-200 font-semibold">Adoption Type</FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <select
                                                            className="bg-purple-800/50 text-purple-100 border-purple-400/50 placeholder-purple-300/50 rounded-lg h-12 focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200 w-full"
                                                            {...field}
                                                        >
                                                            <option value="free">Free Adoption</option>
                                                            <option value="selling">For Sale</option>
                                                        </select>
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                                <AnimatePresence>
                                    {isSelling === "selling" && (
                                        <motion.div
                                            variants={itemVariants}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-purple-200 font-semibold">Price ($)</FormLabel>
                                                        <FormControl>
                                                            <motion.div
                                                                whileFocus={{ scale: 1.02 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    placeholder="e.g., 100.00"
                                                                    className="bg-purple-800/50 text-purple-100 border-purple-400/50 placeholder-purple-300/50 rounded-lg h-12 focus:border-purple-300 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                                                                    {...field}
                                                                />
                                                            </motion.div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-purple-200 font-semibold">Pet Image</FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive
                                                            ? "border-purple-300 bg-purple-600/30"
                                                            : "border-purple-400/50 bg-purple-800/30"
                                                            }`}
                                                        onDragEnter={handleDrag}
                                                        onDragLeave={handleDrag}
                                                        onDragOver={handleDrag}
                                                        onDrop={handleDrop}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            onChange={(e) => field.onChange(e.target.files[0])}
                                                        />
                                                        <Upload className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                                                        <p className="text-purple-200 mb-2">
                                                            {field.value ? field.value.name : "Drop your pet's photo here or click to browse"}
                                                        </p>
                                                        <p className="text-purple-300/70 text-sm">
                                                            Supports JPG, PNG, GIF files
                                                        </p>
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                                <motion.div
                                    variants={itemVariants}
                                    className="pt-4"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed h-14"
                                        >
                                            <AnimatePresence mode="wait">
                                                {isSubmitting ? (
                                                    <motion.div
                                                        key="loading"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center"
                                                    >
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                                        />
                                                        Uploading...
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="submit"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center"
                                                    >
                                                        <Heart className="w-5 h-5 mr-2" />
                                                        Add Pet for Adoption
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </motion.form>
                        </Form>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}