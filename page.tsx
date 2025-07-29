"use client"

import { Hero1 } from "@/components/ui/hero-1";
import SectionWithMockup from "@/components/ui/section-with-mockup";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    // Optionally, you can return null or a spinner while redirecting
    return null;
  }

  return (
    <>
      <Hero1 />
      <SectionWithMockup
        title={
          <>
            Supercharge your workflow<br />with AiGenZone
          </>
        }
        description={
          <>
            Instantly generate, preview, and export beautiful React components.<br />
            Let AiGenZone handle the UI, so you can focus on building your product.<br />
            Experience the next level of developer productivity.
          </>
        }
        primaryImageSrc="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
        secondaryImageSrc="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
      />
    </>
  );
}
