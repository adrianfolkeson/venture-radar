# TypeScript types for Venture Radar

export interface Opportunity {
  id: string;
  name: string;
  description: string | null;
  source: 'reddit' | 'hn' | 'twitter' | 'ph';
  source_url: string | null;
  source_id: string | null;
  
  // Temporal signals
  mentions_w1: number;
  mentions_w2: number;
  mentions_w3: number;
  mentions_w4: number;
  
  // Engagement
  upvotes: number;
  comments: number;
  shares: number;
  
  // AI Analysis
  avg_sentiment: number;
  ai_summary: string | null;
  ai_pain_points: string[];
  ai_competition_level: 'low' | 'medium' | 'high';
  ai_gtm_suggestion: string | null;
  ai_estimated_build_time: string | null;
  ai_should_build: boolean | null;
  
  // Scores (0-100)
  velocity_score: number;
  saturation_score: number;
  monetization_score: number;
  timing_score: number;
  overall_score: number;
  
  // Tags
  tags: string[];
  
  // User feedback
  user_rating: number | null;
  user_notes: string | null;
  marked_built: boolean;
  marked_skipped: boolean;
  
  // Timestamps
  first_seen_at: string;
  last_updated_at: string;
  last_scraped_at: string | null;
  
  // Status
  status: 'active' | 'analyzed' | 'archived';
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  category: string | null;
  created_at: string;
}

export interface Feedback {
  id: string;
  opportunity_id: string;
  rating: number;
  notes: string | null;
  would_build: boolean | null;
  built_anything: boolean | null;
  outcome: string | null;
  created_at: string;
}

export interface ScrapedPost {
  id: string;
  title: string;
  url: string;
  content: string;
  upvotes: number;
  comments: number;
  sentiment?: number;
  created_at: string;
}

export interface AnalysisResult {
  pain_points: string[];
  competition_level: 'low' | 'medium' | 'high';
  gtm_suggestion: string;
  build_complexity: number;
  should_build: boolean;
  should_build_reason: string;
  opportunity_tags: string[];
}

export interface ScoreBreakdown {
  velocity: number;
  saturation: number;
  monetization: number;
  timing: number;
  overall: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Stats
export interface RadarStats {
  total_opportunities: number;
  analyzed_opportunities: number;
  avg_score: number;
  high_score_count: number;
  by_source: Record<string, number>;
}