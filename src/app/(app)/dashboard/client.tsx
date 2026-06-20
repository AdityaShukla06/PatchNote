"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    pendo?: {
      track(name: string, properties?: Record<string, unknown>): void;
    };
  }
}

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

      const linearArr = Array.isArray(linearTickets) ? linearTickets : [];
      const githubArr = Array.isArray(githubTickets) ? githubTickets : [];
      const rawTickets = [...linearArr, ...githubArr];

      if (rawTickets.length === 0) {
        window.pendo?.track("no_tickets_found_in_range", {
          workspaceId,
          dateFrom,
          dateTo,
        });
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

      const generateData = await generateRes.json();

      window.pendo?.track("changelog_generated", {
        workspaceId,
        dateFrom,
        dateTo,
        ticketCount: rawTickets.length,
        linearTicketCount: linearArr.length,
        githubTicketCount: githubArr.length,
        slug: generateData.slug,
      });

      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      window.pendo?.track("changelog_generation_failed", {
        workspaceId,
        dateFrom,
        dateTo,
        errorMessage: err instanceof Error ? err.message.substring(0, 200) : "Unknown error",
      });
      alert("An error occurred during generation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: "default" })}
        style={{ background: "#FF7A59", color: "#11131A", fontWeight: 600 }}
      >
        Generate New Changelog
      </DialogTrigger>
      <DialogContent style={{ background: "#1A1D27", border: "1px solid #2A2E3A" }}>
        <DialogHeader>
          <DialogTitle style={{ color: "#F2F0EA", fontFamily: "var(--font-fraunces), serif" }}>
            Generate Changelog
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleGenerate} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom" style={{ color: "#A8A8B3" }}>Start Date</Label>
            <Input
              id="dateFrom"
              type="date"
              required
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              style={{ background: "#11131A", border: "1px solid #2A2E3A", color: "#F2F0EA" }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateTo" style={{ color: "#A8A8B3" }}>End Date</Label>
            <Input
              id="dateTo"
              type="date"
              required
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              style={{ background: "#11131A", border: "1px solid #2A2E3A", color: "#F2F0EA" }}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            style={{ background: "#FF7A59", color: "#11131A", fontWeight: 600 }}
          >
            {isLoading ? "Generating with Gemini..." : "Generate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
