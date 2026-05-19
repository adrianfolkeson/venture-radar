import { NextRequest, NextResponse } from "next/server";
import { getSupabase, TABLE } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 200);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);
  const source = searchParams.get("source");
  const minScore = searchParams.get("min_score");
  const status = searchParams.get("status");

  try {
    const sb = getSupabase();
    let q = sb
      .from(TABLE)
      .select("*", { count: "exact" })
      .order("overall_score", { ascending: false })
      .range(offset, offset + limit - 1);

    if (source) q = q.eq("source", source);
    if (status) q = q.eq("status", status);
    if (minScore) q = q.gte("overall_score", parseInt(minScore, 10));

    const { data, error, count } = await q;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ opportunities: data ?? [], total: count ?? 0 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: msg, opportunities: [], total: 0 }, { status: 500 });
  }
}
