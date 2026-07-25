import React, { useEffect, useState, useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

interface Node {
  id: string;
  group: string;
  label: string;
}

interface Link {
  source: string;
  target: string;
  label: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export default function FraudGraph3D() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const fgRef = useRef<any>(null);

  useEffect(() => {
    // Fetch Graph Data from the Backend Neo4j Service
    fetch('http://localhost:3001/api/fraud/rtgs-graph')
      .then(res => res.json())
      .then((graphData: GraphData) => {
        setData(graphData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch fraud graph:', err);
        setLoading(false);
      });
  }, []);

  const getNodeColor = (group: string) => {
    switch (group) {
      case 'User': return '#f43f5e'; // rose-500
      case 'Device': return '#eab308'; // yellow-500
      case 'IP': return '#ef4444'; // red-500
      case 'BankAccount': return '#3b82f6'; // blue-500
      case 'Transaction': return '#10b981'; // emerald-500
      case 'Alert': return '#8b5cf6'; // violet-500
      default: return '#94a3b8'; // slate-400
    }
  };

  if (loading) {
    return <div className="h-[400px] flex items-center justify-center bg-slate-900 rounded-3xl animate-pulse text-white font-mono">Connecting to Neo4j...</div>;
  }

  return (
    <div className="h-[400px] w-full bg-slate-900 rounded-3xl overflow-hidden shadow-inner border border-slate-700 relative">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        nodeLabel="label"
        nodeColor={(node: any) => getNodeColor(node.group)}
        nodeRelSize={6}
        linkColor={() => 'rgba(255,255,255,0.2)'}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.01}
        backgroundColor="#0f172a"
        showNavInfo={false}
      />
      <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-700 pointer-events-none">
        <p className="text-xs font-mono text-slate-300 font-bold mb-2">NEO4J LIVE CORRELATION</p>
        <div className="flex flex-col gap-1 text-[10px] font-mono">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span> User</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Device</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Bank Account</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Transaction</span>
        </div>
      </div>
    </div>
  );
}
