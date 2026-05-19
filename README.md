# 🚀 VENTURE RADAR

**"Bloomberg Terminal for Startup Opportunities"**

An AI-powered system that discovers, analyzes, and scores business opportunities.

## 🎯 What is this?

A personal venture intelligence tool that:
- Scrapes data from Reddit, Hacker News, Twitter, Product Hunt
- Uses AI to analyze trends and pain points
- Scores opportunities (0-100) based on velocity, saturation, monetization
- Helps you decide what's worth building

## 📊 The System

```
Data Sources          AI Analysis          Scoring           Output
────────────          ───────────          ───────           ──────
Reddit     ──────▶    Sentiment       ──▶   Velocity       ──▶  Dashboard
Hacker News          Pain Points          Saturation           Opportunities
Twitter              Trends               Monetization          Scored + Ranked
Product Hunt         Competition          Timing               AI Summarized
```

## 🎓 What You'll Learn

- **Data Pipelines**: APIs, scraping, cron jobs
- **AI Integration**: LLMs, prompts, structured output
- **Full-Stack Dev**: Next.js, Supabase, deployment
- **System Design**: Architecture, scaling, optimization

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js + Tailwind |
| Backend | Next.js API routes |
| Database | Supabase (Postgres) |
| AI | OpenAI API |
| Scraping | Reddit/HN APIs |
| Deploy | Vercel |

## 📈 Project Status

```
Phase 1: Foundation (Week 1-2)
├── Setup Next.js + Supabase ✅
├── Reddit scraper 🔄
├── HN scraper 📋
└── Basic scoring 📋

Phase 2: AI (Week 3)
├── OpenAI integration 📋
├── Summaries + analysis 📋
└── "Should you build?" 📋

Phase 3: UI (Week 4)
├── Dashboard 📋
├── Detail view 📋
└── User feedback 📋
```

## 🚀 Quick Start

```bash
# Clone and setup
cd venture-radar

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Add your OpenAI API key

# Run development
npm run dev
```

## 📁 Project Structure

```
venture-radar/
├── SPEC.md              # This spec
├── README.md            # You are here
├── app/                 # Next.js app
│   ├── page.tsx         # Main dashboard
│   ├── api/             # API routes
│   └── layout.tsx       # App layout
├── lib/
│   ├── supabase.ts     # Supabase client
│   ├── scoring.ts       # Scoring algorithms
│   └── types.ts        # TypeScript types
├── scripts/
│   ├── scrape-reddit.ts # Reddit scraper
│   └── scrape-hn.ts    # HN scraper
└── components/
    ├── OpportunityCard.tsx
    └── ScoreGauge.tsx
```

## 💰 Cost

- **Month 1-3**: $0 (free tiers)
- **Month 4+**: ~$10-20/month (OpenAI + hosting)

## 🎯 The Goal

Build something useful for yourself that trains your developer skills AND generates startup ideas.

## 📚 Documentation

See [SPEC.md](./SPEC.md) for detailed technical specification.

---

**Build fast, learn faster.** 🚀