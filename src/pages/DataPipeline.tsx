import React, { useRef, useEffect } from 'react';
import { Database, Filter, GitMerge, Activity, Server, ActivitySquare, Target, Hexagon, Shield, Brain } from 'lucide-react';

export function DataPipeline() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let direction = 1;
    let animationFrameId: number;
    let lastTime = performance.now();

    const scroll = (time: number) => {
      const delta = time - lastTime;
      if (delta > 16) {
        el.scrollLeft += direction * 0.5; // Scroll speed

        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          direction = -1; // Reverse
        } else if (el.scrollLeft <= 0) {
          direction = 1; // Forward
        }
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Pause briefly before starting the scroll
    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scroll);
    }, 2000);

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationFrameId);
    const handleMouseLeave = () => {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(scroll);
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  const nodes = [
    { id: 'collection', label: 'Event Collection Layer', icon: Database, status: 'active', desc: 'Aggregating logs from ATMs, UPI, and Core Banking.' },
    { id: 'normalization', label: 'Data Normalization', icon: Filter, status: 'active', desc: 'Standardizing telemetry into the common schema.' },
    { id: 'correlation', label: 'AI Correlation Engine', icon: GitMerge, status: 'processing', desc: 'Cross-analyzing cyber & transaction events.' },
    { id: 'forecast', label: 'Threat Forecast Engine', icon: Target, status: 'processing', desc: 'Predictive modeling of attack vectors & ETA.' },
    { id: 'digital_twin', label: 'Cyber Digital Twin', icon: Hexagon, status: 'standby', desc: 'Virtual staging of bank infrastructure.' },
    { id: 'resilience', label: 'Operational Resilience', icon: Shield, status: 'active', desc: 'Automated containment & blast radius limits.' },
    { id: 'decision', label: 'Decision Intelligence', icon: Brain, status: 'active', desc: 'AI Copilot & Executive reporting generation.' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10 h-full flex flex-col">
      <header className="mb-4 shrink-0">
        <h1 className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Platform Architecture</h1>
        <p className="text-cyan-500/70 mt-2 text-sm uppercase tracking-widest font-semibold flex items-center">
          <ActivitySquare className="h-4 w-4 mr-2" /> Live ingestion and correlation pipeline status
        </p>
      </header>

      <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl p-8 shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] relative overflow-hidden flex-1 flex flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617]/0 to-transparent pointer-events-none" />
        
        {/* Horizontal scrollable pipeline area */}
        <div 
          ref={scrollRef}
          className="relative z-10 flex-1 overflow-x-auto pb-8 pt-4 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-transparent cursor-ew-resize"
        >
          <div className="flex items-center min-w-max px-4">
            {nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                <div className="flex flex-col items-center w-56 text-center group relative">
                  {/* Status Glow Background */}
                  <div className={`absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[40px] pointer-events-none transition-opacity duration-1000 ${
                    node.status === 'processing' ? 'bg-cyan-500/20 opacity-100' : 'bg-indigo-500/10 opacity-0 group-hover:opacity-100'
                  }`} />
                  
                  <div className={`h-20 w-20 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-500 relative z-10 ${
                    node.status === 'processing' 
                      ? 'bg-indigo-900/40 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)] scale-110' 
                      : node.status === 'standby'
                      ? 'bg-[#0f172a] border-slate-700/50 text-slate-500 shadow-none opacity-60'
                      : 'bg-[#0f172a] border-indigo-500/50 group-hover:border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.2)] group-hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] group-hover:-translate-y-1'
                  }`}>
                    {node.status === 'processing' && (
                      <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/50 animate-ping opacity-75" />
                    )}
                    <node.icon className={`h-8 w-8 transition-colors ${
                      node.status === 'processing' ? 'text-cyan-400 animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' 
                      : node.status === 'standby' ? 'text-slate-600'
                      : 'text-indigo-400 group-hover:text-cyan-300'
                    }`} />
                  </div>
                  
                  <h3 className={`font-bold tracking-widest uppercase text-xs mb-3 transition-colors ${
                    node.status === 'processing' ? 'text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-slate-200 group-hover:text-white'
                  }`}>{node.label}</h3>
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed h-10 px-2">{node.desc}</p>
                  
                  <div className={`mt-5 flex items-center space-x-2 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md border backdrop-blur-sm transition-colors ${
                    node.status === 'processing' ? 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : node.status === 'standby' ? 'bg-slate-900/50 border-slate-800 text-slate-500'
                    : 'bg-indigo-950/50 border-indigo-500/30 text-emerald-400'
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      node.status === 'processing' ? 'bg-cyan-400 animate-pulse shadow-[0_0_5px_rgba(34,211,238,0.8)]' 
                      : node.status === 'standby' ? 'bg-slate-600'
                      : 'bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.8)]'
                    }`} />
                    <span>
                      {node.status === 'processing' ? 'Processing' : node.status === 'standby' ? 'Standby' : 'Online'}
                    </span>
                  </div>
                </div>
                
                {i < nodes.length - 1 && (
                  <div className="flex h-0.5 w-12 mx-2 bg-indigo-500/20 relative overflow-hidden rounded-full mb-16 shrink-0">
                    <div className={`absolute top-0 left-0 h-full w-full ${
                      nodes[i].status === 'standby' || nodes[i+1].status === 'standby' 
                      ? 'bg-transparent' 
                      : 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[translate-x_2s_linear_infinite]'
                    }`} style={{ transform: 'translateX(-100%)' }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Metrics Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0 border-t border-indigo-500/20 pt-8 relative z-10">
          <div className="bg-[#020617]/80 border border-indigo-500/20 rounded-xl p-5 shadow-[inset_0_0_20px_rgba(79,70,229,0.05)]">
             <div className="text-[10px] uppercase tracking-widest text-indigo-400/70 font-bold mb-2">Ingestion Rate</div>
             <div className="text-3xl font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] font-bold">4.2M <span className="text-sm text-slate-500 tracking-normal font-sans">events/hr</span></div>
          </div>
          <div className="bg-[#020617]/80 border border-indigo-500/20 rounded-xl p-5 shadow-[inset_0_0_20px_rgba(79,70,229,0.05)]">
             <div className="text-[10px] uppercase tracking-widest text-indigo-400/70 font-bold mb-2">Correlation Latency</div>
             <div className="text-3xl font-mono text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] font-bold">14<span className="text-sm text-slate-500 tracking-normal font-sans">ms</span></div>
          </div>
          <div className="bg-[#020617]/80 border border-indigo-500/20 rounded-xl p-5 shadow-[inset_0_0_20px_rgba(79,70,229,0.05)]">
             <div className="text-[10px] uppercase tracking-widest text-indigo-400/70 font-bold mb-2">Active Rulesets</div>
             <div className="text-3xl font-mono text-indigo-400 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)] font-bold">1,842</div>
          </div>
          <div className="bg-[#020617]/80 border border-amber-500/20 rounded-xl p-5 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]">
             <div className="text-[10px] uppercase tracking-widest text-amber-500/70 font-bold mb-2">Detected Anomalies</div>
             <div className="text-3xl font-mono text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] font-bold">127 <span className="text-sm text-slate-500 tracking-normal font-sans">last 24h</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
