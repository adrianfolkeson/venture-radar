import { NextRequest, NextResponse } from "next/server";
import { scrapeReddit } from "@/scripts/scrape-reddit";
import { scrapeHN } from "@/scripts/scrape-hn";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sources = (searchParams.get("sources") ?? "reddit,hn").split(",").map((s) => s.trim());

  const results: Record<string, { inserted: number; error?: string }> = {};

  for (const src of sources) {
    try {
      if (src === "reddit") {
        const n = await scrapeReddit();
        results.reddit = { inserted: n };
      } else if (src === "hn") {
        const n = await scrapeHN();
        results.hn = { inserted: n };
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown";
      results[src] = { inserted: 0, error: msg };
    }
  }

  return NextResponse.json({ ok: true, results });
}
