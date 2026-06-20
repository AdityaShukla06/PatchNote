"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    pendo?: {
      track(name: string, properties?: Record<string, unknown>): void;
    };
  }
}

const trackedSignUps = new Set<string>();

export default function PostSignUpPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const userId = user?.id;
    if (userId && !trackedSignUps.has(userId)) {
      trackedSignUps.add(userId);
      window.pendo?.track("user_signed_up", {
        signUpMethod: user.primaryEmailAddress ? "email" : "oauth",
      });
    }

    router.replace("/dashboard");
  }, [isLoaded, user, router]);

  return null;
}
