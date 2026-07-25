import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the AI client using the API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AICorrelationResult {
    riskScore: number;
    threatType: string;
    isQuantumThreat: boolean;
    explainability: string;
}

/**
 * AI Processing Layer: Correlates Cybersecurity Telemetry with Transactional Behavior.
 * This acts as the "Brain" of the operation, replacing hardcoded rules with intelligent context.
 */
export const runAICorrelation = async (
    transactionAmount: number,
    senderAccount: string,
    receiverAccount: string,
    deviceInfo?: { deviceName?: string, ipAddress?: string, isTrusted?: boolean }
): Promise<AICorrelationResult> => {
    try {
        const prompt = `
        You are an advanced AI cybersecurity system for a bank.
        Analyze the following real-time event that combines cybersecurity telemetry and transactional data.
        
        Data:
        - Transaction Amount: $${transactionAmount}
        - Sender: ${senderAccount}
        - Receiver: ${receiverAccount}
        - Telemetry: ${deviceInfo ? JSON.stringify(deviceInfo) : 'Unknown Device/IP'}

        Based on this data, provide a JSON response evaluating the risk. 
        Focus on identifying fraud patterns, account takeovers, and look for subtle anomalies.
        If the telemetry suggests advanced encryption bypassing (e.g., impossible travel + high volume), flag it as a potential 'Quantum Risk Indicator'.
        
        Respond ONLY with a valid JSON object matching this schema:
        {
            "riskScore": number (0-100),
            "threatType": string (e.g., "Normal", "Account Takeover", "Money Laundering", "Quantum Risk Indicator"),
            "isQuantumThreat": boolean,
            "explainability": string (A 1-2 sentence explanation of WHY you assigned this score, proving explainable AI)
        }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const resultText = response.text || "{}";
        const parsed: AICorrelationResult = JSON.parse(resultText);
        
        return parsed;
    } catch (error) {
        console.error("[AI Engine] Correlation failed, falling back to basic heuristics:", error);
        // Fallback in case of rate limits or errors
        const isAnomalous = transactionAmount > 10000;
        return {
            riskScore: isAnomalous ? 85 : 10,
            threatType: isAnomalous ? "High Value Transfer" : "Normal",
            isQuantumThreat: false,
            explainability: "Fallback heuristic: Evaluated purely on transaction amount."
        };
    }
};
