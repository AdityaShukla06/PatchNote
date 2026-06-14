export type RawTicket = {
  id: string;
  title: string;
  description: string;
  source: "linear" | "github";
  completedAt: string;
  labels: string[];
};
