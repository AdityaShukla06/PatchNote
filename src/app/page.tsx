import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 selection:bg-blue-500/30 relative overflow-hidden">
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-black pointer-events-none" />
      
      <div className="z-10 max-w-3xl text-center space-y-8 mt-[-10vh]">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          Built for the Mind the Product Hackathon
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          Release notes that <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 pb-2">
            write themselves.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Connect your Linear and GitHub workspaces. PatchNote pulls your merged PRs and completed tickets, then uses AI to generate polished, audience-aware changelogs instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          {userId ? (
            <Button size="lg" className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 transition-colors" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" className="rounded-full px-8 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]" asChild>
                <Link href="/sign-up">Start for free</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-zinc-700 hover:bg-zinc-800 text-white transition-colors" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
