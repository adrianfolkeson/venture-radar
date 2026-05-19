import Link from "next/link";
import type { Opportunity } from "@/lib/types";
import ScoreGauge from "./ScoreGauge";

export default function OpportunityCard({ opp }: { opp: Opportunity }) {
  return (
    <Link
      href={`/opportunities/${opp.id}`}
      className="block rounded-lg border border-border bg-panel p-5 transition hover:border-accent/60"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-mute">
            <span className="rounded bg-border px-1.5 py-0.5 uppercase tracking-wide">
              {opp.source}
            </span>
            {opp.ai_should_build === true && (
              <span className="rounded bg-emerald-900/40 px-1.5 py-0.5 text-emerald-300">
                build it
              </span>
            )}
            {opp.ai_should_build === false && (
              <span className="rounded bg-rose-900/40 px-1.5 py-0.5 text-rose-300">
                skip
              </span>
            )}
          </div>
          <h3 className="mt-2 truncate text-base font-semibold text-ink">{opp.name}</h3>
          {opp.ai_summary && (
            <p className="mt-1 line-clamp-2 text-sm text-mute">{opp.ai_summary}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="text-3xl font-semibold text-ink tabular-nums">{opp.overall_score}</div>
          <div className="text-xs uppercase tracking-wide text-mute">score</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        <ScoreGauge score={opp.velocity_score} label="velocity" />
        <ScoreGauge score={100 - opp.saturation_score} label="open space" />
        <ScoreGauge score={opp.monetization_score} label="monetization" />
        <ScoreGauge score={opp.timing_score} label="timing" />
      </div>
    </Link>
  );
}
