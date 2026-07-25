/**
 * Enterprise Stream Triage Engine (Tier-1 Edge Processing)
 * 
 * Problem: A bank processes 100TB of telemetry daily. If we normalize all of it 
 * before running AI, the latency is too high (hours), and the threat is already executed.
 * 
 * Solution: This in-memory stream processor sits at the edge. It uses lightweight, 
 * sub-millisecond algorithms (like sliding window velocity checks) to filter out the 
 * 99.9% of normal noise. Only the 0.1% of suspicious data is forwarded to the 
 * expensive, heavy LLM for deep correlation.
 */

interface VelocityRecord {
    count: number;
    totalAmount: number;
    firstSeen: number; // timestamp
}

// In-memory cache representing a fast edge store (e.g., Redis or Apache Flink state)
const accountVelocityCache = new Map<string, VelocityRecord>();

const WINDOW_SIZE_MS = 60000; // 1 minute window for velocity checks
const VELOCITY_THRESHOLD_COUNT = 5; // More than 5 transactions a minute is suspicious
const VELOCITY_THRESHOLD_AMOUNT = 50000; // Moving > $50k a minute is suspicious

export interface TriageResult {
    requiresDeepAI: boolean;
    reason: string;
}

export const triageEventInStream = (
    accountId: string, 
    amount: number
): TriageResult => {
    const now = Date.now();
    let record = accountVelocityCache.get(accountId);

    // Clean up expired window or initialize new record
    if (!record || (now - record.firstSeen > WINDOW_SIZE_MS)) {
        record = { count: 1, totalAmount: amount, firstSeen: now };
        accountVelocityCache.set(accountId, record);
        
        // Fast path: Single normal transaction doesn't need heavy LLM correlation
        if (amount < 10000) {
            return { requiresDeepAI: false, reason: "Normal baseline transaction" };
        }
    } else {
        record.count += 1;
        record.totalAmount += amount;
        accountVelocityCache.set(accountId, record);
    }

    // High Velocity Detection (e.g., automated script draining an account)
    if (record.count >= VELOCITY_THRESHOLD_COUNT) {
        return { 
            requiresDeepAI: true, 
            reason: `High Velocity Anomaly: ${record.count} txns in 60s` 
        };
    }

    // High Volume Detection (e.g., massive fund exfiltration)
    if (record.totalAmount >= VELOCITY_THRESHOLD_AMOUNT) {
        return { 
            requiresDeepAI: true, 
            reason: `High Volume Anomaly: $${record.totalAmount} moved in 60s` 
        };
    }

    // If it reaches here, it's safe edge data. No LLM needed.
    return { requiresDeepAI: false, reason: "Stream pattern normal" };
};
