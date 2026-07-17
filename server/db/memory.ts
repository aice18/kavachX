import { Event, Incident, GraphNode, GraphEdge, QuantumAsset } from '../types.js';

export const db = {
  events: [] as Event[],
  incidents: [] as Incident[],
  nodes: [] as GraphNode[],
  edges: [] as GraphEdge[],
  quantumAssets: [] as QuantumAsset[],
  cyberHealthIndex: 85,
  chiTrend: [] as any[],
  trustScores: [] as any[],
  getLiveIncidents: () => db.incidents.filter(i => i.status === 'active').sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
};

