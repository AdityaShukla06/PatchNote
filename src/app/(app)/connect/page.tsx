import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function ConnectPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight mb-3"
          style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
          Integrations
        </h1>
        <p className="text-sm" style={{ color: "#A8A8B3" }}>
          Connect your project management tools. PatchNote will pull completed tickets and merged PRs to generate your changelogs.
        </p>
      </div>

      <div className="grid gap-4">
        
        <div className="rounded-xl border p-6" style={{ background: "#1A1D27", borderColor: "#2A2E3A" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: "#FF7A59" }}>●</span>
                <h2 className="font-semibold text-lg"
                  style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
                  Linear
                </h2>
              </div>
              <p className="text-sm mb-4" style={{ color: "#A8A8B3" }}>
                Fetch completed issues and projects within any date range. PatchNote reads your "Done" column automatically via OAuth.
              </p>
              <div className="flex items-center gap-2 font-mono text-xs" style={{ color: "#6E7180" }}>
                <span>OAuth 2.0</span>
                <span>·</span>
                <span>Read-only issues</span>
                <span>·</span>
                <span>Free tier</span>
              </div>
            </div>
            <Link
              href="/api/auth/linear"
              className="shrink-0 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
              style={{ background: "#FF7A59", color: "#11131A" }}
            >
              Connect →
            </Link>
          </div>
        </div>

        
        <div className="rounded-xl border p-6 opacity-60" style={{ background: "#1A1D27", borderColor: "#2A2E3A" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: "#6E7180" }}>●</span>
                <h2 className="font-semibold text-lg"
                  style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
                  GitHub
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full border"
                  style={{ color: "#6E7180", borderColor: "#2A2E3A" }}>
                  coming soon
                </span>
              </div>
              <p className="text-sm" style={{ color: "#A8A8B3" }}>
                Pull merged PRs and commit histories from any repository to include in your release notes.
              </p>
            </div>
            <button
              disabled
              className="shrink-0 px-5 py-2.5 rounded-lg font-semibold text-sm border cursor-not-allowed"
              style={{ borderColor: "#2A2E3A", color: "#6E7180" }}
            >
              Coming soon
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/dashboard"
          className="text-sm transition-colors"
          style={{ color: "#6E7180" }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
