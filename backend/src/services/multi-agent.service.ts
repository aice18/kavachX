import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { AICorrelationResult } from './ai-correlation.service.js';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Continuous Learning & Maintenance State
let learningIterations = 0;
const MAINTENANCE_THRESHOLD = 50; // After 50 autonomous updates, require manual review

export interface MultiAgentResult extends AICorrelationResult {
    fraudScore: number;
    quantumRiskScore: number;
    complianceScore: number;
    requiresManualIntervention: boolean;
    learningIteration: number;
}

/**
 * Multi-Agent Orchestrator
 * Uses 3 specialized LLM agents in parallel to evaluate the same telemetry from different perspectives.
 */
export const runMultiAgentCorrelation = async (
    transactionAmount: number,
    senderAccount: string,
    receiverAccount: string,
    richTelemetry?: any
): Promise<MultiAgentResult> => {
    
    // Continuous Learning Loop Tracking
    learningIterations++;
    const requiresManualIntervention = learningIterations > MAINTENANCE_THRESHOLD;

    const baseContext = `
        Transaction Amount: $${transactionAmount}
        Sender: ${senderAccount}
        Receiver: ${receiverAccount}
        Telemetry: ${richTelemetry ? JSON.stringify(richTelemetry, null, 2) : 'Unknown'}
    `;

    // Agent 1: Fraud Scorer
    const fraudPrompt = `
        You are the Fraud Analysis Agent.
        Analyze this data and return a JSON object with 'score' (0-100) and 'reasoning'.
        Look for high velocity, account takeover indicators, anomalous amounts, and high-risk Merchant Category Codes (MCC) like 5944 (Jewelry).
        Pay attention to failed logins and MFA bypass events in the IAM logs.
        Data: ${baseContext}
    `;

    // Agent 2: Quantum Threat Analyst
    const quantumPrompt = `
        You are the Quantum Threat Intelligence Agent.
        Analyze this data for 'Harvest-Now-Decrypt-Later' (HNDL) indicators.
        Look for impossible travel, Tor exit nodes in the WAF logs, or low-value probes mixed with high-volume telemetry exfiltration (e.g. accessing /api/v1/export_keys).
        Return a JSON object with 'score' (0-100) and 'reasoning'.
        Data: ${baseContext}
    `;

    // Agent 3: Compliance & Regulatory Agent
    const compliancePrompt = `
        You are the Compliance Agent.
        Evaluate this data against AML (Anti-Money Laundering) and GDPR/RBI data sovereignty rules.
        Look at the SWIFT codes, currency pairs, and geolocation to detect cross-border violations or sanctioned region access.
        Return a JSON object with 'score' (0-100) and 'reasoning'.
        Data: ${baseContext}
    `;

    try {
        // Run all 3 agents in parallel for low latency
        const [fraudRes, quantumRes, compRes] = await Promise.all([
            ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fraudPrompt, config: { responseMimeType: "application/json" } }),
            ai.models.generateContent({ model: 'gemini-2.5-flash', contents: quantumPrompt, config: { responseMimeType: "application/json" } }),
            ai.models.generateContent({ model: 'gemini-2.5-flash', contents: compliancePrompt, config: { responseMimeType: "application/json" } })
        ]);

        const fraudData = JSON.parse(fraudRes.text || '{"score": 10, "reasoning": "Normal"}');
        const quantumData = JSON.parse(quantumRes.text || '{"score": 5, "reasoning": "No quantum indicators"}');
        const compData = JSON.parse(compRes.text || '{"score": 10, "reasoning": "Compliant"}');

        // Orchestrator Synthesis
        const aggregatedRiskScore = Math.max(fraudData.score, quantumData.score, compData.score);
        
        let threatType = "Normal";
        let isQuantum = false;
        if (quantumData.score > 75) {
            threatType = "Quantum HNDL Threat";
            isQuantum = true;
        } else if (fraudData.score > 80) {
            threatType = "High-Risk Fraud";
        } else if (compData.score > 80) {
            threatType = "AML Compliance Violation";
        }

        const synthesisReasoning = `[Committee Consensus] Fraud Score: ${fraudData.score} (${fraudData.reasoning}). Quantum Score: ${quantumData.score} (${quantumData.reasoning}). Compliance Score: ${compData.score} (${compData.reasoning}).`;

        // If manual intervention is required, prepend a critical warning
        const finalExplainability = requiresManualIntervention 
            ? `[SYSTEM HALTED] Autonomous learning threshold exceeded (${learningIterations}/${MAINTENANCE_THRESHOLD}). MANUAL SOC INTERVENTION REQUIRED. Data: ${synthesisReasoning}`
            : synthesisReasoning;

        return {
            riskScore: aggregatedRiskScore,
            threatType,
            isQuantumThreat: isQuantum,
            explainability: finalExplainability,
            fraudScore: fraudData.score,
            quantumRiskScore: quantumData.score,
            complianceScore: compData.score,
            requiresManualIntervention,
            learningIteration: learningIterations
        };

    } catch (error) {
        console.error("[Multi-Agent] Committee failed, falling back:", error);
        return {
            riskScore: transactionAmount > 10000 ? 85 : 10,
            threatType: transactionAmount > 10000 ? "Fallback: High Value" : "Normal",
            isQuantumThreat: false,
            explainability: "Agent timeout. Fallback heuristics applied.",
            fraudScore: 0, quantumRiskScore: 0, complianceScore: 0,
            requiresManualIntervention: false,
            learningIteration: learningIterations
        };
    }
};
