"use client";

import { useMemo, useState } from "react";
import type { Opportunity, Source } from "@/lib/types";
import OpportunityCard from "./OpportunityCard";

export default function OpportunityList({ opportunities }: { opportunities: Opportunity[] }) {
  const [source, setSource] = useState<Source | "all">("all");
  const [minScore, setMinScore] = useState(0);

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      if (source !== "all" && o.source !== source) return false;
      if (o.overall_score < minScore) return false;
      return true;
    });
  }, [opportunities, source, minScore]);

  if (opportunities.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-panel p-8 text-center text-mute">
        <p>No opportunities yet.</p>
        <p className="mt-2 text-xs">
          Run scrapers: <code className="text-ink">npm run scrape:reddit</code> &nbsp;|&nbsp;{" "}
          <code className="text-ink">npm run scrape:hn</code>, then{" "}
          <code className="text-ink">npm run analyze</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-panel px-4 py-3">
        <Filter label="source">
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as Source | "all")}
            className="rounded border border-border bg-bg px-2 py-1 text-sm text-ink"
          >
            <option value="all">all</option>
            <option value="reddit">reddit</option>
            <option value="hn">hn</option>
            <option value="twitter">twitter</option>
            <option value="ph">ph</option>
          </select>
        </Filter>
        <Filter label={`min score: ${minScore}`}>
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => setMinScore(parseInt(e.target.value, 10))}
            className="w-40"
          />
        </Filter>
        <div className="ml-auto text-sm text-mute tabular-nums">
          {filtered.length} / {opportunities.length}
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((o) => (
          <OpportunityCard key={o.id} opp={o} />
        ))}
      </div>
    </div>
  );
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-sm text-mute">
      <span>{label}</span>
      {children}
    </label>
  );
}
