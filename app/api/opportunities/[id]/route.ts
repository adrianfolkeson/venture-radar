import { NextRequest, NextResponse } from "next/server";
import { getSupabase, TABLE } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from(TABLE).select("*").eq("id", id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ opportunity: data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
