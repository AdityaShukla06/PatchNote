import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { AppHeader } from "@/components/layout/app-header";

export default async function Home() {
  const { userId } = await auth();

  const logEntries = [
    {
      dot: "#5FD68D",
      label: "new",
      version: "v1.4.0",
      date: "06.14",
      title: "AI-powered changelog generation",
      desc: "Connect Linear or GitHub and generate polished, audience-aware release notes in seconds.",
    },
    {
      dot: "#5FA8FF",
      label: "improved",
      version: "v1.3.2",
      date: "06.07",
      title: "Three-audience output in one click",
      desc: "Gemini writes separate versions for users, developers, and executives — all from the same ticket data.",
    },
    {
      dot: "#FF8B7A",
      label: "fixed",
      version: "v1.2.1",
      date: "05.29",
      title: "Linear OAuth connection",
      desc: "Resolved token refresh edge case affecting workspaces with 100+ completed issues.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#11131A" }}>
      
      {userId ? (
        <AppHeader />
      ) : (
        <header className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "#2A2E3A" }}>
          <span className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
            PatchNote
          </span>
          <div className="flex items-center gap-2">
            <Link href="/sign-in"
              className={buttonVariants({ variant: "ghost" }) + " text-sm"}
              style={{ color: "#A8A8B3" }}>
              Sign in
            </Link>
            <Link href="/sign-up"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ background: "#FF7A59", color: "#11131A" }}>
              Start for free
            </Link>
          </div>
        </header>
      )}

      
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-3xl mx-auto w-full">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-8 font-mono text-xs"
          style={{ borderColor: "#2A2E3A", color: "#6E7180", background: "#1A1D27" }}>
          <span style={{ color: "#5FD68D" }}>●</span>
          Built for Mind the Product Hackathon 2025
        </div>

        
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6"
          style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
          Release notes that{" "}
          <span style={{ color: "#FF7A59" }}>write themselves.</span>
        </h1>

        
        <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ color: "#A8A8B3" }}>
          Connect Linear or GitHub. PatchNote pulls your completed work and uses Gemini AI to generate polished changelogs for every audience.
        </p>

        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {userId ? (
            <Link href="/dashboard"
              className="px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
              style={{ background: "#FF7A59", color: "#11131A" }}>
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/sign-up"
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
                style={{ background: "#FF7A59", color: "#11131A" }}>
                Start for free →
              </Link>
              <Link href="/sign-in"
                className="px-6 py-3 rounded-lg font-semibold text-sm border transition-colors"
                style={{ borderColor: "#2A2E3A", color: "#A8A8B3" }}>
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>

      
      <section className="max-w-3xl mx-auto w-full px-6 pb-20">
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#2A2E3A", background: "#1A1D27" }}>
          
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "#2A2E3A" }}>
            <span className="w-3 h-3 rounded-full" style={{ background: "#FF8B7A" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#FFB199" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#5FD68D" }} />
            <span className="font-mono text-xs ml-2" style={{ color: "#6E7180" }}>
              patchnote — changelog-2025-06.14
            </span>
          </div>

          
          <div className="divide-y" style={{ borderColor: "#2A2E3A" }}>
            {logEntries.map((entry, i) => (
              <div key={i}
                className="hover-row flex items-start gap-4 px-5 py-4 transition-colors"
              >
                <span className="mt-1 text-sm shrink-0" style={{ color: entry.dot }}>●</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="font-mono text-xs shrink-0" style={{ color: "#6E7180" }}>{entry.version}</span>
                    <span className="font-mono text-xs shrink-0" style={{ color: "#6E7180" }}>{entry.date}</span>
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                      style={{ color: entry.dot, background: entry.dot + "18" }}>
                      {entry.label}
                    </span>
                  </div>
                  <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
                    {entry.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#A8A8B3" }}>{entry.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center font-mono text-xs mt-4" style={{ color: "#6E7180" }}>
          ↑ this is what PatchNote generates automatically from your Linear tickets
        </p>
      </section>

      
      <footer className="border-t px-6 py-6 text-center" style={{ borderColor: "#2A2E3A" }}>
        <p className="font-mono text-xs" style={{ color: "#6E7180" }}>
          PatchNote · Built at Mind the Product Hackathon 2025
        </p>
      </footer>
    </main>
  );
}
