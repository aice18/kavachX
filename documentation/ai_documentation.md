# AI Documentation

KavachX leverages an AI-Native architecture designed to transition Security Operations Centers (SOC) from reactive alert monitoring to predictive threat forecasting.

## The AI Pipeline Flow

1. **Input:** Raw telemetry, API logs, VPN access records, and Core Banking transaction logs.
2. **Feature Extraction:** Identifying key attributes (time velocity, geolocation jumps, payload signatures).
3. **Correlation (Graph Analysis):** Linking disjointed events (e.g., a failed VPN login correlated with a subsequent high-value database query).
4. **Risk Score (ML Inference):** Evaluating the threat probability using predictive models.
5. **Gemini (LLM Analysis):** Generating human-readable explanations (Explainable AI) and recommended containment playbooks.
6. **Decision:** Outputting the final verdict to the SOC Dashboard or triggering automated containment.

## Why AI?

Modern banking infrastructures generate millions of security events daily. Rule-based SIEMs (Security Information and Event Management) produce high volumes of false positives, leading to "Alert Fatigue." AI allows KavachX to:
- **Reduce False Positives:** By recognizing complex, multi-stage attack patterns that bypass static rules.
- **Predictive Containment:** Intercepting threats before data exfiltration or financial loss occurs.

## Why Gemini?

For this rapid prototype, we utilized Google Gemini as our unified intelligence engine. 
- **Reasoning:** Gemini excels at zero-shot classification and sequence prediction when provided with strict system prompts. 
- **Simulated ML Models:** By passing structured JSON schemas to Gemini, we simulated the outputs of highly specialized models (Isolation Forests, LSTMs, and XGBoost) without needing weeks of model training.

## Explainable AI (XAI)

In the financial sector, AI decisions must be auditable. KavachX never presents a "black box" risk score. Every AI verdict (e.g., an 89% Threat Confidence) is accompanied by **Key Indicators** (e.g., "Login velocity 50x above baseline") to ensure the SOC analyst understands exactly *why* the AI flagged the event.

## Threat Forecasting

By analyzing the "kill chain" sequence of an active attack, the AI forecasts the attacker's next move. If an attacker breaches a VPN, the Threat Forecast Engine predicts their lateral movement towards the Core Database, allowing the SOC to sever the connection preemptively.
