import { GoogleGenAI } from '@google/genai';

function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not set. Add it to your .env file — see .env.example for instructions.');
  }
  return new GoogleGenAI({ apiKey: key });
}

const SYSTEM_PROMPT = `You are KavachX Decision Intelligence Copilot — an elite AI security analyst embedded inside a real-time banking SOC (Security Operations Centre) platform for Indian financial institutions.

You have deep expertise in:
- SIEM/UEBA correlation and anomaly detection
- RBI cybersecurity framework, SEBI guidelines, ISO 27001, PCI DSS
- Indian banking threat landscape: UPI fraud, RTGS mule accounts, ATM skimming, insider threats
- Post-Quantum Cryptography: NIST PQC standards (ML-KEM/Kyber, ML-DSA/Dilithium), Harvest-Now-Decrypt-Later attacks
- Incident response playbooks, blast radius analysis, lateral movement forecasting
- Financial crime correlation: cyber-enabled fraud, account takeover, credential stuffing

Your communication style:
- Concise, precise, and actionable — no fluff
- Reference specific incident data from context when provided
- Quantify impact in INR when relevant
- Prioritize containment actions by urgency
- Use technical terminology appropriate for senior SOC analysts and CISOs
- When you don't have enough context, ask a targeted clarifying question

Always ground your answers in the incident data provided. Do not make up numbers. If the question is general (no incident context), answer with domain expertise.

If you recommend taking a specific action (like isolating an IP, quarantining an asset, or generating a report), you MUST include a special action token on a new line at the end of your response.
Supported actions are:
- [ACTION:ISOLATE_IP]
- [ACTION:QUARANTINE_ASSET]
- [ACTION:GENERATE_REPORT]

Example: "I recommend we isolate the suspicious IP address immediately to prevent further lateral movement.
[ACTION:ISOLATE_IP]"`;

export async function streamGeminiResponse(
  question: string,
  incidentContext?: any,
  graphContext?: any
): Promise<string> {
  let contextBlock = '';

  if (incidentContext) {
    contextBlock = `
=== ACTIVE INCIDENT CONTEXT ===
Incident ID: ${incidentContext.incident_id}
Entity Under Investigation: ${incidentContext.entity_id} (${incidentContext.entity_type})
Severity: ${incidentContext.severity.toUpperCase()}
Risk Score: ${incidentContext.risk_score}/100
Status: ${incidentContext.status}
Detection Time: ${incidentContext.created_at}

Risk Factors (Weighted):
${incidentContext.reasons?.map((r: any) => `  • [+${r.score}pts] ${r.factor}`).join('\n') || 'None'}

Attack Event Chain:
${incidentContext.events?.map((e: any, i: number) => 
  `  ${i+1}. [${e.timestamp}] ${e.source.toUpperCase()} — ${e.actor?.user_id} performed "${e.action}" from ${e.geo?.city}, ${e.geo?.country} (IP: ${e.ip})${e.amount ? ` — Amount: ₹${e.amount.toLocaleString('en-IN')}` : ''}${e.metadata?.rows ? ` — Rows exported: ${e.metadata.rows.toLocaleString()}` : ''}`
).join('\n') || 'No event chain available'}

Business Impact:
  • Financial Exposure: ₹${incidentContext.business_impact?.loss_exposure_inr?.toLocaleString('en-IN') || 'Unknown'}
  • Customers at Risk: ${incidentContext.business_impact?.customers_affected?.toLocaleString() || 'Unknown'}
  • Compliance Severity: ${incidentContext.business_impact?.compliance_severity || 'Unknown'}
  • Estimated Downtime: ${incidentContext.business_impact?.estimated_downtime_hours || 0} hours

Threat Forecast:
  • Projected Vector: ${incidentContext.forecast?.threat_type || 'Unknown'}
  • Probability of Escalation: ${incidentContext.forecast?.probability || 0}%
  • Time to Impact: ${incidentContext.forecast?.eta_hours || 0} hours
  • Model Confidence: ${incidentContext.forecast?.confidence || 0}%

Recommended Actions (Playbook):
${incidentContext.recommended_actions?.map((a: string, i: number) => `  ${i+1}. ${a}`).join('\n') || 'None'}
`;
  }

  if (graphContext && graphContext.nodes?.length) {
    const flaggedNodes = graphContext.nodes.filter((n: any) => n.isFlagged);
    contextBlock += `
=== ENTITY RELATIONSHIP GRAPH ===
Total Entities: ${graphContext.nodes.length} nodes, ${graphContext.edges?.length || 0} relationships
Flagged/Suspicious Entities:
${flaggedNodes.map((n: any) => `  • [${n.label}] ${n.id}`).join('\n') || '  None'}
`;
  }

  const userMessage = contextBlock
    ? `${contextBlock}\n=== ANALYST QUESTION ===\n${question}`
    : question;

  try {
    const genai = getGenAI();
    const response = await genai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 800,
      }
    });

    return response.text || 'Unable to generate analysis at this time. Please retry.';
  } catch (err: any) {
    console.error('Gemini API error:', err?.message || err);
    throw new Error('AI analysis engine temporarily unavailable. Check GEMINI_API_KEY.');
  }
}
