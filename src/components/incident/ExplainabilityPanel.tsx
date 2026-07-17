import { AlertTriangle } from 'lucide-react';

export function ExplainabilityPanel({ reasons }: { reasons: any[] }) {
  const totalScore = reasons.reduce((s, r) => s + r.score, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Risk Factor Breakdown</p>
        <div className="flex items-center space-x-1.5">
          <AlertTriangle className="h-3 w-3 text-red-400" />
          <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Total: {totalScore} pts</span>
        </div>
      </div>
      {reasons.map((r, i) => {
        const pct = Math.round((r.score / totalScore) * 100);
        return (
          <div key={i} className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-slate-300 text-xs font-medium leading-relaxed flex-1">{r.factor}</p>
              <span className="text-red-400 font-mono text-xs shrink-0 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                +{r.score}
              </span>
            </div>
            <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${pct}%`,
                  background: r.score >= 25
                    ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                    : r.score >= 15
                    ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                    : 'linear-gradient(90deg, #6366f1, #4f46e5)',
                  boxShadow: r.score >= 25
                    ? '0 0 8px rgba(239,68,68,0.5)'
                    : r.score >= 15
                    ? '0 0 8px rgba(245,158,11,0.4)'
                    : '0 0 6px rgba(99,102,241,0.4)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
