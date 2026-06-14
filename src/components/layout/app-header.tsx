import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/components/layout/logout-button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
      style={{ background: "#1A1D27", borderColor: "#2A2E3A" }}>
      
      <Link
        href="/"
        className="font-display text-xl font-semibold tracking-tight"
        style={{ color: "#F2F0EA", fontFamily: "var(--font-fraunces), serif" }}
      >
        PatchNote
      </Link>

      
      <nav className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "ghost" }) + " text-sm"}
          style={{ color: "#A8A8B3" }}
        >
          Dashboard
        </Link>
        <Link
          href="/connect"
          className={buttonVariants({ variant: "ghost" }) + " text-sm"}
          style={{ color: "#A8A8B3" }}
        >
          Integrations
        </Link>
        <LogoutButton />
      </nav>
    </header>
  );
}
