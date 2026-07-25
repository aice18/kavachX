import neo4j, { Driver, Session } from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

export let driver: Driver | null = null;

try {
  const uri = process.env.NEO4J_URI;
  const user = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;

  if (uri && user && password) {
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    console.log('Neo4j Driver initialized.');
  } else {
    console.warn('Neo4j credentials not fully provided in .env. Falling back to mocked graph data.');
  }
} catch (error) {
  console.error('Failed to initialize Neo4j Driver:', error);
}

export const getFraudCorrelationGraph = async () => {
  // If driver exists and works, we can query it.
  if (driver) {
    let session: Session | null = null;
    try {
      session = driver.session();
      // Example Cypher query to retrieve a correlated fraud narrative graph
      const result = await session.run(`
        MATCH (n)-[r]->(m)
        RETURN n, r, m
        LIMIT 100
      `);

      if (result.records.length > 0) {
        const nodesMap = new Map();
        const links: any[] = [];

        result.records.forEach(record => {
          const n = record.get('n');
          const m = record.get('m');
          const r = record.get('r');

          if (!nodesMap.has(n.elementId)) {
            nodesMap.set(n.elementId, {
              id: n.properties.id || n.elementId,
              group: n.labels[0],
              label: n.properties.name || n.properties.account_number || n.properties.ip || n.labels[0]
            });
          }
          
          if (!nodesMap.has(m.elementId)) {
            nodesMap.set(m.elementId, {
              id: m.properties.id || m.elementId,
              group: m.labels[0],
              label: m.properties.name || m.properties.account_number || m.properties.ip || m.labels[0]
            });
          }

          links.push({
            source: n.properties.id || n.elementId,
            target: m.properties.id || m.elementId,
            label: r.type
          });
        });

        return {
          nodes: Array.from(nodesMap.values()),
          links
        };
      }
    } catch (error) {
      console.error('Neo4j query failed, falling back to mock:', error);
    } finally {
      if (session) await session.close();
    }
  }

  // Fallback realistic mock data representing the RTGS fraud scenario
  return {
    nodes: [
      { id: 'User1', group: 'User', label: 'Compromised Finance Manager' },
      { id: 'Device1', group: 'Device', label: 'Unrecognized Laptop (MacBook Pro)' },
      { id: 'IP1', group: 'IP', label: 'High-Risk IP (192.168.1.104)' },
      { id: 'Beneficiary1', group: 'BankAccount', label: 'Legitimate Supplier (ABC Corp)' },
      { id: 'Beneficiary2', group: 'BankAccount', label: 'Mule Account (XYZ Shell)' },
      { id: 'Tx1', group: 'Transaction', label: 'RTGS: £5M Transfer' },
      { id: 'Alert1', group: 'Alert', label: 'New Device Login' },
      { id: 'Alert2', group: 'Alert', label: 'Beneficiary Modification' }
    ],
    links: [
      { source: 'User1', target: 'Device1', label: 'LOGGED_IN_FROM' },
      { source: 'Device1', target: 'IP1', label: 'HAS_IP' },
      { source: 'User1', target: 'Beneficiary2', label: 'MODIFIED_BENEFICIARY' },
      { source: 'User1', target: 'Tx1', label: 'INITIATED_TRANSACTION' },
      { source: 'Tx1', target: 'Beneficiary2', label: 'TRANSFERS_TO' },
      { source: 'Alert1', target: 'Device1', label: 'FLAGS' },
      { source: 'Alert2', target: 'Beneficiary2', label: 'FLAGS' },
    ]
  };
};
