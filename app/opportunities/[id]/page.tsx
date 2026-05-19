import OpportunityDetail from "@/components/OpportunityDetail";
import type { Opportunity } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function fetchOne(id: string): Promise<Opportunity | null> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  try {
    const res = await fetch(`${base}/api/opportunities/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.opportunity ?? null;
  } catch {
    return null;
  }
}

export default async function DetailPage({ params }: { params: { id: string } }) {
  const opp = await fetchOne(params.id);
  if (!opp) notFound();
  return <OpportunityDetail opportunity={opp} />;
}
