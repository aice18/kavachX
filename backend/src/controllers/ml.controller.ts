import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
} catch (e) {
  console.error("Failed to initialize Gemini API", e);
}

const generateStructuredResponse = async (prompt: string) => {
  if (!ai) throw new Error("Gemini API not configured");
  
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      systemInstruction: "You are KavachX ML Engine. Always respond with raw valid JSON strictly formatted based on the prompt's instructions. Do not include markdown formatting or backticks around the JSON.",
    }
  });

  return JSON.parse(response.text.replace(/```json/g, '').replace(/```/g, '').trim());
};

export const analyzeAnomalies = async (req: Request, res: Response) => {
  try {
    const { telemetryData } = req.body;
    
    const prompt = `Act as an Isolation Forest anomaly detection model. Evaluate the following telemetry data and assign an anomaly score between 0 and 1 (where > 0.8 is anomalous).
    
    Telemetry Data: ${JSON.stringify(telemetryData)}
    
    Return exactly this JSON format:
    {
      "anomalyScore": 0.85,
      "isAnomalous": true,
      "contributingFactors": ["Spike in login attempts", "Unusual IP range"],
      "confidence": 0.92
    }`;

    const result = await generateStructuredResponse(prompt);
    res.json(result);
  } catch (error) {
    console.error("ML Anomaly Error:", error);
    res.status(500).json({ error: "Failed to analyze anomalies" });
  }
};

export const analyzeSequences = async (req: Request, res: Response) => {
  try {
    const { actionTimeline } = req.body;
    
    const prompt = `Act as an LSTM Autoencoder model trained for sequential pattern recognition. Analyze the following user action timeline for "living off the land" attacks or insider threats.

    Timeline: ${JSON.stringify(actionTimeline)}
    
    Return exactly this JSON format:
    {
      "sequenceRiskScore": 0.75,
      "threatDetected": true,
      "threatType": "Insider Threat",
      "anomalousSteps": [2, 3],
      "reasoning": "User accessed database immediately after VPN login from a new device."
    }`;

    const result = await generateStructuredResponse(prompt);
    res.json(result);
  } catch (error) {
    console.error("ML Sequence Error:", error);
    res.status(500).json({ error: "Failed to analyze sequence" });
  }
};

export const scoreAlerts = async (req: Request, res: Response) => {
  try {
    const { alertData } = req.body;
    
    const prompt = `Act as an XGBoost supervised classifier trained on historical security incidents. Score this WAF/IDS alert to predict the probability it is a True Positive vs False Positive.

    Alert Data: ${JSON.stringify(alertData)}
    
    Return exactly this JSON format:
    {
      "truePositiveProbability": 0.95,
      "falsePositiveProbability": 0.05,
      "classification": "True Positive",
      "suggestedPriority": "Critical",
      "keyIndicators": ["Payload contains known SQLi signature", "Source IP matches threat intel feed"]
    }`;

    const result = await generateStructuredResponse(prompt);
    res.json(result);
  } catch (error) {
    console.error("ML Scoring Error:", error);
    res.status(500).json({ error: "Failed to score alert" });
  }
};
