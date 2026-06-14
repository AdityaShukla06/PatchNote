import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const clientId = process.env.LINEAR_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("Missing LINEAR_CLIENT_ID", { status: 500 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/linear/callback`;
  const state = userId; 
  
  const scope = "read";

  const linearAuthUrl = `https://linear.app/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&scope=${scope}`;

  return NextResponse.redirect(linearAuthUrl);
}
