import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchIncident, containIncident, fetchGraph } from '../lib/api';
import { Shield, AlertTriangle, Play, ShieldAlert, Cpu, ArrowRight, Network } from 'lucide-react';
import { format } from 'date-fns';
import { AttackGraph } from '../components/incident/AttackGraph';
import { ExplainabilityPanel } from '../components/incident/ExplainabilityPanel';
import { RemediationPlaybook } from '../components/incident/RemediationPlaybook';
import { Copilot } from '../components/shared/Copilot';

export function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<any>(null);
  const [graph, setGraph] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchIncident(id),
      fetchGraph(id) // Ideally fetch sub-graph, but we fetch all and let component filter
    ]).then(([inc, g]) => {
      setIncident(inc);
      setGraph(g);
      setLoading(false);
    });
  }, [id]);

  const handleContain = async () => {
    if (!id) return;
    setSimulating(true);
    const res = await containIncident(id);
    if (res.success) {
      setIncident(res.incident);
    }
    setSimulating(false);
  };

  if (loading) return <div className="p-8 text-slate-500 animate-pulse">Loading incident correlation...</div>;
  if (incident.error) return <div className="p-8 text-red-500">Incident not found</div>;

  const exposure = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(incident.business_impact.loss_exposure_inr);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Entity: <span className="text-indigo-400 font-mono">{incident.entity_id}</span></h1>
            {incident.status === 'active' ? (
              <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest flex items-center shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                Active Incident
              </span>
            ) : (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest flex items-center shadow-sm">
                <Shield className="h-3 w-3 mr-1.5" />
                Contained
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm font-medium">Detection Time: {format(new Date(incident.created_at), 'PPpp')}</p>
        </div>

        {incident.status === 'active' && (
          <button 
            onClick={handleContain}
            disabled={simulating}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center disabled:opacity-50 border border-indigo-500/50"
          >
            {simulating ? 'Executing...' : 'Force Containment (Sim)'}
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Graph & Timeline */}
        <div className="xl:col-span-2 space-y-6">
          {/* Attack Graph */}
          <div className="bg-[#0d121c] border border-slate-800/60 rounded-xl h-[400px] overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b border-slate-800/60 bg-[#151b2b]/50 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center">
                <Network className="h-4 w-4 mr-2 text-indigo-400" />
                Entity Relationship Graph
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold border border-slate-700/50 px-2 py-0.5 rounded">Live Telemetry</span>
            </div>
            <div className="flex-1 relative bg-[#0b0f19]">
              <AttackGraph nodes={graph.nodes} edges={graph.edges} incidentEvents={incident.events} />
            </div>
          </div>

          {/* Cyber Time Machine */}
          <div className="bg-[#0d121c] border border-slate-800/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center">
                <Play className="h-4 w-4 mr-2 text-indigo-400" />
                Cyber Time Machine™
              </h2>
              <button 
                onClick={() => {
                  const elements = document.querySelectorAll('.timeline-event');
                  elements.forEach((el) => {
                    (el as HTMLElement).style.opacity = '0';
                    (el as HTMLElement).style.transform = 'translateY(10px)';
                  });
                  setTimeout(() => {
                    elements.forEach((el, i) => {
                      setTimeout(() => {
                        (el as HTMLElement).style.transition = 'all 0.5s ease';
                        (el as HTMLElement).style.opacity = '1';
                        (el as HTMLElement).style.transform = 'translateY(0)';
                      }, i * 600);
                    });
                  }, 100);
                }}
                className="text-xs uppercase tracking-widest text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded border border-indigo-500/20 transition-colors flex items-center"
              >
                <Play className="h-3 w-3 mr-1.5" /> Replay Sequence
              </button>
            </div>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
              {incident.events.map((ev: any, idx: number) => (
                <div key={ev.event_id} className="timeline-event relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-all duration-500">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-[#151b2b] text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg shadow-black z-10 font-mono text-sm group-hover:border-indigo-500 transition-colors">
                    {idx + 1}
                  </div>
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl border bg-[#0f172a]/80 shadow-md transition-all ${
                    ev.source === 'api' || ev.source === 'upi' ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.1)]'
                  }`}>
                    <div className="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                          ev.source === 'api' || ev.source === 'upi' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}>
                          {ev.source === 'api' || ev.source === 'upi' ? 'Transactional Event' : 'Cyber Telemetry'}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 font-medium">{format(new Date(ev.timestamp), 'HH:mm:ss')}</div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-white text-sm tracking-wide uppercase">{ev.action}</div>
                      {ev.amount && (
                        <div className="text-amber-400 font-mono font-bold tracking-tight bg-amber-500/10 px-2 py-1 rounded">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(ev.amount)}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-slate-300 text-xs font-mono grid grid-cols-2 gap-3 mt-4 p-3 bg-black/40 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-widest mb-1">Source Agent</span>
                        {ev.source}
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-widest mb-1">IP / Device</span>
                        <span className="text-cyan-400">{ev.ip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Risk Engine & Playbook */}
        <div className="space-y-6">
          
          {/* Risk & Explainability */}
          <div className="bg-[#0d121c] border border-slate-800/60 rounded-xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/60">
                <h2 className="text-sm font-semibold text-slate-200 flex items-center">
                  <ShieldAlert className="h-4 w-4 mr-2 text-red-400" />
                  Deterministic Risk Score
                </h2>
                <div className="text-4xl font-mono font-bold text-red-500 tracking-tighter">{incident.risk_score}</div>
             </div>
             <ExplainabilityPanel reasons={incident.reasons} />
          </div>

          {/* Business Impact & Forecast */}
          <div className="bg-[#0d121c] border border-slate-800/60 rounded-xl p-6 shadow-sm">
             <h2 className="text-sm font-semibold text-slate-200 mb-5">Calculated Impact & Projections</h2>
             
             <div className="p-5 bg-red-500/5 rounded-xl border border-red-500/20 mb-4 shadow-inner">
               <div className="text-[10px] text-red-400 font-bold tracking-widest uppercase mb-2">Value at Risk Exposure</div>
               <div className="text-3xl font-mono text-white tracking-tight">{exposure}</div>
               <div className="text-sm text-slate-400 mt-2 font-medium flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" />
                  {incident.business_impact.customers_affected.toLocaleString()} customer records exposed
               </div>
             </div>

             <div className="p-5 bg-[#151b2b]/50 rounded-xl border border-slate-800/60">
               <div className="text-[10px] text-amber-400 font-bold tracking-widest uppercase mb-3 flex items-center">
                 <AlertTriangle className="h-3 w-3 mr-1.5" /> Projected Lateral Movement
               </div>
               <div className="text-sm text-slate-200 font-medium mb-3 pb-3 border-b border-slate-800/60">{incident.forecast.threat_type}</div>
               <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                 <span className="flex flex-col">Probability <span className="text-white text-sm mt-0.5">{incident.forecast.probability}%</span></span>
                 <span className="flex flex-col text-right">Time to Impact <span className="text-white text-sm mt-0.5">{incident.forecast.eta_hours}h</span></span>
               </div>
             </div>
          </div>

          {/* Automated Playbook & Copilot */}
          <RemediationPlaybook incident={incident} />
          <Copilot incidentId={incident.incident_id} />

        </div>
      </div>
    </div>
  );
}
