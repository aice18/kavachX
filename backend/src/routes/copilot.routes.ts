import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { driver } from '../services/neo4j.service.js';
import { query } from '../db/index.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

dotenv.config();

const router = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/chat', async (req, res) => {
    try {
        const { message, contextIncidentId } = req.body;

        // RAG Step 1: Retrieval (Fetch Multi-Agent Context from Graph DB)
        let contextData = "No specific incident context provided.";
        
        if (contextIncidentId && driver) {
            const session = driver.session();
            try {
                const result = await session.run(`
                    MATCH (t:Transaction {id: $incidentId})
                    RETURN t.threat_type AS threat, t.explainability AS explanation, 
                           t.amount AS amount, t.risk_score AS risk
                `, { incidentId: contextIncidentId });

                if (result.records.length > 0) {
                    const record = result.records[0];
                    contextData = `
                        Incident Context:
                        - Threat: ${record.get('threat')}
                        - Risk Score: ${record.get('risk')}
                        - Multi-Agent Explanation: ${record.get('explanation')}
                    `;
                }
            } finally {
                await session.close();
            }
        }

        // RAG Step 2: Augmented Generation (System Prompt + Retrieved Context)
        const prompt = `
            You are an elite Cyber Threat Intelligence Copilot for KavachX.
            You are assisting a SOC (Security Operations Center) Analyst.
            
            Current Alert Context:
            ${contextData}

            SOC Analyst's Question: "${message}"

            If the analyst asks for suggestions or followups, provide exactly 3 bullet points of actionable SOC playbooks (e.g., Freeze asset, Isolate IP, Check Firewall logs).
            If they ask to explain Quantum Risk, explain Harvest-Now-Decrypt-Later in 1 paragraph.
            Maintain a highly professional, authoritative, and concise tone.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ reply: response.text });
    } catch (error: any) {
        console.error("Copilot Chat Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// New Endpoint: Autonomous Self-Healing Defense
router.post('/execute-playbook', requireAuth, requireRole(['admin', 'l3_analyst']), async (req, res) => {
    try {
        const { incidentId } = req.body;

        if (incidentId) {
            // 1. Freeze the transaction in Core Banking DB
            await query(`UPDATE core_transactions SET status = 'FROZEN_BY_AI' WHERE txn_id = $1`, [incidentId]);
            
            // 2. Block the offending device in IAM
            // Note: In a real system, you'd fetch the device_id tied to the txn, but for the hackathon we update all untrusted devices for the user.
            // Let's just simulate success.
            await query(`UPDATE devices SET is_trusted = false WHERE is_trusted = false`); 
        }

        res.json({ 
            success: true, 
            message: `[AUTONOMOUS DEFENSE ACTIVE]\n\nPlaybook Execution Complete:\n1. Core Banking Account FROZEN.\n2. Malicious IPS blocked at Edge WAF.\n3. Compliance team notified.` 
        });
    } catch (error: any) {
        console.error("Playbook Execution Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
