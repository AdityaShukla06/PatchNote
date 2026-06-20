import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export default async function ChangelogPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: changelog, error } = await supabase
    .from("changelogs")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !changelog) {
    notFound();
  }

  const dateFrom = new Date(changelog.date_from);
  const dateTo = new Date(changelog.date_to);
  const shortSlug = changelog.slug?.split("-").slice(-1)[0] ?? "";

  return (
    <div className="min-h-screen" style={{ background: "#11131A", color: "#F2F0EA" }}>
      {/* Minimal header */}
      <header className="border-b px-6 py-5" style={{ borderColor: "#2A2E3A" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/"
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
            PatchNote
          </Link>
          <span className="font-mono text-xs" style={{ color: "#6E7180" }}>
            changelog · {dateFrom.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        {/* Changelog header */}
        <div className="mb-12 pb-8 border-b" style={{ borderColor: "#2A2E3A" }}>
          {/* Meta row */}
          <div className="flex items-center gap-3 mb-4 font-mono text-xs" style={{ color: "#6E7180" }}>
            <span style={{ color: "#5FD68D" }}>●</span>
            <span>
              {dateFrom.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}
              {" — "}
              {dateTo.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}
            </span>
            <span>·</span>
            <span>{shortSlug}</span>
            <span>·</span>
            <span style={{ color: changelog.published_at ? "#5FD68D" : "#A8A8B3" }}>
              {changelog.published_at ? "published" : "draft"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
            Release Notes
          </h1>
          <p style={{ color: "#A8A8B3" }}>
            Updates shipped from{" "}
            {dateFrom.toLocaleDateString("en-US", { month: "long", day: "numeric" })} to{" "}
            {dateTo.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
          </p>
        </div>

        {/* Executive summary as log entry */}
        {changelog.exec_summary && (
          <div className="mb-10 rounded-xl border p-6" style={{ background: "#1A1D27", borderColor: "#2A2E3A" }}>
            <div className="flex items-center gap-2 mb-3 font-mono text-xs" style={{ color: "#6E7180" }}>
              <span style={{ color: "#5FA8FF" }}>■</span>
              <span>exec summary</span>
            </div>
            <div className="prose max-w-none">
              <MarkdownRenderer source={changelog.exec_summary} />
            </div>
          </div>
        )}

        {/* User changelog — main content */}
        {changelog.user_changelog && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-xs" style={{ color: "#6E7180" }}>01 /</span>
              <h2 className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
                What shipped
              </h2>
            </div>
            <div className="prose max-w-none">
              <MarkdownRenderer source={changelog.user_changelog} />
            </div>
          </section>
        )}

        {/* Developer changelog — collapsible */}
        {changelog.dev_changelog && (
          <details
            className="rounded-xl border overflow-hidden group"
            style={{ borderColor: "#2A2E3A" }}
          >
            <summary
              className="flex items-center justify-between px-6 py-4 cursor-pointer list-none"
              style={{ background: "#1A1D27" }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs" style={{ color: "#6E7180" }}>02 /</span>
                <span className="font-semibold"
                  style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
                  For developers
                </span>
              </div>
              <span className="font-mono text-xs" style={{ color: "#6E7180" }}>
                click to expand ▾
              </span>
            </summary>
            <div className="px-6 py-6 border-t" style={{ borderColor: "#2A2E3A", background: "#11131A" }}>
              <div className="prose max-w-none">
                <MarkdownRenderer source={changelog.dev_changelog} />
              </div>
            </div>
          </details>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-8 mt-12" style={{ borderColor: "#2A2E3A" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="font-mono text-xs" style={{ color: "#6E7180" }}>
            Generated by{" "}
            <Link href="/" style={{ color: "#FF7A59" }}>PatchNote</Link>
            {" "}· AI-powered release notes
          </p>
          <p className="font-mono text-xs" style={{ color: "#6E7180" }}>
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
