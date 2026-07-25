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
        const res = await fetch(`${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/fraud/correlation-graph`);
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

      <ForceGraph3D
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel="label"
        nodeAutoColorBy="group"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={d => d.value * 0.001 || 0.01}
        nodeResolution={16}
        backgroundColor="rgba(0,0,0,0)"
        nodeColor={(node: any) => node.is_quantum_threat ? '#ef4444' : undefined}
      />
    </div>
  );
}
