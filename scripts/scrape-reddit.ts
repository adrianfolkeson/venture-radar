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

export async function scrapeReddit(): Promise<number> {
  const sb = getSupabaseAdmin();
  let inserted = 0;

  for (const sub of SUBREDDITS) {
    let posts: RedditPost[];
    try {
      posts = await fetchSubreddit(sub);
    } catch (e) {
      console.error(`[reddit] ${sub} fetch failed:`, e instanceof Error ? e.message : e);
      continue;
    }

    const rows = posts.map((p) => ({
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
    }));

    const { error, data } = await sb
      .from(TABLE)
      .upsert(rows, { onConflict: "source,source_id", ignoreDuplicates: false })
      .select("id");

    if (error) {
      console.error(`[reddit] ${sub} upsert error:`, error.message);
      continue;
    }

    inserted += data?.length ?? 0;
    console.log(`[reddit] ${sub}: ${data?.length ?? 0} rows`);
  }

  return inserted;
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
