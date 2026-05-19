// Scoring algorithms for Venture Radar

/**
 * Calculate velocity score based on mention growth
 * - Growth trend (recent vs older)
 * - Volume bonus
 * - New opportunity bonus
 */
export function calculateVelocity(
  w1: number,
  w2: number,
  w3: number,
  w4: number
): number {
  // Recent average (weeks 3-4)
  const recent = (w3 + w4) / 2;
  
  // Older average (weeks 1-2)
  const older = (w1 + w2) / 2;
  
  // Growth ratio (cap at 3x growth)
  const growth = older === 0 ? 3 : Math.min(3, recent / older);
  const growthScore = growth * 30;
  
  // Volume bonus (up to 40 points for high volume)
  const volumeScore = Math.min(40, recent / 5);
  
  // New opportunity bonus
  const newBonus = older === 0 ? 30 : 0;
  
  return Math.min(100, Math.round(growthScore + volumeScore + newBonus));
}

/**
 * Calculate saturation score (lower = better, means blue ocean)
 */
export function calculateSaturation(
  competitionCount: number,
  mentions: number,
  sentiment: number
): number {
  // Base saturation from competition
  let saturation = Math.min(100, competitionCount * 15);
  
  // Blue ocean bonus (huge mentions, few competitors)
  if (mentions > 500 && competitionCount < 5) {
    saturation = saturation * 0.5;
  }
  
  // Frustrated users = opportunity (reduce saturation penalty)
  if (sentiment < -0.3) {
    saturation = saturation * 0.7;
  }
  
  return Math.round(saturation);
}

/**
 * Calculate monetization score based on pain points
 */
export function calculateMonetization(
  painPoints: string[],
  sentiment: number,
  mentions: number
): number {
  // Pay signals in pain points
  const paySignals = [
    'expensive', 'cost', 'pricing', 'pay',
    'subscription', 'freemium', 'cheap',
    'afford', 'budget', 'dollar', 'price',
    'worth', 'value', 'money'
  ];
  
  const painCount = painPoints.filter(p =>
    paySignals.some(s => p.toLowerCase().includes(s))
  ).length;
  
  // Each pain point = 25 points (max 100)
  let score = Math.min(100, painCount * 25);
  
  // High mentions of pricing = people want alternatives
  if (mentions > 100 && score > 0) {
    score = score + 10;
  }
  
  return Math.round(Math.min(100, score));
}

/**
 * Calculate timing score based on trend direction
 */
export function calculateTiming(
  mentions: number[],
  saturation: number
): number {
  // Check if there's any history
  const hasHistory = mentions.some(m => m > 0);
  
  if (!hasHistory) {
    return 85; // Fresh, good timing
  }
  
  // Calculate trend
  const recent = mentions.slice(-2).reduce((a, b) => a + b, 0);
  const older = mentions.slice(0, 2).reduce((a, b) => a + b, 0);
  
  if (recent > older * 1.5) {
    return 80; // Still growing - good timing
  }
  
  if (recent > older * 0.8) {
    return 60; // Stable
  }
  
  if (saturation > 70) {
    return 25; // Declining + saturated = too late
  }
  
  return 50; // Default
}

/**
 * Calculate overall score (weighted sum)
 */
export function calculateOverallScore(
  velocity: number,
  saturation: number,
  monetization: number,
  timing: number
): number {
  const score = 
    velocity * 0.35 +
    (100 - saturation) * 0.25 + // Invert saturation (low = good)
    monetization * 0.25 +
    timing * 0.15;
  
  return Math.round(Math.min(100, score));
}

/**
 * Calculate all scores from raw data
 */
export function calculateAllScores(
  mentions: number[],
  competitionCount: number,
  sentiment: number,
  painPoints: string[]
): {
  velocity: number;
  saturation: number;
  monetization: number;
  timing: number;
  overall: number;
} {
  // Ensure mentions array has 4 elements
  const [w1 = 0, w2 = 0, w3 = 0, w4 = 0] = mentions.slice(0, 4);
  
  const velocity = calculateVelocity(w1, w2, w3, w4);
  const saturation = calculateSaturation(competitionCount, w3 + w4, sentiment);
  const monetization = calculateMonetization(painPoints, sentiment, w3 + w4);
  const timing = calculateTiming(mentions, saturation);
  const overall = calculateOverallScore(velocity, saturation, monetization, timing);
  
  return { velocity, saturation, monetization, timing, overall };
}

/**
 * Get score label
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Exceptional';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  if (score >= 20) return 'Low';
  return 'Pass';
}

/**
 * Get score color
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-emerald-500';
  if (score >= 40) return 'text-yellow-500';
  if (score >= 20) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Get competition level from count
 */
export function getCompetitionLevel(count: number): 'low' | 'medium' | 'high' {
  if (count <= 3) return 'low';
  if (count <= 10) return 'medium';
  return 'high';
}

/**
 * Get trend direction from mentions
 */
export function getTrendDirection(mentions: number[]): 'up' | 'down' | 'stable' {
  if (mentions.length < 2) return 'stable';
  
  const recent = mentions.slice(-2).reduce((a, b) => a + b, 0);
  const older = mentions.slice(0, 2).reduce((a, b) => a + b, 0);
  
  if (recent > older * 1.3) return 'up';
  if (recent < older * 0.7) return 'down';
  return 'stable';
}

/**
 * Format mentions for display
 */
export function formatMentions(mentions: number[]): string {
  const total = mentions.reduce((a, b) => a + b, 0);
  const trend = getTrendDirection(mentions);
  
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return `${total} mentions ${arrow}`;
}