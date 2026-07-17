import { Express, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { db } from '../db/memory.js';
import { v4 as uuidv4 } from 'uuid';
import { streamGeminiResponse } from './gemini.js';

// ── Auth Middleware ─────────────────────────────────────────────────────────
const DEMO_TOKEN = 'kavachx-soc-token-2024';

function requireAuth(req: Request, res: Response, next: Function) {
  const token = req.headers['x-kavachx-token'];
  if (token === DEMO_TOKEN) return next();
  res.status(401).json({ error: 'Unauthorized. Please authenticate via the SOC portal.' });
}

export function setupApiRoutes(app: Express, io: SocketIOServer) {

  // ── Data Endpoints ──────────────────────────────────────────────────────
  app.get('/api/events', requireAuth, (req, res) => {
    res.json(db.events.slice(-100)); // Last 100 events only
  });

  app.get('/api/incidents', requireAuth, (req, res) => {
    res.json(db.incidents);
  });

  app.get('/api/incidents/:id', requireAuth, (req, res) => {
    const inc = db.incidents.find(i => i.incident_id === req.params.id);
    if (inc) res.json(inc);
    else res.status(404).json({ error: 'Incident not found' });
  });

  app.post('/api/incidents/:id/contain', requireAuth, (req, res) => {
    const inc = db.incidents.find(i => i.incident_id === req.params.id);
    if (inc) {
      inc.status = 'contained';
      db.cyberHealthIndex = Math.min(100, db.cyberHealthIndex + 30);
      io.emit('incident_update', inc);
      io.emit('health_update', db.cyberHealthIndex);
      // Update trust score of contained entity
      const ts = db.trustScores.find(t => t.entity_id === inc.entity_id);
      if (ts) { ts.trend = 'stable'; }
      io.emit('trust_score_update', db.trustScores);
      res.json({ success: true, incident: inc });
    } else {
      res.status(404).json({ error: 'Incident not found' });
    }
  });

  // ── Graph Endpoint ──────────────────────────────────────────────────────
  app.get('/api/graph/:entity_id', requireAuth, (req, res) => {
    res.json({ nodes: db.nodes, edges: db.edges });
  });

  // ── Quantum Assets ──────────────────────────────────────────────────────
  app.get('/api/quantum/assets', requireAuth, (req, res) => {
    res.json(db.quantumAssets);
  });

  // ── Executive Dashboard ─────────────────────────────────────────────────
  app.get('/api/dashboard/executive', requireAuth, (req, res) => {
    const activeIncidents = db.getLiveIncidents();
    const totalExposure = activeIncidents.reduce(
      (sum, inc) => sum + inc.business_impact.loss_exposure_inr, 0
    );
    res.json({
      cyberHealthIndex: db.cyberHealthIndex,
      chiTrend: db.chiTrend,
      trustScores: db.trustScores,
      activeIncidents: activeIncidents.length,
      totalExposureInr: totalExposure,
      complianceStatus: activeIncidents.some(i => i.severity === 'critical') ? 'At Risk' : 'Compliant',
    });
  });

  // ── AI Copilot — REAL Gemini Integration ────────────────────────────────
  app.post('/api/copilot/ask', requireAuth, async (req, res) => {
    const { incident_id, question } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    // Fetch incident context if provided
    const incidentContext = incident_id
      ? db.incidents.find(i => i.incident_id === incident_id)
      : db.getLiveIncidents()[0]; // Default to most critical active incident

    const graphContext = { nodes: db.nodes, edges: db.edges };

    try {
      const answer = await streamGeminiResponse(question, incidentContext, graphContext);
      res.json({ answer, incident_id: incidentContext?.incident_id });
    } catch (err: any) {
      res.status(503).json({ error: err.message || 'AI engine unavailable.' });
    }
  });

  // ── Demo Simulation ─────────────────────────────────────────────────────
  app.post('/api/demo/simulate', requireAuth, (req, res) => {
    db.incidents = db.incidents.filter(i => i.status !== 'active');
    io.emit('incidents_update', db.getLiveIncidents());

    const steps = [
      { delay: 1000,  msg: '🎣 Phishing email opened by EMP_8492 — credential link clicked' },
      { delay: 3000,  msg: '🌐 VPN login from St. Petersburg, Russia (45.22.12.99) — new device' },
      { delay: 5000,  msg: '🗄️  Suspicious API call to DB_CORE_1 — unusual query pattern' },
      { delay: 7000,  msg: '📤 50,000 customer records exported — GDPR & IT Act breach risk' },
      { delay: 9000,  msg: '💸 High-value RTGS transfer ₹1,20,00,000 to mule account initiated' },
      { delay: 11000, msg: '⚡ KavachX AI Correlation Engine activating — cross-signal analysis...' },
    ];

    steps.forEach(step => {
      setTimeout(() => io.emit('demo_log', step.msg), step.delay);
    });

    setTimeout(() => {
      const now = new Date();
      const newInc = {
        incident_id: uuidv4(),
        status: 'active',
        severity: 'critical',
        risk_score: 95,
        reasons: [
          { factor: 'New device and new geography (Russia) accessed same day', score: 25 },
          { factor: 'Bulk database export (50,000 rows) by employee in off-hours', score: 25 },
          { factor: 'Abnormal RTGS transfer volume to newly-seen mule account', score: 30 },
          { factor: 'Credential link click correlates with VPN login within 8 minutes', score: 15 },
        ],
        created_at: new Date(now.getTime() - 10 * 60000).toISOString(),
        updated_at: now.toISOString(),
        events: [],
        entity_id: 'EMP_8492',
        entity_type: 'user',
        business_impact: {
          loss_exposure_inr: 12000000,
          customers_affected: 50000,
          estimated_downtime_hours: 2.5,
          compliance_severity: 'Critical',
        },
        forecast: {
          threat_type: 'Lateral Movement & Additional Exfiltration',
          probability: 98,
          eta_hours: 1.5,
          confidence: 96,
        },
        recommended_actions: [
          'Freeze employee account credentials (EMP_8492) immediately',
          'Block IP 45.22.12.99 at edge firewall and WAF',
          'Halt RTGS transfer to ACC_MULE_1 via NPCI escalation',
          'Initiate mandatory password reset for DB_CORE_1 service account',
          'Notify RBI within 6 hours per IT Act Section 43A guidelines',
        ],
      };

      db.incidents.push(newInc as any);
      io.emit('incident_update', newInc);

      const emp = db.trustScores.find(t => t.entity_id === 'EMP_8492');
      if (emp) { emp.score = 12; emp.trend = 'down'; }

      db.cyberHealthIndex = 32;
      io.emit('health_update', db.cyberHealthIndex);
      io.emit('trust_score_update', db.trustScores);
    }, 12000);

    res.json({ success: true, message: 'Simulation triggered.' });
  });

  // ── What-If Simulator — Graph-Based Blast Radius ─────────────────────────
  app.post('/api/simulator/what-if', requireAuth, (req, res) => {
    const { asset } = req.body;
    if (!asset?.trim()) return res.status(400).json({ error: 'Asset ID required.' });

    // Graph BFS traversal from the target node
    const visited = new Set<string>();
    const queue = [asset.trim()];
    const affectedNodes: any[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const node = db.nodes.find(n => n.id === current || n.id.toLowerCase().includes(current.toLowerCase()));
      if (node) affectedNodes.push(node);

      // Find all edges connected to this node
      const connectedEdges = db.edges.filter(
        e => e.source === current || e.target === current
      );
      for (const edge of connectedEdges) {
        const neighbor = edge.source === current ? edge.target : edge.source;
        if (!visited.has(neighbor)) queue.push(neighbor);
      }
    }

    // Score by depth and criticality
    const depth = visited.size;
    const hasCriticalNode = affectedNodes.some(n =>
      n.label === 'Server' || n.label === 'Account' || n.id.toLowerCase().includes('core')
    );
    const isCritical = hasCriticalNode || depth > 3;

    // Estimate INR impact based on graph connectivity + account balances
    const accountsAffected = affectedNodes.filter(n => n.label === 'Account');
    const totalBalance = accountsAffected.reduce(
      (sum, n) => sum + (n.properties?.balance || 0), 0
    );
    const lossExposure = totalBalance > 0
      ? Math.min(totalBalance * 0.85, isCritical ? 55000000 : 3500000)
      : isCritical ? 45000000 + Math.floor(Math.random() * 5000000) : 2500000;

    res.json({
      asset_id: asset,
      blast_radius_depth: depth,
      affected_node_count: affectedNodes.length,
      affected_nodes: affectedNodes.map(n => ({ id: n.id, label: n.label, isFlagged: n.isFlagged })),
      loss_exposure_inr: lossExposure,
      recovery_time_hours: isCritical ? 14 : 3,
      branches_affected: isCritical ? Math.min(depth * 2, 18) : Math.min(depth, 3),
      customers_affected: isCritical ? Math.min(depth * 3000, 15000) : Math.min(depth * 100, 500),
      compliance_risk: isCritical ? 'Critical' : depth > 2 ? 'High' : 'Medium',
      recommended_isolation: isCritical
        ? [
            `Isolate VLAN segment containing ${asset}`,
            'Trigger DR failover to secondary data centre',
            'Suspend internal routing and inter-system API calls',
            'Initiate RBI cyber incident report (within 6 hours)',
          ]
        : [
            `Quarantine endpoint: ${asset}`,
            'Rotate local service account credentials',
            'Enable enhanced monitoring on connected nodes',
          ],
    });
  });
}
