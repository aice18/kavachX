import { Request, Response } from 'express';
import { query } from '../db';

export const getExecutiveMetrics = (req: Request, res: Response) => {
// ... existing getExecutiveMetrics ...
  res.json({
    healthIndex: 27,
    valueAtRisk: 5000000,
    complianceStance: "RBI SLA AT RISK",
    eventsPerHour: "4.2M+",
    latency: "14 ms",
    falsePositivesReduction: "80%",
    accuracy: "95%",
    predictiveRiskHeatmap: [
      { category: 'Corporate Account Takeover', current: 40, predicted: 95, trend: 'up' },
      { category: 'Data Exfiltration', current: 20, predicted: 35, trend: 'up' },
      { category: 'DDoS', current: 85, predicted: 60, trend: 'down' },
      { category: 'Phishing', current: 50, predicted: 90, trend: 'up' },
      { category: 'Insider Threat', current: 15, predicted: 25, trend: 'up' }
    ],
    trendData: Array.from({ length: 24 }).map((_, i) => ({
      hour: `${i}:00`,
      score: Math.floor(10 + Math.random() * 40)
    })),
    attackVectors: [
      { name: 'Business Email Compromise', value: 45 },
      { name: 'Credential Stuffing', value: 30 },
      { name: 'Insider Threat', value: 15 },
      { name: 'DDoS', value: 10 }
    ],
    financialExposureTrend: Array.from({ length: 7 }).map((_, i) => ({
      day: `Day ${i + 1}`,
      exposure: Math.floor(500000 + Math.random() * 2000000)
    }))
  });
};

export const getSocMetrics = async (req: Request, res: Response) => {
  try {
    const { rows: activeCountRow } = await query(`SELECT COUNT(*) as count FROM incidents WHERE status = 'active'`);
    const activeIncidents = parseInt(activeCountRow[0].count);

    const { rows: latestIncidents } = await query(`
      SELECT id, title, created_at, status 
      FROM incidents 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const incidentFeed = [
      {
        id: 'INC-2048',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Corporate Account Takeover (RTGS £5M)',
        user: 'FINANCE_MGR_01',
        status: 'Active'
      },
      ...latestIncidents.map(inc => ({
        id: inc.id,
        time: new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: inc.title,
        user: 'SYSTEM',
        status: inc.status === 'active' ? 'Active' : 'Resolved'
      }))
    ];

    res.json({
      riskScore: 92, // High risk due to INC-2048
      activeIncidents: activeIncidents + 1,
      threatVolume: Array.from({ length: 24 }).map((_, i) => ({
        time: `${i}:00`,
        critical: Math.floor(Math.random() * 10),
        high: Math.floor(Math.random() * 25),
        medium: Math.floor(Math.random() * 50)
      })),
      incidentTypes: [
        { name: 'Account Takeover', count: 42 },
        { name: 'Data Exfiltration', count: 28 },
        { name: 'Malware', count: 15 },
        { name: 'Privilege Escalation', count: 12 }
      ],
      correlationEfficiency: 92,
      threatGraph: [
        { name: 'VPN', impact: 40, connections: ['FW'] },
        { name: 'FW', impact: 20, connections: ['DB', 'Core'] },
        { name: 'DB', impact: 80, connections: [] },
        { name: 'Core', impact: 90, connections: [] },
      ],
      incidentFeed,
    responseLog: [
      { id: 'RL-1030', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'RTGS Paused & VPN Killed', trigger: 'INC-2048: Highly anomalous sequence', impact: '£5M Transfer Halted. Target isolated.', status: 'Completed', type: 'network' },
      { id: 'RL-1029', time: '10:46 AM', action: 'Account Lockout', trigger: 'Anomalous geographic login attempt', impact: 'Prevented unauthorized access. User USR_1254 locked out.', status: 'Completed', type: 'identity' },
      { id: 'RL-1028', time: '10:31 AM', action: 'IP Blocked', trigger: 'Multiple failed API auths', impact: 'Blocked traffic from 45.33.x.x. API Gateway protected.', status: 'Completed', type: 'network' },
      { id: 'RL-1027', time: '09:16 AM', action: 'Session Terminated', trigger: 'Unusual data exfiltration pattern', impact: 'Terminated DB_SYNC session. Data leakage stopped.', status: 'Completed', type: 'data' },
      { id: 'RL-1026', time: '08:05 AM', action: 'MFA Enforced', trigger: 'Privilege escalation attempt', impact: 'Enforced MFA for admin group. Attack thwarted.', status: 'Completed', type: 'identity' },
      { id: 'RL-1025', time: '07:22 AM', action: 'Traffic Throttled', trigger: 'DDoS signature detected', impact: 'Throttled incoming connections. Availability maintained.', status: 'Completed', type: 'network' },
      { id: 'RL-1024', time: '06:15 AM', action: 'Quarantine Asset', trigger: 'Malware signature matched', impact: 'Isolated Workstation-42. Lateral movement prevented.', status: 'Completed', type: 'endpoint' }
    ]
    });
  } catch (error) {
    console.error('Error fetching SOC metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
