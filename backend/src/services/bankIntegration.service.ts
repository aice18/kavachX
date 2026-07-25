import { query } from '../db/index.js';
import { driver } from './neo4j.service.js';
import { decryptPII } from './security.service.js';

export interface BankPayload {
    eventId: string;
    timestamp: string;
    eventType: 'LOGIN' | 'TRANSACTION';
    userId: string;
    deviceInfo?: {
        deviceId: string;
        ip: string;
        trusted: boolean;
    };
    transactionInfo?: {
        senderAccountId: string;
        receiverAccountId: string;
        amount: number;
        // PII is encrypted (e.g. receiver name, notes)
        encryptedReceiverInfo?: string;
    };
    riskScore: number;
    aiInsights?: {
        threatType: string;
        explainability: string;
        isQuantumThreat: boolean;
    };
}

/**
 * Normalizes the secure bank payload and ingests it into both Postgres (Relational) and Neo4j (Graph)
 */
export const ingestBankEvent = async (event: BankPayload) => {
    console.log(`[Bank Integration] Ingesting event: ${event.eventId} (Type: ${event.eventType})`);

    const isHighRisk = event.riskScore > 85;

    try {
        // 1. Relational Ingestion (Supabase/Postgres)
        if (event.deviceInfo) {
            await query(
                `INSERT INTO devices (id, user_id, ip_address, is_trusted) 
                 VALUES ($1, $2, $3, $4) 
                 ON CONFLICT DO NOTHING`,
                [event.deviceInfo.deviceId, event.userId, event.deviceInfo.ip, event.deviceInfo.trusted]
            );
        }

        if (event.eventType === 'TRANSACTION' && event.transactionInfo) {
            // Decrypt PII if provided
            const receiverName = event.transactionInfo.encryptedReceiverInfo 
                ? decryptPII(event.transactionInfo.encryptedReceiverInfo) 
                : 'Unknown';

            await query(
                `INSERT INTO transactions (id, sender_account_id, receiver_account_id, amount, is_fraudulent) 
                 VALUES ($1, $2, $3, $4, $5) 
                 ON CONFLICT DO NOTHING`,
                [
                    event.eventId, 
                    event.transactionInfo.senderAccountId, 
                    event.transactionInfo.receiverAccountId, 
                    event.transactionInfo.amount, 
                    isHighRisk
                ]
            );
            console.log(`[Bank Integration] Decrypted Receiver Name for TX ${event.eventId}: ${receiverName}`);
        }

        // 2. Graph Ingestion (Neo4j)
        if (driver) {
            const session = driver.session();
            try {
                // Build the Cypher query dynamically based on the event type
                let cypher = `MERGE (u:User {id: $userId}) `;
                
                if (event.deviceInfo) {
                    cypher += `
                        MERGE (d:Device {id: $deviceId}) SET d.is_trusted = $isTrusted
                        MERGE (i:IP_Address {ip: $ip})
                        MERGE (u)-[:LOGGED_IN_FROM {timestamp: $timestamp}]->(d)
                        MERGE (d)-[:HAS_IP]->(i)
                    `;
                }

                if (event.eventType === 'TRANSACTION' && event.transactionInfo) {
                    cypher += `
                        MERGE (sender:BankAccount {id: $senderAccountId})
                        MERGE (receiver:BankAccount {id: $receiverAccountId})
                        MERGE (u)-[:OWNS_ACCOUNT]->(sender)
                        CREATE (t:Transaction {
                            id: $eventId, 
                            amount: $amount, 
                            is_fraud: $isFraud, 
                            risk_score: $riskScore,
                            threat_type: $threatType,
                            explainability: $explainability,
                            is_quantum_threat: $isQuantumThreat
                        })
                        MERGE (u)-[:INITIATED_TRANSACTION]->(t)
                        MERGE (t)-[:TRANSFERS_TO]->(receiver)
                    `;
                }

                await session.run(cypher, {
                    userId: event.userId,
                    eventId: event.eventId,
                    timestamp: event.timestamp,
                    riskScore: event.riskScore,
                    isFraud: isHighRisk,
                    ...(event.deviceInfo && {
                        deviceId: event.deviceInfo.deviceId,
                        ip: event.deviceInfo.ip,
                        isTrusted: event.deviceInfo.trusted
                    }),
                    ...(event.transactionInfo && {
                        senderAccountId: event.transactionInfo.senderAccountId,
                        receiverAccountId: event.transactionInfo.receiverAccountId,
                        amount: event.transactionInfo.amount
                    }),
                    threatType: event.aiInsights?.threatType || 'Unknown',
                    explainability: event.aiInsights?.explainability || 'None',
                    isQuantumThreat: event.aiInsights?.isQuantumThreat || false
                });

            } finally {
                await session.close();
            }
        }

        console.log(`[Bank Integration] Successfully correlated event ${event.eventId} across SQL and Graph databases.`);
    } catch (e: any) {
        console.error(`[Bank Integration] Critical failure during ingestion: ${e.message}`);
        throw e;
    }
};
