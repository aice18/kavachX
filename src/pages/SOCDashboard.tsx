import { useEffect, useState, useRef } from 'react';
import { useKavachWebSocket } from '../lib/websocket';
import { Link } from 'react-router-dom';
import { Shield, Activity, Terminal, AlertTriangle, Radio } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Global SVG map with attack origin points
function GlobalThreatMap({ incidents }: { incidents: any[] }) {
  const [pulses, setPulses] = useState<{ id: string; x: number; y: number; city: string }[]>([]);

  useEffect(() => {
    // Global attack origins based on 950x620 viewbox
    const origins = [
      { x: 550, y: 160, city: 'St. Petersburg' },
      { x: 770, y: 260, city: 'Shenzhen' },
      { x: 470, y: 350, city: 'Lagos' },
      { x: 190, y: 200, city: 'Unknown (Proxy)' },
    ];

    // Global targets
    const targets = [
      { x: 670, y: 310, city: 'Mumbai Hub' },
      { x: 270, y: 210, city: 'NY Datacenter' },
      { x: 480, y: 180, city: 'Frankfurt Core' },
    ];

    setPulses([
      ...origins.map((o, i) => ({ id: `origin-${i}`, ...o })),
      ...targets.map((t, i) => ({ id: `target-${i}`, ...t })),
    ]);
  }, []);

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden rounded-3xl">
      {/* Subtle Grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundPosition: 'center center'
      }} />

      {/* Real World Map Image */}
      <img src="/WorldMap.svg" className="absolute inset-0 w-full h-full object-contain opacity-30 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]" style={{ filter: 'invert(1) hue-rotate(180deg) brightness(2)' }} alt="World Map" />

      {/* Overlay SVG for animations */}
      <svg viewBox="0 0 950 620" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Attack trace lines */}
        {[
          { x1: 550, y1: 160, x2: 670, y2: 310 },
          { x1: 770, y1: 260, x2: 670, y2: 310 },
          { x1: 470, y1: 350, x2: 480, y2: 180 },
          { x1: 190, y1: 200, x2: 270, y2: 210 },
          { x1: 550, y1: 160, x2: 480, y2: 180 },
        ].map((line, i) => (
          <line
            key={i}
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="6,8"
          />
        ))}
        {/* Attacker origin pulses */}
        {[{ cx: 550, cy: 160, label: 'RU' }, { cx: 770, cy: 260, label: 'CN' }, { cx: 470, cy: 350, label: 'NG' }, { cx: 190, cy: 200, label: 'UNK' }].map((o, i) => (
          <g key={`att-${i}`}>
            <circle cx={o.cx} cy={o.cy} r="10" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="1">
              <animate attributeName="r" values="10;25;10" dur="3s" repeatCount="indefinite" begin={`${i * 0.7}s`} />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" begin={`${i * 0.7}s`} />
            </circle>
            <circle cx={o.cx} cy={o.cy} r="4" fill="#3b82f6" />
            <text x={o.cx + 14} y={o.cy + 5} fill="#3b82f6" fontSize="12" fontFamily="monospace" fontWeight="500" letterSpacing="1">{o.label}</text>
          </g>
        ))}

        {/* Targets */}
        {[
          { cx: 670, cy: 310, label: 'BOM' },
          { cx: 270, cy: 210, label: 'NYC' },
          { cx: 480, cy: 180, label: 'FRA' },
        ].map((t, i) => (
          <g key={`tgt-${i}`}>
            <circle cx={t.cx} cy={t.cy} r="6" fill="rgba(34,211,238,0.1)" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5">
              <animate attributeName="r" values="6;18;6" dur="4s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
            </circle>
            <circle cx={t.cx} cy={t.cy} r="4" fill="#22d3ee" />
            <text x={t.cx + 12} y={t.cy + 5} fill="rgba(34,211,238,0.8)" fontSize="11" fontFamily="monospace" fontWeight="400" letterSpacing="1">{t.label}</text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex flex-col space-y-2 bg-[#0B0D11]/80 backdrop-blur-sm p-4 rounded-xl border border-[#272B36]">
        <div className="flex items-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-[10px] text-white/50 font-medium uppercase tracking-[0.2em]">Attack Origin</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-[10px] text-white/50 font-medium uppercase tracking-[0.2em]">Target Node</span>
        </div>
      </div>

      {/* Active count badge */}
      {incidents.length > 0 && (
        <div className="absolute top-6 right-6 bg-[#0B0D11]/80 backdrop-blur-sm border border-[#272B36] px-4 py-2 rounded-full">
          <span className="text-[9px] text-white/80 font-bold uppercase tracking-[0.2em]">{incidents.length} Active Threats</span>
        </div>
      )}
    </div>
  );
}

// Live event log terminal
function EventLogTerminal() {
  const [logs, setLogs] = useState<string[]>([
    '> [VPN] Login from known IP — EMP_1102 — New Delhi',
    '> [UPI] Normal transaction volume detected — Mumbai corridor',
    '> [AI] Correlation engine scanning for cross-signal anomalies...',
    '> [STREAM] Telemetry ingestion active — 4.2M events/hr',
    '> [SYSTEM] KavachX SOC engine initialized',
  ]);

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
      // Prepend newest log first, keep max 50
      setLogs(prev => [`> ${log}`, ...prev].slice(0, 50));
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="bg-[#1C1F26] border border-[#272B36] rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-[#272B36] flex items-center space-x-3 shrink-0">
        <Terminal className="h-4 w-4 text-white/40" />
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">Live Event Log</span>
        <div className="ml-auto flex items-center space-x-2">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] text-blue-500 font-bold uppercase tracking-[0.2em]">Streaming</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-2 font-mono text-xs custom-scrollbar relative z-10">
        {logs.map((log, i) => (
          <div
            key={i}
            className={`leading-relaxed tracking-wider ${
              log.includes('SUSPICIOUS') ? 'text-amber-300/90' :
              log.includes('CRITICAL') ? 'text-rose-400/90' :
              i === 0 ? 'text-cyan-300' : 
              'text-white/50'
            }`}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SOCDashboard() {
  const { activeIncidents } = useKavachWebSocket();
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: string }[]>([]);

  useEffect(() => {
    // Generate a random alert every 8-15 seconds for demo purposes
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const id = Date.now().toString();
        const types = ['CRITICAL', 'HIGH', 'WARNING'];
        const type = types[Math.floor(Math.random() * types.length)];
        const msgs = [
          'Multiple failed logins detected on EMP_4920',
          'Anomalous outbound traffic to known bad IP',
          'Data exfiltration signature match: CustomerDB',
          'RTGS threshold exceeded for Account #9921',
          'PQC: Vulnerable key exchange detected',
          'API Gateway: Rate limit breached (Endpoint: /v1/transfer)',
          'Unauthorized IAM role assumption attempt'
        ];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        
        setToasts(prev => [...prev, { id, msg, type }]);
        
        // Auto remove after 5s
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-2 shrink-0 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight">SOC Console</h1>
          <p className="text-blue-500 mt-3 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center">
            <Activity className="h-4 w-4 mr-2" /> Real-time correlation engine feed
          </p>
        </div>
        <div className="flex items-center space-x-3 text-sm bg-[#1C1F26] border border-[#272B36] px-5 py-3 rounded-xl shadow-sm">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-blue-500 font-bold tracking-[0.2em] uppercase text-[9px]">Stream Active</span>
        </div>
      </header>

      <div className="flex flex-col gap-6 flex-1 min-h-[750px]">
        {/* Top Section: Stacked Map and Log for maximum width */}
        <div className="grid grid-cols-1 gap-6">
          {/* Global Threat Map */}
          <div className="bg-[#1C1F26] border border-[#272B36] rounded-2xl overflow-hidden relative transition-colors duration-200 h-[400px] lg:h-[450px]">
            <div className="absolute top-0 inset-x-0 p-6 z-10 pointer-events-none">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 flex items-center">
                <Radio className="h-4 w-4 mr-3 text-blue-500 animate-pulse" /> Global Threat Origin Map
              </h2>
            </div>
            <GlobalThreatMap incidents={activeIncidents} />
          </div>

          {/* Live Event Log */}
          <div className="h-[250px]">
            <EventLogTerminal />
          </div>
        </div>

        {/* Bottom Section: Incident Feed */}
        <div className="bg-[#1C1F26] border border-[#272B36] rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-[#272B36] shrink-0 flex items-center justify-between">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 flex items-center">
              <Activity className="h-4 w-4 mr-3 text-red-500" /> Live Alerts
            </h2>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-red-500 bg-red-500/10 px-4 py-1.5 rounded-full">
              {activeIncidents.length} Critical
            </span>
          </div>
          
          <div className="p-6 relative z-10">
            {activeIncidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center opacity-70">
                <Radio className="h-12 w-12 text-white/20 mb-4 animate-ping" />
                <p className="text-white/50 font-medium uppercase tracking-[0.2em] text-[10px]">Awaiting telemetry...</p>
                <p className="text-white/30 text-[9px] font-light tracking-[0.3em] uppercase mt-2">Correlation engine listening</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...activeIncidents]
                  .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                  .map((inc: any) => (
                    <Link to={`/dashboard/incident/${inc.incident_id}`} key={inc.incident_id} className="block group">
                      <div className="bg-[#13151A] border border-[#272B36] rounded-2xl p-6 group-hover:border-[#3b82f6]/50 transition-all duration-200 shadow-sm relative overflow-hidden h-full flex flex-col justify-between">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${inc.severity === 'critical' ? 'bg-red-500' : 'bg-blue-500'}`} />
                        
                        <div>
                          <div className="flex justify-between items-center mb-5 pl-3">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-medium uppercase tracking-[0.2em] ${inc.severity === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                              {inc.severity}
                            </span>
                            <span className="text-[9px] uppercase font-medium tracking-[0.2em] text-white/40">
                              {formatDistanceToNow(new Date(inc.updated_at), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <h3 className="text-white font-medium text-sm mb-3 flex items-center pl-3">
                            <span className="text-white/40 mr-2 text-[10px] tracking-[0.2em] uppercase font-medium">Target:</span>
                            <span className="font-mono tracking-wider text-white/90">{inc.entity_id}</span>
                          </h3>
                          
                          <p className="text-white/60 text-xs line-clamp-2 leading-relaxed pl-3 font-normal mb-6">
                            {inc.reasons?.[0]?.factor || 'Multiple anomalous events detected.'}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pl-3 pt-5 border-t border-[#272B36] mt-auto">
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium block mb-1">Risk Score</span>
                            <span className={`font-mono font-medium text-2xl ${inc.severity === 'critical' ? 'text-red-500' : 'text-blue-500'}`}>{inc.risk_score}</span>
                          </div>
                          <span className="text-white/90 font-medium uppercase tracking-[0.2em] text-[9px] bg-[#1C1F26] px-5 py-2.5 rounded-lg border border-[#272B36] group-hover:bg-[#272B36] transition-colors">
                            Investigate →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="flex items-start p-5 rounded-2xl shadow-lg bg-[#1C1F26] border border-[#272B36] animate-in slide-in-from-right-10 fade-in duration-300 w-80 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              toast.type === 'CRITICAL' ? 'bg-red-500' :
              toast.type === 'HIGH' ? 'bg-amber-400' : 'bg-blue-500'
            }`} />
            <AlertTriangle className={`h-5 w-5 mr-4 shrink-0 mt-0.5 ml-2 ${
              toast.type === 'CRITICAL' ? 'text-red-500' :
              toast.type === 'HIGH' ? 'text-amber-400' : 'text-blue-500'
            }`} />
            <div className="flex flex-col">
              <span className={`text-[9px] font-bold uppercase tracking-[0.2em] mb-1 ${
                toast.type === 'CRITICAL' ? 'text-red-500' :
                toast.type === 'HIGH' ? 'text-amber-400' : 'text-blue-500'
              }`}>{toast.type} ALERT</span>
              <span className="text-white/80 text-xs font-medium leading-relaxed">{toast.msg}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
