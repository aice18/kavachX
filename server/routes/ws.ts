import { Server as SocketIOServer } from 'socket.io';
import { db } from '../db/memory.js';
import { v4 as uuidv4 } from 'uuid';

const THREAT_PATTERNS = [
  { factor: 'Multiple failed admin logins followed by success from new IP', score: 25, severity: 'high', threat: 'Account Takeover' },
  { factor: 'Anomalous geographic login attempt — unexpected country', score: 15, severity: 'medium', threat: 'Credential Stuffing' },
  { factor: 'Unusual API call volume — possible scraping or enumeration', score: 20, severity: 'medium', threat: 'Data Reconnaissance' },
  { factor: 'Login outside business hours from unregistered device', score: 18, severity: 'medium', threat: 'Insider Threat' },
  { factor: 'Large UPI transaction to new beneficiary account', score: 22, severity: 'high', threat: 'Payment Fraud' },
];

export function wsHandler(io: SocketIOServer) {
  io.on('connection', (socket) => {
    console.log(`KavachX SOC client connected: ${socket.id}`);

    // Push full initial state immediately
    socket.emit('health_update', db.cyberHealthIndex);
    socket.emit('chi_trend_update', db.chiTrend);
    socket.emit('incidents_update', db.getLiveIncidents());
    socket.emit('trust_score_update', db.trustScores);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // ── Real-time Simulation Engine (4s tick) ────────────────────────────
  setInterval(() => {
    const now = new Date();
    let updatedChi = false;

    // 1. Occasionally generate a new medium/high incident
    if (Math.random() > 0.72) {
      const patternIdx = Math.floor(Math.random() * THREAT_PATTERNS.length);
      const pattern = THREAT_PATTERNS[patternIdx];
      const isHigh = pattern.severity === 'high';

      const newInc = {
        incident_id: uuidv4(),
        status: 'active',
        severity: isHigh ? 'high' : 'medium',
        risk_score: isHigh
          ? Math.floor(Math.random() * 20) + 60
          : Math.floor(Math.random() * 25) + 35,
        reasons: [{ factor: pattern.factor, score: pattern.score }],
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        events: [],
        entity_id: `USR_${Math.floor(Math.random() * 9000) + 1000}`,
        entity_type: 'user',
        business_impact: {
          loss_exposure_inr: isHigh
            ? Math.floor(Math.random() * 1500000) + 500000
            : Math.floor(Math.random() * 80000) + 10000,
          customers_affected: isHigh
            ? Math.floor(Math.random() * 80) + 20
            : Math.floor(Math.random() * 8) + 1,
          estimated_downtime_hours: isHigh ? 0.5 : 0,
          compliance_severity: isHigh ? 'High' : 'Medium',
        },
        forecast: {
          threat_type: pattern.threat,
          probability: Math.floor(Math.random() * 35) + 35,
          eta_hours: Math.floor(Math.random() * 10) + 2,
          confidence: Math.floor(Math.random() * 20) + 65,
        },
        recommended_actions: ['Prompt for MFA re-authentication', 'Temporary account lock', 'Alert branch manager'],
      };

      db.incidents.push(newInc as any);
      io.emit('incident_update', newInc);

      db.cyberHealthIndex = Math.max(0, db.cyberHealthIndex - (isHigh ? 6 : 2));
      updatedChi = true;

      // Update a random trust score to reflect new threat
      const randomEntity = db.trustScores[Math.floor(Math.random() * db.trustScores.length)];
      if (randomEntity && randomEntity.score > 20) {
        randomEntity.score = Math.max(5, randomEntity.score - Math.floor(Math.random() * 5 + 1));
        randomEntity.trend = 'down';
        io.emit('trust_score_update', db.trustScores);
      }
    }

    // 2. Natural CHI recovery or slight dip
    if (!updatedChi && db.cyberHealthIndex > 20 && db.cyberHealthIndex < 100) {
      const change = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
      db.cyberHealthIndex = Math.max(0, Math.min(100, db.cyberHealthIndex + change));
    }

    // 3. Push live CHI trend point
    db.chiTrend.push({ time: now.toISOString(), chi: db.cyberHealthIndex });
    if (db.chiTrend.length > 30) db.chiTrend.shift();

    io.emit('chi_trend_update', db.chiTrend);
    io.emit('health_update', db.cyberHealthIndex);

  }, 4000);

  // ── Slower trust score recovery tick (30s) ───────────────────────────
  setInterval(() => {
    let updated = false;
    db.trustScores.forEach(ts => {
      if (ts.trend === 'down' && ts.score < 50 && ts.entity_id !== 'ACC_MULE_1' && ts.entity_id !== '45.22.12.99') {
        ts.score = Math.min(50, ts.score + 1);
        ts.trend = ts.score > 45 ? 'up' : 'down';
        updated = true;
      }
    });
    if (updated) io.emit('trust_score_update', db.trustScores);
  }, 30000);
}
