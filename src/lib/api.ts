import { db } from '../../server/db/memory.js';
import { syntheticDataGenerator } from '../../server/data/synthetic.js';
import { streamGeminiResponse } from '../../server/routes/gemini.js';

let initialized = false;
let initPromise: Promise<void> | null = null;
async function initDb() {
  if (!initialized) {
    if (!initPromise) {
      initPromise = syntheticDataGenerator().then(() => { initialized = true; });
    }
    await initPromise;
  }
}

export async function fetchExecutiveDashboard() {
  await initDb();
  const activeIncidents = db.getLiveIncidents();
  const totalExposure = activeIncidents.reduce(
    (sum, inc) => sum + inc.business_impact.loss_exposure_inr, 0
  );
  return {
    cyberHealthIndex: db.cyberHealthIndex,
    chiTrend: db.chiTrend,
    trustScores: db.trustScores,
    activeIncidents: activeIncidents.length,
    totalExposureInr: totalExposure,
    complianceStatus: activeIncidents.some(i => i.severity === 'critical') ? 'At Risk' : 'Compliant',
  };
}

export async function fetchIncidents() {
  await initDb();
  return db.incidents;
}

export async function fetchIncident(id: string) {
  await initDb();
  const inc = db.incidents.find(i => i.incident_id === id);
  if (inc) return inc;
  throw new Error('Incident not found');
}

export async function containIncident(id: string) {
  await initDb();
  const inc = db.incidents.find(i => i.incident_id === id);
  if (inc) {
    inc.status = 'contained';
    db.cyberHealthIndex = Math.min(100, db.cyberHealthIndex + 30);
    return { success: true, incident: inc };
  }
  throw new Error('Incident not found');
}

export async function fetchGraph(entityId: string) {
  await initDb();
  return { nodes: db.nodes, edges: db.edges };
}

export async function fetchQuantumAssets() {
  await initDb();
  return db.quantumAssets;
}

export async function askCopilot(incidentId: string | null, question: string) {
  try {
    const inc = incidentId ? db.incidents.find(i => i.incident_id === incidentId) : null;
    const graph = { nodes: db.nodes, edges: db.edges };
    const answer = await streamGeminiResponse(question, inc, graph);
    return { answer, incident_id: incidentId };
  } catch (err: any) {
    console.error(err);
    return { answer: "AI Copilot is in demo mode (frontend only). It cannot access the Gemini API without a backend.", incident_id: incidentId };
  }
}

export async function triggerSimulation() {
  await initDb();
  return { success: true, message: 'Simulation triggered.' };
}

export async function simulateWhatIf(asset: string) {
  await initDb();
  return {
    asset_id: asset,
    blast_radius_depth: 3,
    affected_node_count: 5,
    affected_nodes: db.nodes.slice(0, 5),
    loss_exposure_inr: 4500000,
    recovery_time_hours: 3,
    branches_affected: 2,
    customers_affected: 500,
    compliance_risk: 'Medium',
    recommended_isolation: ['Quarantine endpoint', 'Rotate credentials']
  };
}
