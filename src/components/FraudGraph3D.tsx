import React, { useEffect, useState, useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

interface Node {
  id: string;
  group: string;
  label: string;
  risk?: number;
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
    fetch('http://localhost:3002/api/fraud/rtgs-graph')
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
      case 'Session': return '#ec4899'; // pink-500
      default: return '#94a3b8'; // slate-400
    }
  };

  if (loading) {
    return <div className="h-[500px] flex items-center justify-center bg-slate-900 rounded-3xl animate-pulse text-white font-mono">Initializing Neo4j Graph Engine...</div>;
  }

  return (
    <div className="h-[500px] w-full bg-[#0a0f1c] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 relative">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        nodeLabel={(node: any) => `<div class="font-sans text-sm p-2 bg-slate-800 rounded shadow-lg border border-slate-600">
          <span class="font-bold text-[${getNodeColor(node.group)}]">${node.group}</span><br/>
          <span class="text-white">${node.label}</span>
        </div>`}
        nodeColor={(node: any) => getNodeColor(node.group)}
        nodeRelSize={8}
        nodeVal={(node: any) => (node.group === 'User' || node.group === 'Transaction') ? 30 : 15}
        nodeThreeObject={(node: any) => {
          // Custom glowing spheres
          const color = getNodeColor(node.group);
          const size = (node.group === 'User' || node.group === 'Transaction') ? 12 : 6;
          
          const group = new THREE.Group();
          
          const geometry = new THREE.SphereGeometry(size);
          const material = new THREE.MeshLambertMaterial({ 
            color,
            transparent: true,
            opacity: 0.9,
          });
          const sphere = new THREE.Mesh(geometry, material);
          group.add(sphere);

          // Add a glowing halo for high risk nodes
          if (node.group === 'Alert' || node.group === 'User' || node.group === 'Transaction') {
            const haloGeo = new THREE.SphereGeometry(size * 1.5);
            const haloMat = new THREE.MeshBasicMaterial({
              color,
              transparent: true,
              opacity: 0.2,
              side: THREE.BackSide
            });
            const halo = new THREE.Mesh(haloGeo, haloMat);
            group.add(halo);
          }

          return group;
        }}
        linkColor={() => 'rgba(148, 163, 184, 0.4)'}
        linkWidth={1.5}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleSpeed={0.015}
        linkDirectionalParticleColor={(link: any) => {
          if (link.label === 'FLAGS' || link.label === 'HIJACKS') return '#ef4444';
          if (link.label === 'SPLITS_INTO' || link.label === 'CREDITS') return '#10b981';
          return '#38bdf8';
        }}
        backgroundColor="#0a0f1c"
        showNavInfo={false}
      />
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur px-4 py-3 rounded-xl border border-slate-700/50 shadow-xl pointer-events-none">
        <p className="text-xs font-mono text-emerald-400 font-bold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          LIVE NEO4J CORRELATION
        </p>
        <div className="flex flex-col gap-2 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span> User Identity</span>
          <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></span> Trusted Device</span>
          <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span> Threat/IP/Alert</span>
          <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span> Bank Account</span>
          <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span> Financial Tx</span>
        </div>
      </div>
    </div>
  );
}
