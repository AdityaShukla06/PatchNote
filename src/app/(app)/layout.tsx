import { AppHeader } from "@/components/layout/app-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#11131A" }}>
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
