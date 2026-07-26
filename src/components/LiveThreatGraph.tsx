import React, { useEffect, useRef, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

export default function LiveThreatGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      setDimensions({
        width: containerRef.current?.clientWidth || 0,
        height: containerRef.current?.clientHeight || 0
      });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await fetch(`${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/fraud/rtgs-graph`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.nodes) setGraphData(data);
        }
      } catch (err) {
        console.error("Failed to fetch graph", err);
      }
    };

    fetchGraph();
    const interval = setInterval(fetchGraph, 5000); // Poll every 5s for CDC updates
    return () => clearInterval(interval);
  }, []);

  if (dimensions.width === 0) return <div ref={containerRef} className="w-full h-full min-h-[400px] bg-slate-900 rounded-lg" />;

  const getNodeColor = (node: any) => {
    if (node.is_quantum_threat) return '#ef4444';
    switch (node.group) {
      case 'User': return '#3b82f6'; // blue-500
      case 'Device': return '#8b5cf6'; // violet-500
      case 'IP': return '#f97316'; // orange-500
      case 'BankAccount': return '#10b981'; // emerald-500
      case 'Transaction': return '#f59e0b'; // amber-500
      case 'Alert': return '#ef4444'; // red-500
      default: return '#94a3b8'; // slate-400
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] bg-slate-900 rounded-lg overflow-hidden relative shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
      {/* Overlay gradient for styling */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-slate-900/50"></div>
      
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">Live Neo4j Graph Sync</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-xl pointer-events-none">
        <div className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider border-b border-slate-700 pb-1">Graph Legend</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono">
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span> <span className="text-slate-400">User</span></div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> <span className="text-slate-400">Account</span></div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span> <span className="text-slate-400">Device</span></div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span> <span className="text-slate-400">Transaction</span></div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span> <span className="text-slate-400">IP Address</span></div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span> <span className="text-slate-400">Threat Alert</span></div>
        </div>
      </div>

      <ForceGraph3D
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel="label"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={d => d.value * 0.001 || 0.01}
        nodeResolution={16}
        backgroundColor="rgba(0,0,0,0)"
        nodeColor={getNodeColor}
      />
    </div>
  );
}
