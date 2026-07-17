import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/memory.js';
import { Event, GraphNode, GraphEdge, QuantumAsset, Incident, ExplainabilityFactor } from '../types.js';

function addNode(id: string, label: string, properties: any, isFlagged = false) {
  if (!db.nodes.find(n => n.id === id)) {
    db.nodes.push({ id, label, properties, isFlagged });
  }
}

function addEdge(source: string, target: string, label: string, properties: any = {}) {
  db.edges.push({ id: uuidv4(), source, target, label, properties });
}

export async function syntheticDataGenerator() {
  console.log('Generating KavachX synthetic data...');
  const now = new Date();

  // ── Baseline Normal Activity (50 customers) ───────────────────────────
  for (let i = 0; i < 50; i++) {
    const userId = `U_NORM_${i}`;
    const accountId = `ACC_NORM_${i}`;
    const ip = `192.168.1.${i}`;
    addNode(userId, 'Customer', { name: `Customer ${i}`, kyc: 'verified' });
    addNode(accountId, 'Account', { balance: 50000 + Math.floor(Math.random() * 200000) });
    addNode(ip, 'Device', { ip, type: 'mobile' });
    addEdge(userId, accountId, 'OWNS');
    addEdge(userId, ip, 'USES');

    db.events.push({
      event_id: uuidv4(),
      timestamp: new Date(now.getTime() - Math.random() * 86400000).toISOString(),
      source: Math.random() > 0.5 ? 'upi' : 'api',
      actor: { user_id: userId, role: 'customer' },
      device_id: ip,
      ip,
      geo: { city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'][i % 5], country: 'India' },
      action: 'transfer',
      target: { account_id: `ACC_NORM_${(i + 1) % 50}`, resource: null },
      amount: Math.floor(Math.random() * 5000),
      metadata: { status: 'success', channel: 'app' },
    });
  }

  // ── Attack Scenario Nodes ─────────────────────────────────────────────
  const attackerIP = '45.22.12.99';
  const compromisedEmployee = 'EMP_8492';
  const compromisedAccount = 'ACC_8492';
  const dbServer = 'DB_CORE_1';
  const muleAccount = 'ACC_MULE_1';
  const swiftGateway = 'SWIFT_GATEWAY_NODE';
  const vpnGateway = 'VPN_GW_01';

  addNode(attackerIP, 'Device', { ip: attackerIP, geo: 'St. Petersburg, RU', type: 'unknown' }, true);
  addNode(compromisedEmployee, 'Employee', { name: 'Anil K.', dept: 'Operations', clearance: 'L3' }, true);
  addNode(compromisedAccount, 'Account', { balance: 12500000, type: 'corporate' }, true);
  addNode(dbServer, 'Server', { host: 'db-core.internal', role: 'primary_db' });
  addNode(muleAccount, 'Account', { balance: 0, flagged: true, type: 'external' }, true);
  addNode(swiftGateway, 'Server', { host: 'swift-gw.internal', role: 'payment_gateway' });
  addNode(vpnGateway, 'Server', { host: 'vpn-gw.internal', role: 'remote_access' });

  addEdge(compromisedEmployee, compromisedAccount, 'OWNS');
  addEdge(attackerIP, compromisedEmployee, 'LOGS_IN_AS');
  addEdge(attackerIP, vpnGateway, 'TUNNELS_THROUGH');
  addEdge(compromisedEmployee, dbServer, 'QUERIES');
  addEdge(compromisedEmployee, swiftGateway, 'ACCESSES');
  addEdge(compromisedAccount, muleAccount, 'TRANSFERS', { amount: 12000000, protocol: 'rtgs' });
  addEdge(dbServer, swiftGateway, 'FEEDS_INTO');

  // Attack event chain
  const t1 = new Date(now.getTime() - 40 * 60000);
  const t2 = new Date(now.getTime() - 35 * 60000);
  const t3 = new Date(now.getTime() - 5 * 60000);

  const ev1: Event = {
    event_id: uuidv4(), timestamp: t1.toISOString(), source: 'vpn',
    actor: { user_id: compromisedEmployee, role: 'employee' },
    device_id: 'DEV_UNK_1', ip: attackerIP, geo: { city: 'St. Petersburg', country: 'Russia' },
    action: 'login', target: { account_id: null, resource: 'corp-vpn' },
    amount: null, metadata: { result: 'success', flag: 'new_device', new_geo: true },
  };

  const ev2: Event = {
    event_id: uuidv4(), timestamp: t2.toISOString(), source: 'database',
    actor: { user_id: compromisedEmployee, role: 'employee' },
    device_id: 'DEV_UNK_1', ip: attackerIP, geo: { city: 'St. Petersburg', country: 'Russia' },
    action: 'query', target: { account_id: null, resource: dbServer },
    amount: null, metadata: { table: 'customers', rows: 50000, query_type: 'SELECT *' },
  };

  const ev3: Event = {
    event_id: uuidv4(), timestamp: t3.toISOString(), source: 'api',
    actor: { user_id: compromisedEmployee, role: 'employee' },
    device_id: 'DEV_UNK_1', ip: attackerIP, geo: { city: 'St. Petersburg', country: 'Russia' },
    action: 'transfer', target: { account_id: muleAccount, resource: null },
    amount: 12000000, metadata: { protocol: 'rtgs', beneficiary: 'ACC_MULE_1', approved_by: 'self' },
  };

  db.events.push(ev1, ev2, ev3);

  // Correlated Incident
  const factors: ExplainabilityFactor[] = [
    { factor: 'New device and new geography (Russia) accessed same day', score: 25 },
    { factor: 'Bulk database export (50,000 rows) by employee in off-hours', score: 25 },
    { factor: 'Abnormal RTGS transfer volume to newly-seen mule account', score: 30 },
    { factor: 'Credential phishing link click correlates with VPN login (8 min)', score: 15 },
    { factor: 'Off-hours privileged access to core banking DB', score: 5 },
  ];

  const incident: Incident = {
    incident_id: uuidv4(),
    status: 'active',
    severity: 'critical',
    risk_score: 85,
    reasons: factors,
    created_at: t1.toISOString(),
    updated_at: t3.toISOString(),
    events: [ev1, ev2, ev3],
    entity_id: compromisedEmployee,
    entity_type: 'user',
    business_impact: {
      loss_exposure_inr: 12000000,
      customers_affected: 50000,
      estimated_downtime_hours: 2.5,
      compliance_severity: 'Critical',
    },
    forecast: {
      threat_type: 'Lateral Movement & Additional Exfiltration',
      probability: 88,
      eta_hours: 1.5,
      confidence: 92,
    },
    recommended_actions: [
      'Freeze employee account credentials (EMP_8492) immediately',
      'Block IP 45.22.12.99 at edge firewall and WAF',
      'Halt RTGS transfer to ACC_MULE_1 via NPCI escalation',
      'Initiate mandatory password reset for DB_CORE_1 service account',
      'Notify RBI within 6 hours per IT Act Section 43A guidelines',
    ],
  };

  db.incidents.push(incident);
  db.cyberHealthIndex = 42;

  // ── Quantum Assets — 12 Real Banking Crypto Systems ──────────────────
  db.quantumAssets = [
    {
      system_id: 'SYS_CORE_BANK',
      name: 'Core Banking Ledger (Finacle)',
      algorithm: 'RSA-2048',
      vulnerable: true,
      recommendation: 'Migrate to ML-KEM-768 (Kyber) — NIST FIPS 203',
    },
    {
      system_id: 'SYS_SWIFT_GW',
      name: 'SWIFT/ISO 20022 Gateway',
      algorithm: 'RSA-2048',
      vulnerable: true,
      recommendation: 'Upgrade to ML-DSA-65 (Dilithium) — NIST FIPS 204',
    },
    {
      system_id: 'SYS_UPI_RAILS',
      name: 'UPI Payment Rails (NPCI)',
      algorithm: 'ECC',
      vulnerable: true,
      recommendation: 'Transition to SLH-DSA (SPHINCS+) for signing — NIST FIPS 205',
    },
    {
      system_id: 'SYS_ATM_HSM',
      name: 'ATM PIN Pad HSM (NCR)',
      algorithm: 'RSA-2048',
      vulnerable: true,
      recommendation: 'Hardware upgrade to PQC-capable HSM — CryptoServer Se-Series',
    },
    {
      system_id: 'SYS_NEFT',
      name: 'NEFT Settlement Engine',
      algorithm: 'RSA-2048',
      vulnerable: true,
      recommendation: 'Coordinate with RBI for PQC migration roadmap by Q2 2025',
    },
    {
      system_id: 'SYS_RTGS',
      name: 'RTGS Clearing System',
      algorithm: 'ECC',
      vulnerable: true,
      recommendation: 'Hybrid classical + PQC (ML-KEM + X25519) during transition',
    },
    {
      system_id: 'SYS_OAUTH',
      name: 'Internal OAuth 2.0 Token Signing',
      algorithm: 'AES-256',
      vulnerable: false,
      recommendation: 'Secure (Symmetric). Monitor NIST guidance annually.',
    },
    {
      system_id: 'SYS_MTLS',
      name: 'mTLS API Certificates (Kong GW)',
      algorithm: 'ECC',
      vulnerable: true,
      recommendation: 'Issue ML-DSA certificates alongside ECC (hybrid mode)',
    },
    {
      system_id: 'SYS_DB_ENC',
      name: 'Database Encryption at Rest (TDE)',
      algorithm: 'AES-256',
      vulnerable: false,
      recommendation: 'Secure (Symmetric AES-256). No quantum risk.',
    },
    {
      system_id: 'SYS_CARD_ENC',
      name: 'Card Data Encryption (PCI DSS)',
      algorithm: 'RSA-2048',
      vulnerable: true,
      recommendation: 'Migrate card encryption keys to ML-KEM — high priority (PCI DSS v4)',
    },
    {
      system_id: 'SYS_AUDIT_LOG',
      name: 'Audit Log Signing (Immutable)',
      algorithm: 'AES-256',
      vulnerable: false,
      recommendation: 'Consider ML-DSA for log integrity signatures for future-proofing',
    },
    {
      system_id: 'SYS_MOBILE_TLS',
      name: 'Mobile Banking TLS 1.3 Layer',
      algorithm: 'ECC',
      vulnerable: true,
      recommendation: 'Deploy post-quantum TLS via Kyber Key Encapsulation in 2025',
    },
  ] as any[];

  // ── CHI Trend (last 15 hours, drops at incident) ──────────────────────
  db.chiTrend = Array.from({ length: 30 }).map((_, i) => ({
    time: new Date(now.getTime() - (29 - i) * 1800000).toISOString(),
    chi: i < 26
      ? 94 + Math.floor(Math.random() * 5) - 2
      : 42 + Math.floor(Math.random() * 5),
  }));

  // ── Trust Scores — 12 entities ────────────────────────────────────────
  db.trustScores = [
    { entity_id: compromisedEmployee, type: 'Employee',    score: 32,  trend: 'down'   },
    { entity_id: attackerIP,          type: 'Device/IP',  score: 8,   trend: 'down'   },
    { entity_id: 'API_GW_EXT',        type: 'Server',     score: 54,  trend: 'down'   },
    { entity_id: 'EMP_1102',          type: 'Employee',   score: 98,  trend: 'stable' },
    { entity_id: 'DEV_MOBILE_99',     type: 'Device',     score: 88,  trend: 'up'     },
    { entity_id: 'EMP_4431',          type: 'Employee',   score: 91,  trend: 'stable' },
    { entity_id: 'EMP_2019',          type: 'Employee',   score: 76,  trend: 'up'     },
    { entity_id: 'SYS_SWIFT_GW',      type: 'Server',     score: 61,  trend: 'down'   },
    { entity_id: 'BRANCH_07_ATM',     type: 'Device',     score: 44,  trend: 'down'   },
    { entity_id: 'EMP_9901',          type: 'Employee',   score: 95,  trend: 'stable' },
    { entity_id: 'ACC_MULE_1',        type: 'Account',    score: 3,   trend: 'down'   },
    { entity_id: 'USR_API_BATCH',     type: 'System',     score: 72,  trend: 'stable' },
  ];

  console.log('KavachX data engine ready.');
}
