import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, TABLE } from "@/lib/supabase";
import type { FeedbackBody } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  let body: FeedbackBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const update: Record<string, unknown> = { last_updated_at: new Date().toISOString() };
  if (typeof body.rating === "number") {
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 });
    }
    update.user_rating = body.rating;
  }
  if (typeof body.notes === "string") update.user_notes = body.notes;
  if (typeof body.would_build === "boolean") update.marked_built = body.would_build;

  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.from(TABLE).update(update).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ opportunity: data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
