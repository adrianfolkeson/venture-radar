export interface AnalysisInput {
  topic_name: string;
  topic_description: string;
  mention_count: number;
  avg_sentiment: number;
}

export const SYSTEM_PROMPT =
  "You are a startup-opportunity analyst. You output strict JSON only. Be brutally honest about saturation and timing.";

export function buildAnalysisPrompt(input: AnalysisInput): string {
  return `You are analyzing a trending topic for startup opportunities.

TOPIC: ${input.topic_name}
DESCRIPTION: ${input.topic_description}
MENTIONS: ${input.mention_count} in the last week
SENTIMENT: ${input.avg_sentiment.toFixed(2)} (scale: -1 to 1)

TASKS:
1. Identify 3-5 pain points people mention
2. Estimate competition level (low/medium/high)
3. Suggest a Go-to-Market approach
4. Estimate build complexity (1-10)
5. Answer: "Should someone build this?" (yes/no/conditional)

OUTPUT FORMAT (JSON, no prose, no markdown):
{
  "pain_points": ["pain1", "pain2", "pain3"],
  "competition_level": "low|medium|high",
  "gtm_suggestion": "1-2 sentences",
  "build_complexity": 1,
  "should_build": true,
  "should_build_reason": "1 sentence",
  "opportunity_tags": ["tag1", "tag2"]
}

Be honest. If the space is too crowded, say so.`;
}

export const SENTIMENT_PROMPT = `Score the sentiment of the following text on a scale from -1 (very negative) to 1 (very positive). Output JSON: {"sentiment": <number>}. Text:\n\n`;
