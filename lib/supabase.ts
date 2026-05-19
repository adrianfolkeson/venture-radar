import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper to check if supabase is configured
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey && supabaseUrl !== 'placeholder');
}

// Mock data for when Supabase is not configured
export const MOCK_OPPORTUNITIES = [
  {
    id: '1',
    name: 'AI Code Review Tools',
    description: 'Automated code review using AI to catch bugs and improve quality',
    source: 'reddit' as const,
    mentions_w1: 45,
    mentions_w2: 62,
    mentions_w3: 89,
    mentions_w4: 120,
    velocity_score: 78,
    saturation_score: 35,
    monetization_score: 85,
    timing_score: 75,
    overall_score: 72,
    ai_summary: 'Strong opportunity in developer tooling space. AI code review is gaining traction with GitHub Copilot and similar tools.',
    ai_pain_points: ['slow review process', 'expensive tools', 'missed bugs'],
    ai_should_build: true,
    tags: ['AI', 'developer-tools', 'B2B'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'No-Code AI Automation',
    description: 'Drag-and-drop AI workflow builder for non-technical users',
    source: 'hn' as const,
    mentions_w1: 30,
    mentions_w2: 45,
    mentions_w3: 68,
    mentions_w4: 95,
    velocity_score: 82,
    saturation_score: 45,
    monetization_score: 70,
    timing_score: 68,
    overall_score: 70,
    ai_summary: 'Growing interest in AI automation without coding. Zapier and Make are dominant but expensive.',
    ai_pain_points: ['complex setup', 'expensive', 'limited AI'],
    ai_should_build: true,
    tags: ['no-code', 'AI', 'automation'],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Micro-SaaS Boilerplates',
    description: 'Pre-built SaaS templates with auth, payments, and common features',
    source: 'ph' as const,
    mentions_w1: 80,
    mentions_w2: 85,
    mentions_w3: 92,
    mentions_w4: 88,
    velocity_score: 55,
    saturation_score: 80,
    monetization_score: 90,
    timing_score: 45,
    overall_score: 62,
    ai_summary: 'Crowded space with many boilerplates. Differentiation needed through niche focus or superior DX.',
    ai_pain_points: ['hard to build', 'expensive', 'slow development'],
    ai_should_build: false,
    tags: ['saas', 'templates', 'developer-tools'],
    created_at: new Date().toISOString(),
  },
];