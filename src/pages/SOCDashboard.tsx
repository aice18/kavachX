import { useEffect, useState, useRef } from 'react';
import { useKavachWebSocket } from '../lib/websocket';
import { Link } from 'react-router-dom';
import { Activity, Radio, Terminal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// India SVG map with attack origin points
function IndiaThreatMap({ incidents }: { incidents: any[] }) {
  const [pulses, setPulses] = useState<{ id: string; x: number; y: number; city: string }[]>([]);

  useEffect(() => {
    // Fixed attack origin points on India SVG (approximate)
    const origins = [
      { x: 120, y: 85,  city: 'St. Petersburg' },
      { x: 160, y: 95,  city: 'Shenzhen' },
      { x: 95,  y: 110, city: 'Lagos' },
    ];

    // Indian city targets
    const targets = [
      { x: 210, y: 210, city: 'Mumbai' },
      { x: 220, y: 170, city: 'Delhi' },
      { x: 235, y: 230, city: 'Bangalore' },
      { x: 240, y: 195, city: 'Hyderabad' },
      { x: 260, y: 175, city: 'Kolkata' },
    ];

    setPulses([
      ...origins.map((o, i) => ({ id: `origin-${i}`, ...o })),
      ...targets.map((t, i) => ({ id: `target-${i}`, ...t })),
    ]);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#050a14] overflow-hidden rounded-xl">
      {/* Grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }} />

      <svg viewBox="0 0 400 450" className="w-full h-full opacity-80">
        {/* India outline (simplified) */}
        <path
          d="M180,80 L220,75 L255,85 L270,100 L275,120 L280,145 L275,170 L270,185 L280,200 L285,220 L275,245 L260,265 L250,285 L240,305 L235,325 L225,345 L215,360 L205,375 L195,365 L185,345 L175,325 L170,305 L165,285 L155,265 L145,250 L140,230 L135,210 L140,190 L145,170 L140,150 L135,130 L140,110 L155,90 Z"
          fill="rgba(34, 211, 238, 0.05)"
          stroke="rgba(34, 211, 238, 0.25)"
          strokeWidth="1.5"
        />
        {/* State borders suggestion */}
        <path d="M160,180 L280,180" stroke="rgba(79, 70, 229, 0.15)" strokeWidth="0.5" strokeDasharray="4,4" />
        <path d="M145,250 L280,250" stroke="rgba(79, 70, 229, 0.15)" strokeWidth="0.5" strokeDasharray="4,4" />
        <path d="M207,80 L207,375" stroke="rgba(79, 70, 229, 0.15)" strokeWidth="0.5" strokeDasharray="4,4" />

        {/* Attack trace lines from outside */}
        {[
          { x1: 20, y1: 60, x2: 210, y2: 210 },
          { x1: 20, y1: 60, x2: 220, y2: 170 },
          { x1: 380, y1: 40, x2: 240, y2: 195 },
          { x1: 30, y1: 120, x2: 235, y2: 230 },
        ].map((line, i) => (
          <line
            key={i}
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="rgba(239, 68, 68, 0.25)"
            strokeWidth="1"
            strokeDasharray="4,6"
          />
        ))}

        {/* Attacker origin pulses */}
        {[{ cx: 20, cy: 60, label: 'RU' }, { cx: 380, cy: 40, label: 'CN' }, { cx: 30, cy: 120, label: 'NG' }].map((o, i) => (
          <g key={`att-${i}`}>
            <circle cx={o.cx} cy={o.cy} r="6" fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth="1.5">
              <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" begin={`${i * 0.7}s`} />
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" begin={`${i * 0.7}s`} />
            </circle>
            <circle cx={o.cx} cy={o.cy} r="3" fill="#ef4444" />
            <text x={o.cx + 8} y={o.cy + 4} fill="#ef4444" fontSize="8" fontFamily="monospace" fontWeight="bold">{o.label}</text>
          </g>
        ))}

        {/* Indian city targets */}
        {[
          { cx: 210, cy: 210, label: 'BOM' },
          { cx: 220, cy: 162, label: 'DEL' },
          { cx: 237, cy: 235, label: 'BLR' },
          { cx: 242, cy: 198, label: 'HYD' },
          { cx: 262, cy: 175, label: 'CCU' },
        ].map((t, i) => (
          <g key={`tgt-${i}`}>
            <circle cx={t.cx} cy={t.cy} r="4" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.6)" strokeWidth="1">
              <animate attributeName="r" values="4;8;4" dur="3s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
              <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
            </circle>
            <circle cx={t.cx} cy={t.cy} r="2.5" fill="#22d3ee" />
            <text x={t.cx + 5} y={t.cy + 4} fill="rgba(34,211,238,0.8)" fontSize="7" fontFamily="monospace">{t.label}</text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-col space-y-1.5">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest">Attack Origin</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">Target Institution</span>
        </div>
      </div>

      {/* Active count badge */}
      {incidents.length > 0 && (
        <div className="absolute top-3 right-3 bg-red-500/20 border border-red-500/40 px-3 py-1.5 rounded-lg">
          <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">{incidents.length} Active Threats</span>
        </div>
      )}
    </div>
  );
}

// Live event log terminal
function EventLogTerminal() {
  const [logs, setLogs] = useState<string[]>([
    '> [SYSTEM] KavachX SOC engine initialized',
    '> [STREAM] Telemetry ingestion active — 4.2M events/hr',
    '> [AI] Correlation engine scanning for cross-signal anomalies...',
    '> [UPI] Normal transaction volume detected — Mumbai corridor',
    '> [VPN] Login from known IP — EMP_1102 — New Delhi',
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const EVENT_POOL = [
    '[UPI] Transfer ₹{amt} — {city} — NORMAL',
    '[ATM] Card swipe — Branch {branch} — NORMAL',
    '[VPN] Login from {ip} — Employee {emp} — NORMAL',
    '[API] OAuth token refresh — service account — NORMAL',
    '[DB] Query SELECT — table: accounts — rows: {rows} — NORMAL',
    '[FIREWALL] Blocked connection attempt — {ip} — SUSPICIOUS',
    '[UPI] Failed transfer — insufficient funds — {city}',
    '[NEFT] Batch settlement processed — ₹{amt}Cr — CLEAR',
  ];

  useEffect(() => {
    const tick = setInterval(() => {
      const template = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      const log = template
        .replace('{amt}', (Math.floor(Math.random() * 50000) + 1000).toLocaleString('en-IN'))
        .replace('{city}', ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'][Math.floor(Math.random() * 5)])
        .replace('{branch}', String(Math.floor(Math.random() * 20) + 1))
        .replace('{ip}', `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`)
        .replace('{emp}', `EMP_${Math.floor(Math.random() * 9000) + 1000}`)
        .replace('{rows}', String(Math.floor(Math.random() * 1000) + 10));
      setLogs(prev => [...prev.slice(-49), `> ${log}`]);
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-[#020617]/90 backdrop-blur border border-indigo-500/20 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-3 border-b border-indigo-500/10 flex items-center space-x-2 bg-[#0f172a]/50 shrink-0">
        <Terminal className="h-4 w-4 text-cyan-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Event Log</span>
        <div className="ml-auto flex items-center space-x-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Streaming</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5 font-mono text-[10px]">
        {logs.map((log, i) => (
          <div
            key={i}
            className={`leading-relaxed ${
              log.includes('SUSPICIOUS') ? 'text-amber-400' :
              log.includes('CRITICAL') ? 'text-red-400' :
              i === logs.length - 1 ? 'text-cyan-300' :
              'text-slate-500'
            }`}
          >
            {log}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

export function SOCDashboard() {
  const { activeIncidents } = useKavachWebSocket();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
      <header className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">SOC Console</h1>
          <p className="text-cyan-500/70 mt-2 text-sm uppercase tracking-widest font-semibold flex items-center">
            <Activity className="h-4 w-4 mr-2" /> Real-time correlation engine feed
          </p>
        </div>
        <div className="flex items-center space-x-3 text-sm bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs">Stream Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 700 }}>

        {/* Incident Feed */}
        <div className="lg:col-span-1 bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl overflow-hidden flex flex-col shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 opacity-50" />
          <div className="p-5 border-b border-indigo-500/10 bg-indigo-500/5 relative z-10 shrink-0">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-300 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-cyan-400" /> Live Correlated Incidents
              <span className="ml-auto text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{activeIncidents.length}</span>
            </h2>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4 z-10 relative">
            {activeIncidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Radio className="h-10 w-10 text-indigo-500/30 mb-4 animate-pulse" />
                <p className="text-slate-300 font-bold uppercase tracking-widest text-sm">Awaiting telemetry...</p>
                <p className="text-cyan-500/50 text-xs font-semibold tracking-wider uppercase mt-2">Correlation engine listening</p>
              </div>
            ) : (
              activeIncidents.map((inc: any) => (
                <Link to={`/dashboard/incident/${inc.incident_id}`} key={inc.incident_id} className="block group">
                  <div className="bg-[#020617]/80 border border-indigo-500/20 rounded-xl p-4 group-hover:border-cyan-500/50 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-center mb-3 pl-2">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${inc.severity === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : inc.severity === 'high' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/30'}`}>
                        {inc.severity}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                        {formatDistanceToNow(new Date(inc.updated_at), { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-sm mb-2 flex items-center pl-2">
                      <span className="text-slate-400 font-medium mr-2">Entity:</span>
                      <span className="text-cyan-300 font-mono">{inc.entity_id}</span>
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed pl-2 font-medium mb-3">
                      {inc.reasons?.[0]?.factor || 'Multiple anomalous events detected.'}
                    </p>
                    <div className="flex items-center justify-between pl-2 pt-2 border-t border-indigo-500/10">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-red-400/70 font-bold block">Risk Score</span>
                        <span className="text-red-400 font-mono font-bold text-lg">{inc.risk_score}</span>
                      </div>
                      <span className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] bg-cyan-500/10 px-3 py-1.5 rounded-md border border-cyan-500/20 group-hover:bg-cyan-500/20">
                        Investigate →
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Panel — Map + Log */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-4">
          {/* India Threat Map */}
          <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl overflow-hidden shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] relative">
            <div className="absolute top-0 inset-x-0 p-4 z-10 bg-gradient-to-b from-[#020617]/80 to-transparent pointer-events-none">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center">
                <Activity className="h-3 w-3 mr-2 text-cyan-400" /> Global Threat Origin Map
              </h2>
            </div>
            <IndiaThreatMap incidents={activeIncidents} />
          </div>

          {/* Live Event Log */}
          <EventLogTerminal />
        </div>
      </div>
    </div>
  );
}
