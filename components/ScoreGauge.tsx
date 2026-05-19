export default function ScoreGauge({ score, label }: { score: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, score));
  const color =
    clamped >= 75 ? "bg-emerald-500" :
    clamped >= 50 ? "bg-amber-500" :
    "bg-rose-500";

  return (
    <div className="flex flex-col gap-1">
      {label && <div className="text-xs text-mute">{label}</div>}
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
          <div className={`h-full ${color}`} style={{ width: `${clamped}%` }} />
        </div>
        <div className="w-10 text-right text-sm tabular-nums text-ink">{clamped}</div>
      </div>
    </div>
  );
}
