import "dotenv/config";
import { getSupabaseAdmin, TABLE } from "../lib/supabase";
import type { ScrapeRow } from "./scrape-reddit";

interface AlgoliaHit {
  objectID: string;
  title: string | null;
  story_text: string | null;
  url: string | null;
  points: number | null;
  num_comments: number | null;
  created_at: string;
}

const QUERIES = [
  "Show HN",
  "Ask HN: startup",
  "SaaS",
  "indie hacker"
];

async function fetchHN(query: string, hitsPerPage = 30): Promise<AlgoliaHit[]> {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${hitsPerPage}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`hn ${res.status}`);
  const json = (await res.json()) as { hits: AlgoliaHit[] };
  return json.hits;
}

export async function fetchHNItems(): Promise<ScrapeRow[]> {
  const all: ScrapeRow[] = [];
  for (const q of QUERIES) {
    try {
      const hits = await fetchHN(q);
      for (const h of hits) {
        if (!h.title) continue;
        all.push({
          name: h.title.slice(0, 200),
          description: (h.story_text ?? "").slice(0, 1000) || null,
          source: "hn",
          source_id: h.objectID,
          source_url: `https://news.ycombinator.com/item?id=${h.objectID}`,
          raw_title: h.title,
          raw_content: h.story_text,
          raw_url: h.url,
          upvotes: h.points ?? 0,
          comments: h.num_comments ?? 0,
          mentions_w4: 1,
          tags: [q.toLowerCase().replace(/\s+/g, "-")],
          status: "active",
          last_scraped_at: new Date().toISOString()
        });
      }
      console.log(`[hn] "${q}": ${hits.length} fetched`);
    } catch (e) {
      console.error(`[hn] ${q} fetch failed:`, e instanceof Error ? e.message : e);
    }
  }
  return all;
}

export async function scrapeHN(): Promise<number> {
  const items = await fetchHNItems();
  if (items.length === 0) return 0;

  try {
    const sb = getSupabaseAdmin();
    const { error, data } = await sb
      .from(TABLE)
      .upsert(items, { onConflict: "source,source_id", ignoreDuplicates: false })
      .select("id");
    if (error) {
      console.error("[hn] upsert error:", error.message);
      return 0;
    }
    return data?.length ?? 0;
  } catch (e) {
    console.error("[hn] db unavailable:", e instanceof Error ? e.message : e);
    return 0;
  }
}

if (require.main === module) {
  scrapeHN()
    .then((n) => {
      console.log(`done. ${n} total rows.`);
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
