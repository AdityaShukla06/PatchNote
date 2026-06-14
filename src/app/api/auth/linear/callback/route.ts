import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); 
  
  if (!code || !state) {
    return new NextResponse("Missing code or state", { status: 400 });
  }

  const userId = state;

  const tokenResponse = await fetch("https://api.linear.app/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/linear/callback`,
      client_id: process.env.LINEAR_CLIENT_ID!,
      client_secret: process.env.LINEAR_CLIENT_SECRET!,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    console.error("Linear token error:", tokenData);
    return new NextResponse("Failed to fetch Linear token", { status: 500 });
  }

  const accessToken = tokenData.access_token;

  const teamsResponse = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query { teams { nodes { id name } } }`
    }),
  });

  const teamsData = await teamsResponse.json();
  const firstTeamId = teamsData?.data?.teams?.nodes?.[0]?.id || null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase.from("workspaces").insert({
    user_id: userId,
    integration_type: "linear",
    access_token: accessToken,
    team_id: firstTeamId,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return new NextResponse("Database error", { status: 500 });
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
