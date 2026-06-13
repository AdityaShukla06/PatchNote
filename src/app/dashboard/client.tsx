"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function DashboardClient({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const resLinear = await fetch(`/api/linear/issues?workspaceId=${workspaceId}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
      const linearTickets = await resLinear.json();

      const resGithub = await fetch(`/api/github/prs?workspaceId=${workspaceId}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
      const githubTickets = resGithub.ok ? await resGithub.json() : [];

      const rawTickets = [...(Array.isArray(linearTickets) ? linearTickets : []), ...(Array.isArray(githubTickets) ? githubTickets : [])];

      if (rawTickets.length === 0) {
        alert("No tickets found in this date range.");
        setIsLoading(false);
        return;
      }

      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, dateFrom, dateTo, rawTickets })
      });

      if (!generateRes.ok) throw new Error("Generation failed");

      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("An error occurred during generation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Generate New Changelog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Changelog</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleGenerate} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom">Start Date</Label>
            <Input id="dateFrom" type="date" required value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateTo">End Date</Label>
            <Input id="dateTo" type="date" required value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Generating with Gemini..." : "Generate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
