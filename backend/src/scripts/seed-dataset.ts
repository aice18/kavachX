import { query } from '../db/index.ts';

const titles = [
  'Anomalous geographic login attempt',
  'Multiple failed API auths',
  'Unusual data exfiltration pattern',
  'Privilege escalation attempt',
  'DDoS signature detected',
  'Malware signature matched',
  'Suspicious DB query',
  'Unauthorized configuration change'
];

const severities = ['critical', 'high', 'medium', 'low'];
const statuses = ['active', 'investigating', 'resolved', 'false_positive'];

function getRandomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedIncidents() {
  try {
    console.log('Fetching tenant and user...');
    const { rows: tenants } = await query(`SELECT id FROM tenants WHERE name = 'KavachX Bank'`);
    if (tenants.length === 0) throw new Error('Tenant not found. Run init-db first.');
    const tenantId = tenants[0].id;

    const { rows: users } = await query(`SELECT id FROM users WHERE email = 'admin@kavachx.bank'`);
    const userId = users.length > 0 ? users[0].id : null;

    console.log('Seeding 5000 incidents...');
    // We insert in batches of 500 to avoid query size limits
    const BATCH_SIZE = 500;
    const TOTAL_ROWS = 5000;
    
    for (let b = 0; b < TOTAL_ROWS / BATCH_SIZE; b++) {
      const values = [];
      const placeholders = [];
      
      for (let i = 0; i < BATCH_SIZE; i++) {
        const title = getRandomItem(titles);
        const severity = getRandomItem(severities);
        // Make most of them resolved or false_positive since they are historical
        const status = Math.random() > 0.8 ? 'active' : (Math.random() > 0.5 ? 'resolved' : 'false_positive');
        
        // Random date in the last 30 days
        const daysAgo = Math.random() * 30;
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);
        
        let resolvedAt = null;
        if (status === 'resolved' || status === 'false_positive') {
           resolvedAt = new Date(createdAt.getTime() + (Math.random() * 86400000)); // resolved within 24h
        }
        
        const aiScore = Math.random(); // 0 to 1
        
        const offset = i * 7;
        placeholders.push(`($${offset+1}, $${offset+2}, $${offset+3}, $${offset+4}, $${offset+5}, $${offset+6}, $${offset+7})`);
        values.push(tenantId, title, severity, status, userId, createdAt, resolvedAt);
      }
      
      const sql = `
        INSERT INTO incidents (tenant_id, title, severity, status, assigned_to, created_at, resolved_at)
        VALUES ${placeholders.join(', ')}
      `;
      
      await query(sql, values);
      console.log(`Inserted batch ${b + 1} of ${TOTAL_ROWS / BATCH_SIZE}`);
    }
    
    console.log('Successfully seeded 5000 incidents.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedIncidents();
