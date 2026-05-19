import OpportunityList from "@/components/OpportunityList";
import type { Opportunity } from "@/lib/types";

export const dynamic = "force-dynamic";

async function fetchOpportunities(): Promise<{ opportunities: Opportunity[]; total: number }> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  try {
    const res = await fetch(`${base}/api/opportunities?limit=50`, { cache: "no-store" });
    if (!res.ok) return { opportunities: [], total: 0 };
    return await res.json();
  } catch {
    return { opportunities: [], total: 0 };
  }
}

async function fetchStats(): Promise<{ total: number; analyzed: number; avg_score: number }> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  try {
    const res = await fetch(`${base}/api/stats`, { cache: "no-store" });
    if (!res.ok) return { total: 0, analyzed: 0, avg_score: 0 };
    return await res.json();
  } catch {
    return { total: 0, analyzed: 0, avg_score: 0 };
  }
}

export default async function Page() {
  const [{ opportunities }, stats] = await Promise.all([fetchOpportunities(), fetchStats()]);

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-3 gap-4">
        <Stat label="Total" value={stats.total} />
        <Stat label="Analyzed" value={stats.analyzed} />
        <Stat label="Avg score" value={stats.avg_score} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">Top opportunities</h2>
        <OpportunityList opportunities={opportunities} />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-4">
      <div className="text-sm text-mute">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink">{value}</div>
    </div>
  );
}
