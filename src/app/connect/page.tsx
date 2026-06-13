import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function ConnectPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-center">Connect Integrations</h1>
        <p className="text-zinc-400 text-center mb-8">
          Link your Linear and GitHub accounts so PatchNote can automatically fetch your completed tickets and merged PRs.
        </p>

        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Linear</CardTitle>
            <CardDescription className="text-zinc-400">Connect to fetch completed issues and projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
              <Link href="/api/auth/linear">Connect Linear Workspace</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-white mt-4">
          <CardHeader>
            <CardTitle>GitHub</CardTitle>
            <CardDescription className="text-zinc-400">Connect to fetch merged PRs and commit histories.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white" disabled>
              GitHub Connection (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="link" className="text-zinc-400 hover:text-white" asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
