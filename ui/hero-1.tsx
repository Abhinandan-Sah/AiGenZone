"use client";

import * as React from "react";
import { Paperclip, Sparkles, Rocket, LogOut, LogIn, UserPlus, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const Hero1 = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleSignUp = () => router.push("/auth/signup");
  const handleSignIn = () => router.push("/auth/login");
  const handleDashboard = () => router.push("/dashboard");
  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0c0414] text-white flex flex-col relative overflow-x-hidden">
      {/* Gradient */}
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
        <div className="w-[10rem] h-[20rem]  bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem]  bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem]  bg-gradient-to-b from-white to-blue-300"></div>
      </div>
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-50rem] right-[-50rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
        <div className="w-[10rem] h-[20rem]  bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem]  bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem]  bg-gradient-to-b from-white to-blue-300"></div>
      </div>
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-60rem] right-[-60rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
        <div className="w-[10rem] h-[30rem]  bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[30rem]  bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[30rem]  bg-gradient-to-b from-white to-blue-300"></div>
      </div>
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <Rocket className="w-8 h-8 text-blue-400" />
          <div className="font-bold text-md">AiGenZone</div>
        </div>
        <div className="flex gap-2 items-center">
          {/* Theme Toggle */}
          <button
            aria-label="Toggle theme"
            className="rounded-full p-2 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-blue-400" />}
          </button>
          {user ? (
            <>
              <button
                className="bg-white text-black hover:bg-gray-200 rounded-full px-4 py-2 text-sm cursor-pointer font-semibold flex items-center gap-2"
                onClick={handleDashboard}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button
                className="bg-transparent border border-white hover:bg-gray-900 rounded-full px-4 py-2 text-sm cursor-pointer font-semibold flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-white text-black hover:bg-gray-200 rounded-full px-4 py-2 text-sm cursor-pointer font-semibold flex items-center gap-2"
                onClick={handleSignUp}
              >
                <UserPlus className="w-4 h-4" /> Get Started
              </button>
              <button
                className="bg-transparent border border-white hover:bg-gray-900 rounded-full px-4 py-2 text-sm cursor-pointer font-semibold flex items-center gap-2"
                onClick={handleSignIn}
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex-1 flex justify-center">
            <div className="bg-[#1c1528] rounded-full px-4 py-2 flex items-center gap-2  w-fit mx-4">
              <span className="text-xs flex items-center gap-2">
                <span className="bg-black p-1 rounded-full">🥳</span>
                Introducing Magic Components
              </span>
            </div>
          </div>
          {/* Headline */}
          <h1 className="text-5xl font-bold leading-tight">
            Build Stunning websites effortlessly
          </h1>

          {/* Subtitle */}
          <p className="text-md">
            AiGenZone can create amazing websites with a few lines of prompt.
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto w-full">
            <div className="bg-[#1c1528] rounded-full p-3 flex items-center">
              <button className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </button>
              <input
                type="text"
                placeholder="How can AiGenZone help you today?"
                className="bg-transparent flex-1 outline-none text-gray-300 pl-4"
              />
            </div>
          </div>

          {/* Suggestion pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-12 max-w-2xl mx-auto">
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm">
              Launch a blog with Astro
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm">
              Develop an app using NativeScript
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm">
              Build documentation with Vitepress
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm">
              Generate UI with shadcn
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm">
              Generate UI with AiGenZone
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export { Hero1 };
