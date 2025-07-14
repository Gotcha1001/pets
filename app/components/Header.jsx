'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser, UserButton } from "@clerk/nextjs";
import { PawPrint, Heart, User, ShieldCheck, Plus, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
    const { user, isSignedIn } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

    // Force session refresh to ensure publicMetadata is up-to-date
    useEffect(() => {
        if (isSignedIn && user) {
            user.reload().then(() => {
                console.log("User reloaded, publicMetadata:", user?.publicMetadata);
            });
        }
    }, [isSignedIn, user]);

    // Debug log to check publicMetadata
    if (isSignedIn) {
        console.log("User publicMetadata:", user?.publicMetadata);
    }

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className=" bg-gradient-to-br from-purple-900/80 via-purple-800/80 to-indigo-900/80 backdrop-blur-sm border-b border-purple-500/20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <PawPrint className="w-8 h-8 text-purple-300 animate-pulse" />
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                        Pet Adoption
                    </span>
                </Link>
                {/* Hamburger Menu Button for Mobile */}
                <button
                    className="md:hidden text-purple-200"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-4">
                    <SignedIn>
                        <Link href="/feed">
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <Heart className="w-5 h-5 mr-2" />
                                Feed
                            </Button>
                        </Link>
                        <Link href="/upload-pet">
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <Plus className="w-5 h-5 mr-2" />
                                Upload Pet
                            </Button>
                        </Link>
                        <Link href="/profile">
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <User className="w-5 h-5 mr-2" />
                                Profile
                            </Button>
                        </Link>
                        {user?.publicMetadata?.admin && (
                            <Link href="/admin">
                                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                    <ShieldCheck className="w-5 h-5 mr-2" />
                                    Admin
                                </Button>
                            </Link>
                        )}
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-10 h-10",
                                },
                            }}
                        />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button
                                variant="outline"
                                className="border-purple-400 text-purple-200 hover:bg-purple-800jag/50 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </SignedOut>
                </nav>
            </div>
            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <nav className="md:hidden bg-gradient-to-br from-purple-900/80 via-purple-800/80 to-indigo-900/80 px-4 py-4 flex flex-col items-start gap-4 border-t border-purple-500/20">
                    <SignedIn>
                        <Link href="/feed" onClick={toggleMenu}>
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <Heart className="w-5 h-5 mr-2" />
                                Feed
                            </Button>
                        </Link>
                        <Link href="/upload-pet" onClick={toggleMenu}>
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <Plus className="w-5 h-5 mr-2" />
                                Upload Pet
                            </Button>
                        </Link>
                        <Link href="/profile" onClick={toggleMenu}>
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <User className="w-5 h-5 mr-2" />
                                Profile
                            </Button>
                        </Link>
                        {user?.publicMetadata?.admin && (
                            <Link href="/admin" onClick={toggleMenu}>
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                    <ShieldCheck className="w-5 h-5 mr-2" />
                                    Admin
                                </Button>
                            </Link>
                        )}
                        <div className="flex justify-start w-full">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "w-10 h-10",
                                    },
                                }}
                            />
                        </div>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button
                                variant="outline"
                                className="w-full border-purple-400 text-purple-200 hover:bg-purple-800/50 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </SignedOut>
                </nav>
            )}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 left-10 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-0 right-10 w-48 h-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            </div>
        </header>
    );
}