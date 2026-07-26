import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const uri = process.env.NEO4J_URI || 'neo4j+s://bedbd88e.databases.neo4j.io';
const user = process.env.NEO4J_USERNAME || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'Hwngb909AcNdp1h1_xlYZT9Z0kfmWa-XE9iM93GiUkU';

console.log('Connecting to Neo4j:', uri);

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function seed() {
  const session = driver.session();
  try {
    console.log('Clearing old graph data...');
    await session.run('MATCH (n) DETACH DELETE n');

    console.log('Inserting amazing AiTM + RTGS Fraud graph...');
    
    // Create the nodes
    await session.run(`
      CREATE (u:User {id: 'U1', name: 'Finance Manager (Victim)', risk: 95})
      CREATE (d1:Device {id: 'D1', name: 'Corporate MacBook', trusted: true})
      CREATE (d2:Device {id: 'D2', name: 'Unknown Linux Device', trusted: false})
      CREATE (ip1:IP {id: 'IP1', ip: '10.0.0.45', location: 'London, UK'})
      CREATE (ip2:IP {id: 'IP2', ip: '185.15.22.1', location: 'Tor Exit Node'})
      CREATE (sess:Session {id: 'S1', name: 'Hijacked Web Session', valid: true})
      
      CREATE (ba1:BankAccount {id: 'BA1', account_number: 'CORP-8821', name: 'Corporate Master Acct'})
      CREATE (ba2:BankAccount {id: 'BA2', account_number: 'VEN-9912', name: 'Legitimate Vendor'})
      CREATE (ba3:BankAccount {id: 'BA3', account_number: 'MULE-001', name: 'Mule Account A'})
      CREATE (ba4:BankAccount {id: 'BA4', account_number: 'MULE-002', name: 'Mule Account B'})
      CREATE (ba5:BankAccount {id: 'BA5', account_number: 'MULE-003', name: 'Mule Account C'})
      
      CREATE (tx1:Transaction {id: 'TX1', amount: '£5,000,000', type: 'RTGS', status: 'PAUSED', risk: 99})
      CREATE (tx2:Transaction {id: 'TX2', amount: '£2,000,000', type: 'SPLIT', status: 'PENDING', risk: 80})
      CREATE (tx3:Transaction {id: 'TX3', amount: '£1,500,000', type: 'SPLIT', status: 'PENDING', risk: 80})
      CREATE (tx4:Transaction {id: 'TX4', amount: '£1,500,000', type: 'SPLIT', status: 'PENDING', risk: 80})
      
      CREATE (a1:Alert {id: 'A1', name: 'AiTM Phishing Detected', source: 'Email Gateway'})
      CREATE (a2:Alert {id: 'A2', name: 'MFA Bypass Attempt', source: 'IAM'})
      CREATE (a3:Alert {id: 'A3', name: 'Impossible Travel', source: 'WAF'})
      CREATE (a4:Alert {id: 'A4', name: 'High-Value RTGS Anomaly', source: 'Core Banking'})
      
      // Relationships (The Attack Path)
      CREATE (u)-[:OWNS]->(d1)
      CREATE (d1)-[:AUTHENTICATED_FROM]->(ip1)
      
      // The attack
      CREATE (d2)-[:SPOOFS]->(sess)
      CREATE (sess)-[:HIJACKS]->(u)
      CREATE (d2)-[:CONNECTS_FROM]->(ip2)
      
      // Alerts
      CREATE (a1)-[:FLAGS]->(sess)
      CREATE (a2)-[:FLAGS]->(sess)
      CREATE (a3)-[:FLAGS]->(ip2)
      
      // The Financial Fraud
      CREATE (u)-[:INITIATES]->(tx1)
      CREATE (tx1)-[:DEBITS]->(ba1)
      CREATE (tx1)-[:SPLITS_INTO]->(tx2)
      CREATE (tx1)-[:SPLITS_INTO]->(tx3)
      CREATE (tx1)-[:SPLITS_INTO]->(tx4)
      
      CREATE (tx2)-[:CREDITS]->(ba3)
      CREATE (tx3)-[:CREDITS]->(ba4)
      CREATE (tx4)-[:CREDITS]->(ba5)
      
      CREATE (a4)-[:FLAGS]->(tx1)
    `);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Failed to seed DB:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
