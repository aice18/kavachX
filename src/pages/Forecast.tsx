import { Target } from 'lucide-react';
import { useKavachWebSocket } from '../lib/websocket';
import { Link } from 'react-router-dom';

export function Forecast() {
  const { activeIncidents } = useKavachWebSocket();
  
  // Extract forecasts from active incidents
  const forecasts = activeIncidents
    .filter(i => i.forecast)
    .map(i => ({ ...i.forecast, entity_id: i.entity_id, incident_id: i.incident_id }))
    .sort((a, b) => b.probability - a.probability);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Predictive Risk Analytics</h1>
        <p className="text-slate-400 mt-1.5 text-sm">Deterministic projections of likely next actions based on correlated events.</p>
      </header>

      {forecasts.length === 0 ? (
        <div className="p-12 text-center border border-slate-800/60 rounded-xl bg-[#0d121c] shadow-sm">
          <Target className="h-10 w-10 text-slate-700 mx-auto mb-4 opacity-80" />
          <p className="text-slate-300 font-medium">No active risk projections available.</p>
          <p className="text-slate-500 text-sm mt-1">Sufficient baseline data not met for prediction.</p>
        </div>
      ) : (
        <div className="bg-[#0d121c] border border-slate-800/60 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#151b2b]/80 border-b border-slate-800/60 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="px-6 py-5">Target Entity</th>
                <th className="px-6 py-5">Projected Vector</th>
                <th className="px-6 py-5">Computed Probability</th>
                <th className="px-6 py-5">Time to Impact (Hrs)</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {forecasts.map((f, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 font-mono text-white text-sm">{f.entity_id}</td>
                  <td className="px-6 py-5 text-amber-400 font-medium">{f.threat_type}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" style={{ width: `${f.probability}%` }} />
                      </div>
                      <span className="text-slate-300 font-mono font-bold">{f.probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-400 font-mono">{f.eta_hours}h</td>
                  <td className="px-6 py-5 text-right">
                    <Link to={`/dashboard/incident/${f.incident_id}`} className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors text-xs uppercase tracking-wider">
                      Context <span className="ml-1">&rarr;</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
