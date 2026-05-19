"use client";

import { useState } from "react";
import Link from "next/link";
import type { Opportunity } from "@/lib/types";
import ScoreGauge from "./ScoreGauge";

export default function OpportunityDetail({ opportunity }: { opportunity: Opportunity }) {
  const [rating, setRating] = useState<number>(opportunity.user_rating ?? 0);
  const [notes, setNotes] = useState(opportunity.user_notes ?? "");
  const [wouldBuild, setWouldBuild] = useState(opportunity.marked_built);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch(`/api/opportunities/${opportunity.id}/feedback`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rating, notes, would_build: wouldBuild })
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-mute hover:text-ink">
        ← back
      </Link>

      <header className="rounded-lg border border-border bg-panel p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-mute">{opportunity.source}</div>
            <h1 className="mt-1 text-2xl font-semibold text-ink">{opportunity.name}</h1>
            {opportunity.source_url && (
              <a
                href={opportunity.source_url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm text-accent hover:underline"
              >
                source ↗
              </a>
            )}
          </div>
          <div className="text-right">
            <div className="text-4xl font-semibold tabular-nums text-ink">
              {opportunity.overall_score}
            </div>
            <div className="text-xs uppercase tracking-wide text-mute">overall score</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4">
          <ScoreGauge score={opportunity.velocity_score} label="velocity" />
          <ScoreGauge score={100 - opportunity.saturation_score} label="open space" />
          <ScoreGauge score={opportunity.monetization_score} label="monetization" />
          <ScoreGauge score={opportunity.timing_score} label="timing" />
        </div>
      </header>

      {opportunity.ai_summary && (
        <Section title="AI summary">
          <p className="text-sm leading-relaxed text-ink">{opportunity.ai_summary}</p>
        </Section>
      )}

      {opportunity.ai_pain_points && opportunity.ai_pain_points.length > 0 && (
        <Section title="Pain points">
          <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
            {opportunity.ai_pain_points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </Section>
      )}

      {opportunity.ai_gtm_suggestion && (
        <Section title="Go-to-Market">
          <p className="text-sm text-ink">{opportunity.ai_gtm_suggestion}</p>
        </Section>
      )}

      {opportunity.ai_competition_level && (
        <Section title="Competition">
          <p className="text-sm capitalize text-ink">{opportunity.ai_competition_level}</p>
        </Section>
      )}

      <Section title="Your feedback">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-mute">rating</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`h-8 w-8 rounded border text-sm ${
                  rating >= n
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-mute"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={wouldBuild}
              onChange={(e) => setWouldBuild(e.target.checked)}
            />
            Would build this
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes…"
            className="w-full rounded border border-border bg-bg p-2 text-sm text-ink"
            rows={4}
          />
          <button
            onClick={save}
            disabled={status === "saving"}
            className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-bg disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save feedback"}
          </button>
          {status === "error" && (
            <p className="text-sm text-rose-400">Failed to save.</p>
          )}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-panel p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-mute">{title}</h2>
      {children}
    </section>
  );
}
