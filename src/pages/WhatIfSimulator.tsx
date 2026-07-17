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
      background: n.id === assetId ? '#450a0a' : n.isFlagged ? '#311B4E' : '#0f172a',
      color: n.id === assetId ? '#fca5a5' : n.isFlagged ? '#c084fc' : '#cbd5e1',
      border: `2px solid ${n.id === assetId ? '#ef4444' : n.isFlagged ? '#a855f7' : '#334155'}`,
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontFamily: 'monospace',
      width: 130,
      textAlign: 'center' as const,
      boxShadow: n.id === assetId
        ? '0 0 20px rgba(239,68,68,0.5)'
        : n.isFlagged
        ? '0 0 12px rgba(168,85,247,0.3)'
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
      style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
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
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center">
          What-If Simulator
          <span className="ml-4 text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded uppercase tracking-widest shadow-[0_0_8px_rgba(34,211,238,0.3)]">Graph-Based</span>
        </h1>
        <p className="text-cyan-500/70 mt-2 text-sm uppercase tracking-widest font-semibold flex items-center">
          <GitPullRequest className="h-4 w-4 mr-2" /> BFS graph traversal · Predictive blast radius and financial exposure analysis
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Panel — Controls */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl p-6 shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none" />
            <h2 className="text-sm font-bold text-slate-200 mb-5 uppercase tracking-widest flex items-center relative z-10">
              <GitPullRequest className="h-4 w-4 mr-2 text-cyan-400" /> Scenario Parameters
            </h2>
            <form onSubmit={handleSimulate} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Target Asset / Node ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={asset}
                    onChange={e => setAsset(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-indigo-500/30 rounded-xl bg-[#020617]/50 text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm shadow-inner font-mono font-bold placeholder:text-slate-600 placeholder:font-normal"
                    placeholder="e.g. DB_CORE_1, EMP_8492"
                  />
                </div>
                <p className="text-[10px] text-cyan-500/50 mt-2 font-medium">Graph BFS traversal calculates true blast radius from entity relationships.</p>
              </div>
              <button
                type="submit"
                disabled={loading || !asset}
                className="w-full flex items-center justify-center py-3 px-4 border border-indigo-500/50 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] text-sm font-bold tracking-widest uppercase text-white bg-indigo-600/80 hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Traversing Graph...</> : <><AlertTriangle className="h-5 w-5 mr-2" /> Run Scenario</>}
              </button>
            </form>
          </div>

          {/* Presets */}
          <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl p-5 shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
            <h2 className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest relative z-10">Preset Scenarios</h2>
            <div className="space-y-2 relative z-10">
              {PRESET_SCENARIOS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setAsset(p.id)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-transparent hover:border-cyan-500/30 hover:bg-indigo-500/10 transition-all group"
                >
                  <div className="font-mono text-sm text-cyan-300 font-bold group-hover:text-cyan-200">{p.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel — Results */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-[600px] bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl flex flex-col items-center justify-center shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-cyan-500/5 blur-[80px] pointer-events-none" />
              <div className="relative z-10 text-center">
                <div className="h-20 w-20 border-4 border-indigo-500/20 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.3)] mx-auto" />
                <p className="text-cyan-300 mt-6 font-mono text-sm tracking-widest uppercase font-bold">Traversing relationship graph...</p>
                <p className="text-slate-500 text-xs mt-2 uppercase tracking-wider font-semibold">BFS calculating blast radius and financial exposure</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-500">
              {/* Header */}
              <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl p-6 shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <h2 className="text-lg font-bold text-white tracking-wide uppercase">
                    Blast Radius: <span className="text-red-400 font-mono drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{result.asset_id}</span>
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] text-slate-500 font-mono font-bold">Graph depth: {result.blast_radius_depth} hops · {result.affected_node_count} nodes</span>
                    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border shadow-lg ${result.compliance_risk === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                      {result.compliance_risk} Risk
                    </span>
                  </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 relative z-10">
                  {[
                    { icon: DollarSign, label: 'Loss Exposure', value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(result.loss_exposure_inr), color: 'red' },
                    { icon: Users,       label: 'Customers Affected', value: result.customers_affected.toLocaleString(), color: 'indigo' },
                    { icon: ShieldAlert, label: 'Branches Disrupted', value: String(result.branches_affected), color: 'indigo' },
                    { icon: Clock,       label: 'Recovery Time', value: `${result.recovery_time_hours} hrs`, color: 'indigo' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className={`p-4 rounded-xl border relative overflow-hidden ${color === 'red' ? 'bg-red-500/10 border-red-500/30' : 'bg-indigo-500/10 border-indigo-500/30'}`}>
                      <div className={`text-[10px] font-bold tracking-widest uppercase mb-2 flex items-center ${color === 'red' ? 'text-red-400' : 'text-indigo-300'}`}>
                        <Icon className="h-3 w-3 mr-1" />{label}
                      </div>
                      <div className={`text-2xl font-mono font-bold ${color === 'red' ? 'text-white' : 'text-cyan-400'}`}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Recommended Controls */}
                <div className="relative z-10">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center">
                    <ShieldAlert className="w-4 h-4 mr-2 text-cyan-400" /> Recommended Proactive Controls
                  </h3>
                  <div className="space-y-2">
                    {result.recommended_isolation.map((rec: string, i: number) => (
                      <div key={i} className="flex items-center space-x-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] shrink-0" />
                        <span className="text-sm text-indigo-100 font-medium">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Blast Radius Graph */}
              {result.affected_nodes?.length > 0 && (
                <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl overflow-hidden shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)]">
                  <div className="p-4 border-b border-indigo-500/20 flex items-center space-x-2 bg-[#0f172a]/50">
                    <Network className="h-4 w-4 text-red-400" />
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">Blast Radius Relationship Graph</span>
                    <span className="ml-auto text-[10px] text-slate-500 font-mono">{result.affected_node_count} nodes reachable</span>
                  </div>
                  <div className="h-72 bg-[#0b0f19]">
                    <BlastRadiusGraph affectedNodes={result.affected_nodes} assetId={result.asset_id} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[600px] bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl flex flex-col items-center justify-center shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#020617]/0 to-transparent pointer-events-none" />
              <div className="relative z-10 text-center">
                <GitPullRequest className="h-14 w-14 text-indigo-500/30 mx-auto mb-6" />
                <p className="text-slate-300 font-bold tracking-widest uppercase text-sm">Ready for Scenario Injection</p>
                <p className="text-cyan-500/50 font-semibold tracking-wider text-xs mt-2 uppercase">Select an asset to model graph-based impact</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
