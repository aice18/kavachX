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

        Based on this data, evaluate the risk. 
        Focus on identifying fraud patterns, account takeovers, and look for subtle anomalies.
        If the telemetry suggests advanced encryption bypassing (e.g., impossible travel + high volume), flag it as a potential 'Quantum Risk Indicator'.
        
        You must explain your reasoning in 1-2 sentences for 'explainability'.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        riskScore: {
                            type: "number",
                            description: "Risk score from 0 to 100"
                        },
                        threatType: {
                            type: "string",
                            description: "Type of threat (e.g., 'Normal', 'Account Takeover', 'Money Laundering', 'Quantum Risk Indicator')"
                        },
                        isQuantumThreat: {
                            type: "boolean",
                            description: "Whether the threat is a quantum risk indicator"
                        },
                        explainability: {
                            type: "string",
                            description: "A 1-2 sentence explanation of WHY you assigned this score"
                        }
                    },
                    required: ["riskScore", "threatType", "isQuantumThreat", "explainability"]
                }
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
