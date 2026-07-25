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

export const chatWithCopilot = async (req: Request, res: Response) => {
  if (!ai) {
    res.status(500).json({ error: "Gemini API is not configured on the server." });
    return;
  }
  try {
    const { message, history } = req.body;
    
    let contents: any[] = [];
    if (history && Array.isArray(history)) {
      contents = history.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction: "You are KavachX AI Copilot, an advanced cybersecurity assistant for banking systems. Provide concise, actionable, and technical advice on threat containment, log analysis, and incident response.",
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
};
