import { NextResponse } from "next/server";
import { getSupabase, TABLE } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sb = getSupabase();
    const [{ count: total }, { count: analyzed }, { data: scoreRows }] = await Promise.all([
      sb.from(TABLE).select("*", { count: "exact", head: true }),
      sb.from(TABLE).select("*", { count: "exact", head: true }).eq("status", "analyzed"),
      sb.from(TABLE).select("overall_score")
    ]);

    const scores = (scoreRows ?? []).map((r: { overall_score: number }) => r.overall_score ?? 0);
    const avg = scores.length === 0 ? 0 : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    return NextResponse.json({
      total: total ?? 0,
      analyzed: analyzed ?? 0,
      avg_score: avg
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json(
      { total: 0, analyzed: 0, avg_score: 0, error: msg },
      { status: 500 }
    );
  }
}
