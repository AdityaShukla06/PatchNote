"use client";

import { useClerk } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";

export function LogoutButton() {
  const { signOut } = useClerk();
  return (
    <button
      onClick={() => {
        if (typeof pendo !== "undefined") pendo.clearSession();
        signOut({ redirectUrl: "/" });
      }}
      className={buttonVariants({ variant: "outline" }) + " border-border text-text-primary hover:bg-surface-hover text-sm"}
    >
      Sign out
    </button>
  );
}
