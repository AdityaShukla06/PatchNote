import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { DashboardClient } from "./client";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const hasLinear = workspaces?.some(w => w.integration_type === "linear");
  const hasGitHub = workspaces?.some(w => w.integration_type === "github");

  const { data: changelogs } = await supabase
    .from("changelogs")
    .select("*")
    .in("workspace_id", workspaces?.map(w => w.id) || [])
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">

      
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight mb-2"
            style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
            Your Changelogs
          </h1>
          <p style={{ color: "#A8A8B3" }} className="text-sm">
            AI-generated release notes from your connected workspaces.
          </p>
        </div>
        <div className="flex items-center gap-3">
          
          <span className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full border"
            style={{
              borderColor: hasLinear ? "#5FD68D" : "#2A2E3A",
              color: hasLinear ? "#5FD68D" : "#6E7180",
              background: hasLinear ? "rgba(95,214,141,0.08)" : "transparent"
            }}>
            <span style={{ color: hasLinear ? "#5FD68D" : "#6E7180" }}>●</span>
            Linear {hasLinear ? "Connected" : "Disconnected"}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full border"
            style={{
              borderColor: hasGitHub ? "#5FD68D" : "#2A2E3A",
              color: hasGitHub ? "#5FD68D" : "#6E7180",
              background: hasGitHub ? "rgba(95,214,141,0.08)" : "transparent"
            }}>
            <span style={{ color: hasGitHub ? "#5FD68D" : "#6E7180" }}>●</span>
            GitHub {hasGitHub ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      
      <div className="flex items-center justify-between mb-8">
        {workspaces && workspaces.length > 0 ? (
          <>
            <p className="text-sm font-mono" style={{ color: "#6E7180" }}>
              {changelogs?.length ?? 0} release{changelogs?.length !== 1 ? "s" : ""} generated
            </p>
            <DashboardClient workspaceId={workspaces[0].id} />
          </>
        ) : (
          <div className="w-full rounded-xl border p-8 text-center"
            style={{ borderColor: "#2A2E3A", background: "#1A1D27", borderStyle: "dashed" }}>
            <p className="text-sm mb-4" style={{ color: "#A8A8B3" }}>
              No integrations connected. Connect Linear to start generating changelogs.
            </p>
            <Link href="/connect" className={buttonVariants()}
              style={{ background: "#FF7A59", color: "#11131A", fontWeight: 600 }}>
              Connect an Integration
            </Link>
          </div>
        )}
      </div>

      
      {changelogs && changelogs.length > 0 && (
        <div className="grid gap-4">
          {changelogs.map((log) => {
            const dateFrom = new Date(log.date_from);
            const dateTo = new Date(log.date_to);
            const shortSlug = log.slug?.split("-").slice(-1)[0] ?? "";

            return (
              <div key={log.id}
                className="hover-card rounded-xl border p-6 transition-colors"
                style={{ background: "#1A1D27", borderColor: "#2A2E3A" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    
                    <div className="mt-1 shrink-0">
                      <span className="text-lg" style={{ color: "#5FD68D" }}>●</span>
                    </div>
                    <div>
                      
                      <h2 className="text-lg font-semibold mb-1"
                        style={{ fontFamily: "var(--font-fraunces), serif", color: "#F2F0EA" }}>
                        {dateFrom.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {" — "}
                        {dateTo.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </h2>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-xs" style={{ color: "#6E7180" }}>
                          {dateFrom.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}
                        </span>
                        <span className="font-mono text-xs" style={{ color: "#6E7180" }}>
                          {shortSlug}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-mono border"
                          style={{
                            color: log.published_at ? "#5FD68D" : "#A8A8B3",
                            borderColor: log.published_at ? "#5FD68D" : "#2A2E3A",
                            background: log.published_at ? "rgba(95,214,141,0.08)" : "transparent"
                          }}>
                          {log.published_at ? "published" : "draft"}
                        </span>
                      </div>
                      
                      {log.exec_summary && (
                        <p className="text-sm leading-relaxed line-clamp-2"
                          style={{ color: "#A8A8B3" }}>
                          {log.exec_summary.replace(/^[-*#\s]+/gm, "").slice(0, 180)}
                        </p>
                      )}
                    </div>
                  </div>

                  
                  <Link
                    href={`/changelog/${log.slug}`}
                    target="_blank"
                    className="shrink-0 text-sm px-4 py-2 rounded-lg border transition-colors font-medium"
                    style={{ borderColor: "#2A2E3A", color: "#FF7A59" }}
                  >
                    View →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      
      {(!changelogs || changelogs.length === 0) && workspaces && workspaces.length > 0 && (
        <div className="rounded-xl border p-12 text-center" style={{ borderColor: "#2A2E3A", borderStyle: "dashed", background: "#1A1D27" }}>
          <p className="font-mono text-sm mb-2" style={{ color: "#6E7180" }}>// no changelogs yet</p>
          <p className="text-sm mb-6" style={{ color: "#A8A8B3" }}>
            Select a date range to pull completed tickets from Linear and generate your first release notes.
          </p>
          <DashboardClient workspaceId={workspaces[0].id} />
        </div>
      )}
    </div>
  );
}
