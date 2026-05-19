export type Source = "reddit" | "hn" | "twitter" | "ph";
export type CompetitionLevel = "low" | "medium" | "high";
export type Status = "active" | "analyzed" | "archived";

export interface Opportunity {
  id: string;
  name: string;
  description: string | null;
  source: Source;
  source_url: string | null;
  source_id: string | null;

  raw_title: string | null;
  raw_content: string | null;
  raw_url: string | null;

  mentions_w1: number;
  mentions_w2: number;
  mentions_w3: number;
  mentions_w4: number;

  upvotes: number;
  comments: number;
  shares: number;

  avg_sentiment: number;
  sentiment_sample_size: number;

  ai_summary: string | null;
  ai_pain_points: string[] | null;
  ai_competition_level: CompetitionLevel | null;
  ai_gtm_suggestion: string | null;
  ai_estimated_build_time: string | null;
  ai_should_build: boolean | null;

  velocity_score: number;
  saturation_score: number;
  monetization_score: number;
  timing_score: number;
  overall_score: number;

  tags: string[] | null;

  user_rating: number | null;
  user_notes: string | null;
  marked_built: boolean;
  marked_skipped: boolean;

  first_seen_at: string;
  last_updated_at: string;
  last_scraped_at: string | null;

  status: Status;
}

export interface AIAnalysis {
  pain_points: string[];
  competition_level: CompetitionLevel;
  gtm_suggestion: string;
  build_complexity: number;
  should_build: boolean;
  should_build_reason: string;
  opportunity_tags: string[];
}

export interface FeedbackBody {
  rating?: number;
  notes?: string;
  would_build?: boolean;
}
