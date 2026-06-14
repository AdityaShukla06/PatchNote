import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { RawTicket } from "@/types";

interface GitHubIssue {
  id: number;
  title: string;
  body: string | null;
  pull_request?: {
    merged_at: string | null;
  };
  closed_at: string | null;
  labels: { name: string }[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  if (!workspaceId || !dateFrom || !dateTo) {
    return new NextResponse("Missing query parameters", { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select("access_token")
    .eq("id", workspaceId)
    .eq("integration_type", "github")
    .single();

  if (error || !workspace) {
    return NextResponse.json([]);
  }

  try {
    const query = `is:pr is:merged merged:${dateFrom}..${dateTo}`;
    const ghResponse = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=50`, {
      headers: {
        "Authorization": `Bearer ${workspace.access_token}`,
        "Accept": "application/vnd.github.v3+json",
      }
    });

    if (!ghResponse.ok) {
      throw new Error(`GitHub API error: ${ghResponse.statusText}`);
    }

    const ghData = await ghResponse.json();

    const rawTickets: RawTicket[] = ghData.items.map((item: GitHubIssue) => ({
      id: item.id.toString(),
      title: item.title,
      description: item.body || "",
      source: "github",
      completedAt: item.pull_request?.merged_at || item.closed_at || new Date().toISOString(),
      labels: item.labels.map((l) => l.name),
    }));

    return NextResponse.json(rawTickets);
  } catch (err) {
    console.error("GitHub fetch error:", err);
    return new NextResponse("Failed to fetch GitHub PRs", { status: 500 });
  }
}
