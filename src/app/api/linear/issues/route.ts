import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { LinearClient } from "@linear/sdk";
import { RawTicket } from "@/types";

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
    .eq("integration_type", "linear")
    .single();

  if (error || !workspace) {
    return new NextResponse("Linear Workspace not found or unauthorized", { status: 404 });
  }

  const linear = new LinearClient({ accessToken: workspace.access_token });

  try {
    const issues = await linear.issues({
      first: 50,
      filter: {
        completedAt: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      },
    });

    const rawTickets: RawTicket[] = await Promise.all(
      issues.nodes.map(async (issue) => {
        const labels = await issue.labels();
        return {
          id: issue.id,
          title: issue.title,
          description: issue.description || "",
          source: "linear",
          completedAt: issue.completedAt?.toISOString() || "",
          labels: labels.nodes.map(l => l.name),
        };
      })
    );

    return NextResponse.json(rawTickets);
  } catch (err) {
    console.error("Linear fetch error:", err);
    return new NextResponse("Failed to fetch Linear issues", { status: 500 });
  }
}
