import { NextRequest, NextResponse } from "next/server";
import { fetchRedditItems } from "@/scripts/scrape-reddit";
import { fetchHNItems } from "@/scripts/scrape-hn";
import type { ScrapeRow } from "@/scripts/scrape-reddit";
import { getSupabaseAdmin, TABLE } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

function supabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes("placeholder")) return false;
  if (key.includes("placeholder")) return false;
  return true;
}

async function safeSave(items: ScrapeRow[]): Promise<{ saved: number; skipped?: string; error?: string }> {
  if (items.length === 0) return { saved: 0 };

  if (!supabaseConfigured()) {
    console.log(`⚠️ Supabase not configured, skipping database save. Scraped: ${items.length}`);
    return { saved: 0, skipped: "supabase_not_configured" };
  }

  try {
    const sb = getSupabaseAdmin();
    const { error, data } = await sb
      .from(TABLE)
      .upsert(items, { onConflict: "source,source_id", ignoreDuplicates: false })
      .select("id");
    if (error) {
      console.log("⚠️ Database save failed:", error.message);
      return { saved: 0, error: error.message };
    }
    return { saved: data?.length ?? 0 };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.log("⚠️ Database save threw:", msg);
    return { saved: 0, error: msg };
  }
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sources = (searchParams.get("sources") ?? "reddit,hn").split(",").map((s) => s.trim());
  const includeItems = searchParams.get("items") !== "false";

  const results: Record<string, { fetched: number; saved: number; error?: string; skipped?: string }> = {};
  const allItems: ScrapeRow[] = [];

  for (const src of sources) {
    try {
      let items: ScrapeRow[] = [];
      if (src === "reddit") items = await fetchRedditItems();
      else if (src === "hn") items = await fetchHNItems();
      else {
        results[src] = { fetched: 0, saved: 0, error: "unknown source" };
        continue;
      }
      const save = await safeSave(items);
      results[src] = { fetched: items.length, ...save };
      allItems.push(...items);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown";
      console.log(`⚠️ ${src} scrape failed:`, msg);
      results[src] = { fetched: 0, saved: 0, error: msg };
    }
  }

  return NextResponse.json({
    ok: true,
    sources_requested: sources,
    results,
    total_fetched: allItems.length,
    total_saved: Object.values(results).reduce((a, r) => a + r.saved, 0),
    items: includeItems ? allItems : undefined
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
