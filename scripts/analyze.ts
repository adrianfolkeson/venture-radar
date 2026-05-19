import "dotenv/config";
import OpenAI from "openai";
import { getSupabaseAdmin, TABLE } from "../lib/supabase";
import { buildAnalysisPrompt, SYSTEM_PROMPT } from "../lib/prompts";
import { scoreOpportunity } from "../lib/scoring";
import type { AIAnalysis, Opportunity } from "../lib/types";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const BATCH = parseInt(process.env.ANALYZE_BATCH ?? "20", 10);

function getClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Missing OPENAI_API_KEY");
  return new OpenAI({ apiKey: key });
}

async function analyzeOne(client: OpenAI, opp: Opportunity): Promise<AIAnalysis | null> {
  const prompt = buildAnalysisPrompt({
    topic_name: opp.name,
    topic_description: opp.description ?? opp.raw_title ?? "",
    mention_count: (opp.mentions_w1 ?? 0) + (opp.mentions_w2 ?? 0) + (opp.mentions_w3 ?? 0) + (opp.mentions_w4 ?? 0),
    avg_sentiment: opp.avg_sentiment ?? 0
  });

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });
    const text = completion.choices[0]?.message?.content ?? "";
    return JSON.parse(text) as AIAnalysis;
  } catch (e) {
    console.error(`[analyze] failed ${opp.id}:`, e instanceof Error ? e.message : e);
    return null;
  }
}

export async function analyze(): Promise<number> {
  const sb = getSupabaseAdmin();
  const client = getClient();

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("status", "active")
    .limit(BATCH);

  if (error) throw new Error(error.message);
  const rows = (data ?? []) as Opportunity[];

  if (rows.length === 0) {
    console.log("no active opportunities");
    return 0;
  }

  let updated = 0;
  for (const opp of rows) {
    const ai = await analyzeOne(client, opp);
    if (!ai) continue;

    const competitionCount =
      ai.competition_level === "high" ? 8 : ai.competition_level === "medium" ? 4 : 1;
    const totalMentions =
      (opp.mentions_w1 ?? 0) + (opp.mentions_w2 ?? 0) + (opp.mentions_w3 ?? 0) + (opp.mentions_w4 ?? 0);
    const scores = scoreOpportunity({
      mentions: [opp.mentions_w1 ?? 0, opp.mentions_w2 ?? 0, opp.mentions_w3 ?? 0, opp.mentions_w4 ?? 0],
      competitionCount,
      sentiment: opp.avg_sentiment ?? 0,
      painPoints: ai.pain_points
    });

    const aiSummary =
      ai.should_build_reason +
      (ai.gtm_suggestion ? ` GTM: ${ai.gtm_suggestion}` : "");

    const update = {
      ai_summary: aiSummary,
      ai_pain_points: ai.pain_points,
      ai_competition_level: ai.competition_level,
      ai_gtm_suggestion: ai.gtm_suggestion,
      ai_estimated_build_time: `${ai.build_complexity}/10`,
      ai_should_build: ai.should_build,
      velocity_score: scores.velocity,
      saturation_score: scores.saturation,
      monetization_score: scores.monetization,
      timing_score: scores.timing,
      overall_score: scores.overall,
      tags: ai.opportunity_tags,
      status: "analyzed",
      last_updated_at: new Date().toISOString()
    };

    const { error: upErr } = await sb.from(TABLE).update(update).eq("id", opp.id);
    if (upErr) {
      console.error(`[analyze] update fail ${opp.id}:`, upErr.message);
      continue;
    }
    updated++;
    console.log(`[analyze] ${opp.id} score=${scores.overall} totalMentions=${totalMentions}`);
  }

  return updated;
}

if (require.main === module) {
  analyze()
    .then((n) => {
      console.log(`done. ${n} analyzed.`);
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
