import { useState } from 'react';
import { Terminal, Shield, CheckCircle } from 'lucide-react';

export function RemediationPlaybook({ incident }: { incident: any }) {
  const [executed, setExecuted] = useState(false);

  return (
    <div className="bg-[#0d121c] border border-slate-800/60 rounded-xl flex flex-col h-[400px] shadow-sm">
      <div className="p-4 border-b border-slate-800/60 flex items-center justify-between bg-[#151b2b]/50">
        <div className="flex items-center space-x-2">
          <Terminal className="h-5 w-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wide">Automated Response Playbook</h2>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-400 border border-slate-700">
          Deterministic Rule: D-892
        </span>
      </div>
      
      <div className="flex-1 overflow-auto p-5 space-y-4 text-sm bg-gradient-to-b from-transparent to-black/20">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest border-b border-slate-800/60 pb-2 mb-4">
          Recommended Containment Actions
        </p>

        <div className="space-y-3">
          {incident.recommended_actions.map((action: string, i: number) => (
            <div key={i} className="flex items-start space-x-3 group">
              <div className="mt-0.5 shrink-0">
                {executed ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Shield className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-mono text-xs leading-relaxed ${executed ? 'text-emerald-400/80' : 'text-slate-300'}`}>{action}</p>
              </div>
            </div>
          ))}
        </div>

        {executed && (
          <div className="mt-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-2">
             <CheckCircle className="h-5 w-5 text-emerald-500" />
             <div className="text-emerald-400 text-xs font-medium">
               Playbook successfully simulated. Status synced with SOC.
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800/60 bg-[#151b2b]/30">
        <button 
          disabled={executed || incident.status !== 'active'}
          onClick={() => setExecuted(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium text-sm transition-all shadow-md shadow-indigo-500/10 border border-indigo-500/50 hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {executed ? 'Simulated Execution Complete' : 'Execute Playbook (Simulation)'}
        </button>
      </div>
    </div>
  );
}
