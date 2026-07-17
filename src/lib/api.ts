import { getAuthHeaders } from './auth';

const API_BASE = '/api';

async function authedFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeaders(),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (res.status === 401) {
    // Force re-login if token expired
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }
  return res.json();
}

export async function fetchExecutiveDashboard() {
  return authedFetch(`${API_BASE}/dashboard/executive`);
}

export async function fetchIncidents() {
  return authedFetch(`${API_BASE}/incidents`);
}

export async function fetchIncident(id: string) {
  return authedFetch(`${API_BASE}/incidents/${id}`);
}

export async function containIncident(id: string) {
  return authedFetch(`${API_BASE}/incidents/${id}/contain`, { method: 'POST' });
}

export async function fetchGraph(entityId: string) {
  return authedFetch(`${API_BASE}/graph/${entityId}`);
}

export async function fetchQuantumAssets() {
  return authedFetch(`${API_BASE}/quantum/assets`);
}

export async function askCopilot(incidentId: string | null, question: string) {
  return authedFetch(`${API_BASE}/copilot/ask`, {
    method: 'POST',
    body: JSON.stringify({ incident_id: incidentId, question }),
  });
}

export async function triggerSimulation() {
  return authedFetch(`${API_BASE}/demo/simulate`, { method: 'POST' });
}

export async function simulateWhatIf(asset: string) {
  return authedFetch(`${API_BASE}/simulator/what-if`, {
    method: 'POST',
    body: JSON.stringify({ asset }),
  });
}
