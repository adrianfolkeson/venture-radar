export function calculateVelocity(
  w1: number,
  w2: number,
  w3: number,
  w4: number
): number {
  const recent = (w3 + w4) / 2;
  const older = (w1 + w2) / 2;
  const growth = older === 0 ? 3 : recent / older;
  const growthScore = Math.min(3, growth) * 30;
  const volumeScore = Math.min(40, recent / 5);
  const newBonus = older === 0 ? 30 : 0;
  return Math.round(Math.min(100, growthScore + volumeScore + newBonus));
}

export function calculateSaturation(
  competitionCount: number,
  mentions: number,
  sentiment: number
): number {
  let saturation = Math.min(100, competitionCount * 15);
  if (mentions > 500 && competitionCount < 5) saturation *= 0.5;
  if (sentiment < -0.3) saturation *= 0.7;
  return Math.round(saturation);
}

const PAY_SIGNALS = [
  "expensive", "cost", "pricing", "pay",
  "subscription", "freemium", "cheap",
  "afford", "budget", "dollar"
];

export function calculateMonetization(
  painPoints: string[],
  _sentiment: number,
  mentions: number
): number {
  const painCount = painPoints.filter((p) =>
    PAY_SIGNALS.some((s) => p.toLowerCase().includes(s))
  ).length;
  let score = Math.min(100, painCount * 25);
  if (mentions > 100 && score > 0) score += 10;
  return Math.round(Math.min(100, score));
}

export function calculateTiming(
  mentions: number[],
  saturation: number
): number {
  const hasHistory = mentions.some((m) => m > 0);
  if (!hasHistory) return 85;

  const recent = mentions.slice(-2).reduce((a, b) => a + b, 0);
  const older = mentions.slice(0, 2).reduce((a, b) => a + b, 0);

  if (recent > older * 1.5) return 80;
  if (recent > older * 0.8) return 60;
  if (saturation > 70) return 30;
  return 50;
}

export function calculateOverallScore(
  velocity: number,
  saturation: number,
  monetization: number,
  timing: number
): number {
  return Math.round(
    velocity * 0.35 +
    (100 - saturation) * 0.25 +
    monetization * 0.25 +
    timing * 0.15
  );
}

export function scoreOpportunity(input: {
  mentions: [number, number, number, number];
  competitionCount: number;
  sentiment: number;
  painPoints: string[];
}): {
  velocity: number;
  saturation: number;
  monetization: number;
  timing: number;
  overall: number;
} {
  const [w1, w2, w3, w4] = input.mentions;
  const totalMentions = w1 + w2 + w3 + w4;
  const velocity = calculateVelocity(w1, w2, w3, w4);
  const saturation = calculateSaturation(input.competitionCount, totalMentions, input.sentiment);
  const monetization = calculateMonetization(input.painPoints, input.sentiment, totalMentions);
  const timing = calculateTiming(input.mentions, saturation);
  const overall = calculateOverallScore(velocity, saturation, monetization, timing);
  return { velocity, saturation, monetization, timing, overall };
}
