# KavachX — AI-Driven Cyber Threat Correlation Platform

> **Hackathon Track:** AI-Driven Correlation of Cybersecurity Telemetry & Transactional Behaviour  
> **Domain:** Indian Banking & Financial Services (BFSI)  
> **Stack:** React 19 · TypeScript · Express · Socket.IO · Gemini AI · Tailwind CSS · XY Flow

---

## What is KavachX?

KavachX is a real-time Security Operations Centre (SOC) platform purpose-built for Indian banks. It solves a critical gap that Indian financial institutions face today: **cybersecurity and transactional data exist in siloes** — network logs live in SIEM tools, UPI/RTGS transaction data lives in core banking, and no intelligence layer correlates them together.

KavachX closes that gap by:

1. **Correlating** cybersecurity telemetry (VPN, firewall, DB queries) with transactional events (UPI, RTGS, NEFT) in real-time
2. **Forecasting** the next attack step using a deterministic risk engine with explainable AI factors
3. **Quantifying** financial exposure in INR before a breach is complete
4. **Flagging** Post-Quantum Cryptography (PQC) vulnerabilities across banking infrastructure — addressing the Harvest-Now-Decrypt-Later threat
5. **Responding** via AI-powered decision intelligence (Gemini AI) with full incident context

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         KavachX Platform                        │
├─────────────────────┬───────────────────────────────────────────┤
│   Event Sources     │         Backend (Node.js/Express)         │
│  ┌──────────┐       │  ┌─────────────────┐  ┌───────────────┐  │
│  │ VPN Logs │──────►│  │  AI Correlation │  │ Gemini AI     │  │
│  │ UPI/RTGS │──────►│  │    Engine       │  │ Copilot       │  │
│  │ DB Audit │──────►│  │  (BFS Graph)    │  │ (Real LLM)    │  │
│  │ Firewall │──────►│  └────────┬────────┘  └───────────────┘  │
│  │ ATM Logs │       │           │ Socket.IO (real-time)         │
│  └──────────┘       │  ┌────────▼────────┐                     │
│                     │  │  In-Memory DB   │                     │
│                     │  │ (Graph + Events)│                     │
│                     │  └─────────────────┘                     │
├─────────────────────┴───────────────────────────────────────────┤
│                    React Frontend (Vite)                         │
│  Executive Dashboard · SOC Console · Incident Investigator      │
│  PQC Scanner · What-If Simulator · AI Copilot · Forecast        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Features

| Feature | Description |
|---|---|
| **Cyber Health Index** | Real-time aggregate risk score (0–100) with live trend chart |
| **AI Correlation Engine** | Cross-signal detection across cyber + transactional events |
| **Incident Investigation** | Full attack chain timeline with entity relationship graph |
| **Gemini AI Copilot** | LLM with full incident context — blast radius, RBI obligations, containment |
| **Threat Forecast Engine** | Deterministic next-step prediction with probability and ETA |
| **What-If Simulator** | BFS graph traversal to calculate true blast radius of any asset compromise |
| **PQC Scanner** | 12-asset audit against NIST FIPS 203/204/205 with HNDL exposure in INR |
| **Dynamic Trust Scores** | Real-time behavioral scoring for employees, devices, and accounts |
| **SOC Console** | Live threat map (India) + streaming event log terminal |
| **Zero Trust Auth** | Session-based route protection — all dashboard routes guarded |

---

## Quick Start

### Prerequisites
- Node.js 18+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com)

### Setup

```bash
# 1. Clone and install
npm install

# 2. Set your API key
cp .env.example .env.local
# Edit .env.local → set GEMINI_API_KEY=your_key_here

# 3. Run
npm run dev
```

Open `http://localhost:3000`

### Demo Login Credentials

| ID | Password | Role |
|---|---|---|
| `ADMIN_CISO_01` | `kavachx2024` | CISO Admin |
| `SOC_ANALYST_01` | `analyst2024` | SOC Analyst |
| `demo` | `demo` | Demo Access |

### Live Demo Flow

1. Login → **Command Center** loads with live Cyber Health Index
2. Click **"Start Demo Simulation"** → Watch a 12-step attack unfold in real-time
3. Open the **Critical incident** → Explore the attack timeline, graph, and risk explanation
4. Ask the **AI Copilot** → Powered by Gemini AI with full incident context
5. Run **What-If Simulator** → Type `DB_CORE_1` to see graph-based blast radius
6. Visit **Cryptography Posture** → Click "Run PQC Scanner" to see all 12 banking assets
7. Visit **SOC Console** → Live India threat map + streaming event log

---

## Regulatory Alignment

- **RBI Cybersecurity Framework** — Incident notification timelines, SOC requirements
- **IT Act Section 43A** — Reasonable security practices for sensitive financial data
- **NPCI Guidelines** — UPI and RTGS transaction monitoring
- **NIST FIPS 203/204/205** — Post-Quantum Cryptography migration standards
- **PCI DSS v4.0** — Card data encryption compliance monitoring
- **ISO 27001** — Information security management alignment

---

## Attack Scenario (Demo)

The demo simulates a real-world insider + external attacker attack chain observed in Indian banks:

```
1. Phishing email → employee clicks credential link
2. Attacker uses credentials to VPN in from St. Petersburg, Russia
3. New device + new geography flagged by KavachX
4. Attacker queries DB_CORE_1 — exports 50,000 customer records
5. RTGS transfer of ₹1,20,00,000 to mule account initiated
6. KavachX correlates all 5 signals → Risk Score: 95/100 (CRITICAL)
7. Recommended: freeze account, block IP, halt transfer, notify RBI
```

**Time from first signal to correlated incident: < 2 minutes**

---

## Team
Built for the International Cybersecurity Hackathon — Problem Statement 2: AI-Driven Correlation of Cybersecurity Telemetry & Transactional Behaviour.
