import "dotenv/config";
import { getSupabaseAdmin, TABLE } from "../lib/supabase";

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

export async function scrapeHN(): Promise<number> {
  const sb = getSupabaseAdmin();
  let inserted = 0;

  for (const q of QUERIES) {
    let hits: AlgoliaHit[];
    try {
      hits = await fetchHN(q);
    } catch (e) {
      console.error(`[hn] ${q} fetch failed:`, e instanceof Error ? e.message : e);
      continue;
    }

    const rows = hits
      .filter((h) => h.title)
      .map((h) => ({
        name: (h.title ?? "").slice(0, 200),
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
      }));

    const { error, data } = await sb
      .from(TABLE)
      .upsert(rows, { onConflict: "source,source_id", ignoreDuplicates: false })
      .select("id");

    if (error) {
      console.error(`[hn] ${q} upsert error:`, error.message);
      continue;
    }

    inserted += data?.length ?? 0;
    console.log(`[hn] "${q}": ${data?.length ?? 0} rows`);
  }

  return inserted;
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
