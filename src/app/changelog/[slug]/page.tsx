import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Script from "next/script";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export default async function ChangelogPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: changelog, error } = await supabase
    .from("changelogs")
    .select("*")
    .eq("slug", params.slug)
    .not("published_at", "is", null)
    .single();

  if (error || !changelog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Script
        id="novus-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Novus.ai Tracking Snippet
            (function(n,o,v,u,s){n[s]=n[s]||function(){(n[s].q=n[s].q||[]).push(arguments)};
            let e=o.createElement(v),a=o.getElementsByTagName(v)[0];
            e.async=1;e.src=u;a.parentNode.insertBefore(e,a)})(window,document,'script','https://cdn.novus.ai/track.js','novus');
            novus('init', 'HACKATHON_DEMO_KEY');
            novus('pageview');
          `,
        }}
      />
      <main className="max-w-3xl mx-auto py-16 px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Release Notes</h1>
          <p className="text-zinc-400">
            Updates from {new Date(changelog.date_from).toLocaleDateString()} to {new Date(changelog.date_to).toLocaleDateString()}
          </p>
        </header>

        <section className="mb-16">
          <MarkdownRenderer source={changelog.user_changelog} />
        </section>

        {changelog.dev_changelog && (
          <details className="group border border-zinc-800 rounded-lg p-6 bg-zinc-900/50 open:bg-zinc-900 transition-colors">
            <summary className="text-xl font-semibold cursor-pointer list-none flex items-center justify-between text-zinc-300 hover:text-white">
              For Developers
              <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <MarkdownRenderer source={changelog.dev_changelog} />
            </div>
          </details>
        )}
      </main>
    </div>
  );
}
