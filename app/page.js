"use client";

import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  Shield,
  HomeIcon,
  Star,
  ArrowRight,
  PawPrint,
} from "lucide-react";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState([]);

  const testimonials = [
    {
      text: "Luna found her forever home and transformed our lives with unconditional love.",
      author: "Sarah M.",
    },
    {
      text: "Rescue pets have the biggest hearts - Max has been our guardian angel.",
      author: "David L.",
    },
    {
      text: "Every animal deserves a second chance at happiness and love.",
      author: "Emma R.",
    },
  ];

  // Create user in database when they sign in
  useEffect(() => {
    const createUserInDatabase = async () => {
      if (isSignedIn && user) {
        console.log("Home: Calling /api/users for user:", user.id);
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          console.log("User database creation result:", data);
        } catch (error) {
          console.error("Error creating user in database:", error);
        }
      }
    };

    createUserInDatabase();
  }, [isSignedIn, user]);

  useEffect(() => {
    setIsVisible(true);

    // Testimonial rotation
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    // Floating hearts animation
    const heartInterval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        left: Math.random() * 100,
        delay: Math.random() * 2,
      };
      setFloatingHearts((prev) => [...prev.slice(-5), newHeart]);
    }, 3000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(heartInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden pt-5">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>

        {/* Floating Hearts */}
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute bottom-0 text-pink-400 opacity-60 animate-bounce"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: "6s",
            }}
          >
            <Heart className="w-6 h-6" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div
          className={`text-center max-w-4xl transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <PawPrint className="w-16 h-16 text-purple-300 animate-pulse" />
                <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Save a Life.
              <br />
              <span className="text-5xl md:text-6xl">Find Your Soulmate.</span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              Every year, millions of innocent animals wait in shelters,
              dreaming of a warm home and loving family. Behind every pair of
              hopeful eyes lies a story of resilience, unconditional love, and
              the promise of unwavering loyalty.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-purple-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="text-purple-200">Love Without Conditions</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-purple-200">Vetted & Healthy</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
                <HomeIcon className="w-5 h-5 text-blue-400" />
                <span className="text-purple-200">Ready for Forever Homes</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mb-16">
            <SignedOut>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <SignInButton>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button
                    variant="outline"
                    className="border-purple-400 text-purple-200 hover:bg-purple-800/50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Create Account
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <Link href="/feed">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-12 py-6 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <Heart className="w-6 h-6 mr-3" />
                  Meet Your Perfect Match
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </SignedIn>
          </div>

          {/* Impact Statement */}
          <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 rounded-2xl p-8 mb-12 backdrop-blur-sm border border-purple-500/20">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-200 mb-2">
                  3.2M
                </div>
                <div className="text-purple-300">
                  Animals enter shelters annually
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-200 mb-2">
                  390,000
                </div>
                <div className="text-purple-300">
                  Dogs & cats euthanized yearly
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-200 mb-2">∞</div>
                <div className="text-purple-300">Love you'll receive</div>
              </div>
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="bg-gradient-to-r from-purple-800/40 to-pink-800/40 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <div className="transition-all duration-500">
              <p className="text-lg text-purple-200 mb-3 italic">
                "{testimonials[currentTestimonial].text}"
              </p>
              <p className="text-purple-300 font-semibold">
                — {testimonials[currentTestimonial].author}
              </p>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="mt-12 text-center">
            <p className="text-purple-300 text-lg leading-relaxed max-w-2xl mx-auto">
              <strong className="text-purple-200">
                Choose compassion over convenience.
              </strong>
              <br />
              When you adopt, you're not just saving one life—you're making room
              for shelters to save another. Every adoption is a victory against
              animal cruelty and a testament to the power of love.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
