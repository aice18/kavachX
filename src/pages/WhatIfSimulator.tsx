import React, { useState } from 'react';
import { Search, Loader2, AlertTriangle, GitPullRequest, DollarSign, Users, Clock, ShieldAlert, Network } from 'lucide-react';
import { simulateWhatIf } from '../lib/api';
import { ReactFlow, Controls, Background, MarkerType, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const PRESET_SCENARIOS = [
  { id: 'ATM_143',           label: 'ATM_143 (Branch 7)',    desc: 'Branch ATM — moderate connectivity' },
  { id: 'DB_CORE_1',         label: 'DB_CORE_1',             desc: 'Core banking DB — critical' },
  { id: 'SWIFT_GATEWAY_NODE',label: 'SWIFT_GATEWAY_NODE',    desc: 'Payment gateway — critical' },
  { id: 'EMP_8492',          label: 'EMP_8492',              desc: 'Compromised employee entity' },
];

function BlastRadiusGraph({ affectedNodes, assetId }: { affectedNodes: any[]; assetId: string }) {
  const flowNodes = affectedNodes.map((n, i) => ({
    id: n.id,
    position: {
      x: n.id === assetId ? 350 : 200 + Math.cos(i * (2 * Math.PI / affectedNodes.length)) * 200,
      y: n.id === assetId ? 200 : 200 + Math.sin(i * (2 * Math.PI / affectedNodes.length)) * 150,
    },
    data: { label: `${n.label}\n${n.id}` },
    style: {
      background: n.id === assetId ? '#1e3a8a' : n.isFlagged ? '#1e40af' : '#1e293b',
      color: n.id === assetId ? '#bfdbfe' : n.isFlagged ? '#93c5fd' : '#cbd5e1',
      border: `2px solid ${n.id === assetId ? '#3b82f6' : n.isFlagged ? '#60a5fa' : '#334155'}`,
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontFamily: 'monospace',
      width: 130,
      textAlign: 'center' as const,
      boxShadow: n.id === assetId
        ? '0 0 20px rgba(59,130,246,0.5)'
        : n.isFlagged
        ? '0 0 12px rgba(96,165,250,0.3)'
        : 'none',
    },
  }));

  const flowEdges = affectedNodes
    .filter(n => n.id !== assetId)
    .map((n, i) => ({
      id: `e-${assetId}-${n.id}-${i}`,
      source: assetId,
      target: n.id,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
    }));

  const [nodes] = useNodesState(flowNodes);
  const [edges] = useEdgesState(flowEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      colorMode="dark"
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#1e293b" gap={20} size={1} />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export function WhatIfSimulator() {
  const [asset, setAsset] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const data = await simulateWhatIf(asset);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight flex items-center">
          What-If Simulator
          <span className="ml-4 text-[9px] bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-1 rounded-full uppercase tracking-[0.2em] font-bold">Graph-Based</span>
        </h1>
        <p className="text-blue-500 mt-3 text-[11px] uppercase tracking-[0.2em] font-medium flex items-center">
          <GitPullRequest className="h-4 w-4 mr-2" /> BFS graph traversal · Predictive blast radius and financial exposure analysis
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Panel — Controls */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-[#1C1F26] border border-[#272B36] rounded-2xl p-8 shadow-sm">
            <h2 className="text-[10px] font-medium text-white/70 mb-6 uppercase tracking-[0.2em] flex items-center">
              <GitPullRequest className="h-4 w-4 mr-2 text-blue-500" /> Scenario Parameters
            </h2>
            <form onSubmit={handleSimulate} className="space-y-5">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">Target Asset / Node ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-white/30" />
                  </div>
                  <input
                    type="text"
                    value={asset}
                    onChange={e => setAsset(e.target.value)}
                    required
                    className="block w-full pl-11 pr-4 py-4 border border-[#272B36] rounded-xl bg-[#13151A] text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-mono placeholder:text-white/20"
                    placeholder="e.g. DB_CORE_1, EMP_8492"
                  />
                </div>
                <p className="text-[10px] text-white/40 mt-3 font-normal leading-relaxed">Graph BFS traversal calculates true blast radius from entity relationships.</p>
              </div>
              <button
                type="submit"
                disabled={loading || !asset}
                className="w-full flex items-center justify-center py-4 px-4 border border-blue-500/20 rounded-xl shadow-sm text-[10px] font-bold tracking-[0.2em] uppercase text-white bg-blue-600 hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Traversing...</> : <><AlertTriangle className="h-5 w-5 mr-2" /> Run Scenario</>}
              </button>
            </form>
          </div>

          {/* Presets */}
          <div className="bg-[#1C1F26] border border-[#272B36] rounded-2xl p-6 shadow-sm">
            <h2 className="text-[10px] font-medium text-white/70 mb-5 uppercase tracking-[0.2em]">Preset Scenarios</h2>
            <div className="space-y-3">
              {PRESET_SCENARIOS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setAsset(p.id)}
                  className="w-full text-left px-5 py-4 rounded-xl border border-[#272B36] bg-[#13151A] hover:border-blue-500/50 hover:bg-[#272B36] transition-all group"
                >
                  <div className="font-mono text-sm text-white/90 group-hover:text-white">{p.label}</div>
                  <div className="text-[9px] text-white/50 mt-1.5 uppercase tracking-[0.1em] font-normal">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel — Results */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-[600px] bg-[#1C1F26] border border-[#272B36] rounded-2xl flex flex-col items-center justify-center shadow-sm">
              <div className="text-center">
                <div className="h-16 w-16 border-4 border-[#272B36] border-t-blue-500 rounded-full animate-spin mx-auto mb-8" />
                <p className="text-white/60 font-mono text-[10px] tracking-[0.3em] uppercase font-medium">Traversing relationship graph...</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
              {/* Header */}
              <div className="bg-[#1C1F26] border border-[#272B36] rounded-2xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-medium text-white tracking-wide uppercase">
                    Blast Radius: <span className="text-blue-500 font-mono ml-2">{result.asset_id}</span>
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-[10px] text-white/50 font-mono font-medium tracking-widest">Graph depth: {result.blast_radius_depth} hops</span>
                    <span className="px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] bg-red-500/10 text-red-500 border border-red-500/20">
                      {result.compliance_risk} Risk
                    </span>
                  </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: DollarSign, label: 'Loss Exposure', value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(result.loss_exposure_inr) },
                    { icon: Users,       label: 'Customers', value: result.customers_affected.toLocaleString() },
                    { icon: ShieldAlert, label: 'Branches', value: String(result.branches_affected) },
                    { icon: Clock,       label: 'Recovery', value: `${result.recovery_time_hours} hrs` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="p-5 rounded-xl bg-[#13151A] border border-[#272B36]">
                      <div className="text-[9px] font-bold tracking-[0.2em] uppercase mb-3 flex items-center text-white/50">
                        <Icon className="h-3.5 w-3.5 mr-2 text-blue-500" />{label}
                      </div>
                      <div className="text-2xl font-mono font-medium text-white">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Recommended Controls */}
                <div>
                  <h3 className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-4 flex items-center">
                    <ShieldAlert className="w-3.5 h-3.5 mr-2 text-blue-500" /> Proactive Controls
                  </h3>
                  <div className="space-y-2">
                    {result.recommended_isolation.map((rec: string, i: number) => (
                      <div key={i} className="flex items-center space-x-4 p-4 bg-[#13151A] border border-[#272B36] rounded-xl">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="text-xs text-white/80 font-normal">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Blast Radius Graph */}
              {result.affected_nodes?.length > 0 && (
                <div className="bg-[#1C1F26] border border-[#272B36] rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-[#272B36] flex items-center space-x-3">
                    <Network className="h-4 w-4 text-white/50" />
                    <span className="text-[10px] font-medium text-white/70 uppercase tracking-[0.2em]">Relationship Graph</span>
                  </div>
                  <div className="h-80 bg-[#13151A]">
                    <BlastRadiusGraph affectedNodes={result.affected_nodes} assetId={result.asset_id} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[600px] bg-[#1C1F26] border border-[#272B36] rounded-2xl flex flex-col items-center justify-center shadow-sm">
              <div className="text-center">
                <GitPullRequest className="h-12 w-12 text-white/20 mx-auto mb-6" />
                <p className="text-white/40 font-medium tracking-[0.2em] uppercase text-[10px]">Awaiting Scenario Input</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
