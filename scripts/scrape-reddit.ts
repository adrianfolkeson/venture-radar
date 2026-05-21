import "dotenv/config";
import { getSupabaseAdmin, TABLE } from "../lib/supabase";

const SUBREDDITS = [
  "startups",
  "Entrepreneur",
  "SaaS",
  "smallbusiness",
  "indiehackers"
];

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  url: string;
  permalink: string;
  ups: number;
  num_comments: number;
  created_utc: number;
  subreddit: string;
}

export interface ScrapeRow {
  name: string;
  description: string | null;
  source: string;
  source_id: string;
  source_url: string;
  raw_title: string | null;
  raw_content: string | null;
  raw_url: string | null;
  upvotes: number;
  comments: number;
  mentions_w4: number;
  tags: string[];
  status: string;
  last_scraped_at: string;
}

async function fetchSubreddit(sub: string, limit = 25): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${sub}/top.json?limit=${limit}&t=week`;
  const res = await fetch(url, {
    headers: { "User-Agent": "venture-radar/0.1 (scraper)" }
  });
  if (!res.ok) {
    throw new Error(`reddit ${sub} ${res.status}`);
  }
  const json = (await res.json()) as { data: { children: { data: RedditPost }[] } };
  return json.data.children.map((c) => c.data);
}

export async function fetchRedditItems(): Promise<ScrapeRow[]> {
  const all: ScrapeRow[] = [];
  for (const sub of SUBREDDITS) {
    try {
      const posts = await fetchSubreddit(sub);
      for (const p of posts) {
        all.push({
          name: p.title.slice(0, 200),
          description: p.selftext.slice(0, 1000) || null,
          source: "reddit",
          source_id: p.id,
          source_url: `https://reddit.com${p.permalink}`,
          raw_title: p.title,
          raw_content: p.selftext,
          raw_url: p.url,
          upvotes: p.ups,
          comments: p.num_comments,
          mentions_w4: 1,
          tags: [p.subreddit],
          status: "active",
          last_scraped_at: new Date().toISOString()
        });
      }
      console.log(`[reddit] ${sub}: ${posts.length} fetched`);
    } catch (e) {
      console.error(`[reddit] ${sub} fetch failed:`, e instanceof Error ? e.message : e);
    }
  }
  return all;
}

export async function scrapeReddit(): Promise<number> {
  const items = await fetchRedditItems();
  if (items.length === 0) return 0;

  try {
    const sb = getSupabaseAdmin();
    const { error, data } = await sb
      .from(TABLE)
      .upsert(items, { onConflict: "source,source_id", ignoreDuplicates: false })
      .select("id");
    if (error) {
      console.error("[reddit] upsert error:", error.message);
      return 0;
    }
    return data?.length ?? 0;
  } catch (e) {
    console.error("[reddit] db unavailable:", e instanceof Error ? e.message : e);
    return 0;
  }
}

if (require.main === module) {
  scrapeReddit()
    .then((n) => {
      console.log(`done. ${n} total rows.`);
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
