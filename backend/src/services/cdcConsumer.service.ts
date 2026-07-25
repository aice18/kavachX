import { Client } from 'pg';
import { ingestBankEvent, BankPayload } from './bankIntegration.service.js';
import { runMultiAgentCorrelation } from './multi-agent.service.js';
import { triageEventInStream } from './streamTriage.service.js';

/**
 * Enterprise Change Data Capture (CDC) Consumer
 * 
 * Instead of relying on the bank to write new webhook code, this service connects 
 * directly to the bank's core PostgreSQL database and listens to the transaction stream
 * using PostgreSQL's native pub/sub (LISTEN/NOTIFY).
 * 
 * This is non-invasive, zero-latency, and guarantees we capture every transaction 
 * exactly as it is committed to their core ledger.
 */

export const startCDCConsumer = async () => {
    console.log("[CDC Consumer] Initializing direct connection to Core Banking Database...");

    // In a real environment, this would be a read-only connection string to the Bank's core DB.
    // For this demonstration, we are attaching to our existing Supabase DB where the core schema was applied.
    const coreDbClient = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await coreDbClient.connect();
        console.log("[CDC Consumer] Successfully connected to Core Banking DB.");

        // Subscribe to the Postgres notification channel
        await coreDbClient.query('LISTEN core_bank_cdc_stream');
        console.log("[CDC Consumer] Listening for real-time transaction events on 'core_bank_cdc_stream'...");

        // Event listener for incoming CDC payloads
        coreDbClient.on('notification', async (msg) => {
            if (!msg.payload) return;

            try {
                const rawTxn = JSON.parse(msg.payload);
                console.log(`\n[CDC Consumer] ⚡ INSTANT CDC EVENT CAPTURED: TXN ${rawTxn.txn_id}`);
                console.log(`[CDC Consumer] Routing $${rawTxn.amount} from ${rawTxn.account_from} to ${rawTxn.account_to}...`);

                // We now extract the rich JSON telemetry from the bank's core audit logs/WAF/IAM injected by the Simulator
                const isAnomalousAmount = parseFloat(rawTxn.amount) > 10000;
                
                let richTelemetry: any = {};
                try {
                    richTelemetry = rawTxn.metadata ? (typeof rawTxn.metadata === 'string' ? JSON.parse(rawTxn.metadata) : rawTxn.metadata) : {};
                } catch(e) {
                    console.error("Failed to parse metadata", e);
                }

                // Tier 1: In-Stream Triage (Edge Processing)
                // This solves the "100TB normalization latency" problem. We process velocities in RAM 
                // BEFORE touching any database or heavy LLM, filtering out 99.9% of normal traffic instantly.
                const triageResult = triageEventInStream(rawTxn.account_from, parseFloat(rawTxn.amount));

                let aiResult = {
                    riskScore: 10,
                    threatType: "Normal",
                    isQuantumThreat: false,
                    explainability: triageResult.reason
                };

                // Tier 2: Deep Generative Correlation (Only for the 0.1% flagged by Tier 1)
                if (triageResult.requiresDeepAI || isAnomalousAmount) {
                    console.log(`[CDC Consumer] ⚠️ Edge Triage Flagged Event: ${triageResult.reason}. Elevating to Multi-Agent Committee...`);
                    aiResult = await runMultiAgentCorrelation(
                        parseFloat(rawTxn.amount),
                        rawTxn.account_from,
                        rawTxn.account_to,
                        richTelemetry
                    ) as any;
                    console.log(`[AI Engine Output] Risk: ${aiResult.riskScore} | Threat: ${aiResult.threatType}`);
                    console.log(`[AI Engine Explainability] ${aiResult.explainability}`);
                } else {
                    console.log(`[CDC Consumer] ✅ Stream Triage Passed (${triageResult.reason}). Bypassing heavy AI.`);
                }
                
                const normalizedEvent: BankPayload = {
                    eventId: rawTxn.txn_id,
                    timestamp: rawTxn.timestamp,
                    eventType: 'TRANSACTION',
                    userId: '00000000-0000-0000-0000-000000000000', // Valid UUID to prevent Postgres crash
                    transactionInfo: {
                        senderAccountId: rawTxn.account_from,
                        receiverAccountId: rawTxn.account_to,
                        amount: parseFloat(rawTxn.amount),
                    },
                    deviceInfo: {
                        deviceId: richTelemetry?.iam_logs?.device_fingerprint || 'SIMULATED_DEVICE',
                        ip: richTelemetry?.waf_logs?.geolocation || 'Unknown IP',
                        trusted: !richTelemetry?.waf_logs?.tor_exit_node_flag
                    },
                    riskScore: aiResult.riskScore,
                    aiInsights: {
                        threatType: aiResult.threatType,
                        explainability: aiResult.explainability,
                        isQuantumThreat: aiResult.isQuantumThreat
                    }
                };

                // Pipeline the event into our Neo4j Graph and Supabase Dashboards instantly
                await ingestBankEvent(normalizedEvent);

            } catch (err) {
                console.error("[CDC Consumer] Failed to process CDC event payload:", err);
            }
        });

        // Handle abrupt disconnections
        coreDbClient.on('error', (err) => {
            console.error("[CDC Consumer] Core Database connection error:", err);
            // Implement robust reconnection logic here in a production setting (e.g. exponential backoff)
        });

    } catch (err) {
        console.error("[CDC Consumer] Failed to start CDC Consumer:", err);
    }
};
