import { useMemo } from 'react';
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export function AttackGraph({ nodes: rawNodes, edges: rawEdges, incidentEvents }: { nodes: any[], edges: any[], incidentEvents: any[] }) {
  
  // Convert custom graph shape to ReactFlow shape
  const initialNodes = useMemo(() => {
    // For demo layout, we just arrange them in a circle or line.
    // In production, we'd use dagre or elk.js
    return rawNodes.map((n: any, i: number) => {
      return {
        id: n.id,
        position: { x: 300 + Math.cos(i * 1.5) * 180, y: 150 + Math.sin(i * 1.5) * 120 }, // Simple scatter
        data: { label: `${n.label}\n${n.id.substring(0,8)}` },
        style: {
          background: n.isFlagged ? '#450a0a' : '#0f172a',
          color: n.isFlagged ? '#fca5a5' : '#cbd5e1',
          border: `1px solid ${n.isFlagged ? '#ef4444' : '#334155'}`,
          borderRadius: '6px',
          padding: '12px',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 500,
          width: 140,
          textAlign: 'center',
          boxShadow: n.isFlagged ? '0 0 15px -3px rgba(239, 68, 68, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
        }
      };
    });
  }, [rawNodes]);

  const initialEdges = useMemo(() => {
    return rawEdges.map((e: any) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: true,
      style: { stroke: '#4f46e5', strokeWidth: 2 },
      labelStyle: { fill: '#94a3b8', fontSize: 10, fontFamily: 'Inter', fontWeight: 600 },
      labelBgStyle: { fill: '#0f172a', stroke: '#1e293b' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#4f46e5' }
    }));
  }, [rawEdges]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      colorMode="dark"
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#1e293b" gap={20} size={1} />
      <Controls showInteractive={false} className="border-slate-700 fill-slate-300" />
    </ReactFlow>
  );
}
