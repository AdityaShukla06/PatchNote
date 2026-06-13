import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    .eq("user_id", userId);

  const hasLinear = workspaces?.some(w => w.integration_type === "linear");
  const hasGitHub = workspaces?.some(w => w.integration_type === "github");

  const { data: changelogs } = await supabase
    .from("changelogs")
    .select("*")
    .in("workspace_id", workspaces?.map(w => w.id) || [])
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto py-12 px-6 max-w-5xl">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your release notes and integrations.</p>
        </div>
        <div className="flex gap-4">
          <Badge variant={hasLinear ? "default" : "secondary"}>
            Linear: {hasLinear ? "Connected" : "Disconnected"}
          </Badge>
          <Badge variant={hasGitHub ? "default" : "secondary"}>
            GitHub: {hasGitHub ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </header>

      <div className="mb-10 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Changelogs</h2>
        {workspaces && workspaces.length > 0 && (
          <DashboardClient workspaceId={workspaces[0].id} />
        )}
      </div>

      <div className="grid gap-6">
        {!changelogs || changelogs.length === 0 ? (
          <Card className="p-8 text-center bg-muted/50 border-dashed">
            <p className="text-muted-foreground mb-4">No changelogs generated yet.</p>
            {workspaces && workspaces.length > 0 ? (
              <DashboardClient workspaceId={workspaces[0].id} />
            ) : (
              <Button asChild>
                <Link href="/connect">Connect Linear or GitHub</Link>
              </Button>
            )}
          </Card>
        ) : (
          changelogs.map((log) => (
            <Card key={log.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>
                    {new Date(log.date_from).toLocaleDateString()} - {new Date(log.date_to).toLocaleDateString()}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {log.published_at ? "Published" : "Draft"} • {log.slug}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" asChild>
                    <Link href={`/changelog/${log.slug}`} target="_blank">
                      View Public Page
                    </Link>
                  </Button>
                  {!log.published_at && (
                     <Badge variant="outline">Draft Mode</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md">
                  <p className="font-semibold mb-2">Executive Summary Preview:</p>
                  <div className="whitespace-pre-wrap">{log.exec_summary}</div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
