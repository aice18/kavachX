import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { GoogleGenAI } from "@google/genai";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, { cors: { origin: "*" } });
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "kavachx-secret-key-for-prototype";

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

app.use(express.json());
app.use(cookieParser());

// Mock Data endpoints
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ success: true });
});

app.get("/api/auth/verify", (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});

// Mock Dashboard Data
app.get("/api/metrics/executive", (req, res) => {
  res.json({
    healthIndex: 27,
    valueAtRisk: 12106344,
    complianceStance: "RBI SLA AT RISK",
    eventsPerHour: "4.2M+",
    latency: "14 ms",
    falsePositivesReduction: "80%",
    accuracy: "95%",
    predictiveRiskHeatmap: [
      { category: 'Authentication', current: 40, predicted: 75, trend: 'up' },
      { category: 'Data Exfiltration', current: 20, predicted: 35, trend: 'up' },
      { category: 'DDoS', current: 85, predicted: 60, trend: 'down' },
      { category: 'Phishing', current: 50, predicted: 90, trend: 'up' },
      { category: 'Insider Threat', current: 15, predicted: 25, trend: 'up' }
    ],
    trendData: Array.from({ length: 24 }).map((_, i) => ({
      hour: `${i}:00`,
      score: Math.floor(10 + Math.random() * 40)
    })),
    attackVectors: [
      { name: 'Phishing', value: 45 },
      { name: 'Credential Stuffing', value: 30 },
      { name: 'Insider Threat', value: 15 },
      { name: 'DDoS', value: 10 }
    ],
    financialExposureTrend: Array.from({ length: 7 }).map((_, i) => ({
      day: `Day ${i + 1}`,
      exposure: Math.floor(500000 + Math.random() * 2000000)
    }))
  });
});

app.get("/api/metrics/soc", (req, res) => {
  res.json({
    riskScore: 53,
    activeIncidents: 14,
    threatVolume: Array.from({ length: 24 }).map((_, i) => ({
      time: `${i}:00`,
      critical: Math.floor(Math.random() * 10),
      high: Math.floor(Math.random() * 25),
      medium: Math.floor(Math.random() * 50)
    })),
    incidentTypes: [
      { name: 'Account Takeover', count: 42 },
      { name: 'Data Exfiltration', count: 28 },
      { name: 'Malware', count: 15 },
      { name: 'Privilege Escalation', count: 12 }
    ],
    correlationEfficiency: 92,
    threatGraph: [
      { name: 'VPN', impact: 40, connections: ['FW'] },
      { name: 'FW', impact: 20, connections: ['DB', 'Core'] },
      { name: 'DB', impact: 80, connections: [] },
      { name: 'Core', impact: 90, connections: [] },
    ],
    incidentFeed: [
      { id: 1, time: '10:45 AM', type: 'Anomalous geographic login attempt', user: 'USR_1254', status: 'Active' },
      { id: 2, time: '10:30 AM', type: 'Multiple failed API auths', user: 'API_GATEWAY', status: 'Blocked' },
      { id: 3, time: '09:15 AM', type: 'Unusual data exfiltration pattern', user: 'DB_SYNC', status: 'Investigating' }
    ],
    responseLog: [
      { id: 'RL-1029', time: '10:46 AM', action: 'Account Lockout', trigger: 'Anomalous geographic login attempt', impact: 'Prevented unauthorized access. User USR_1254 locked out.', status: 'Completed', type: 'identity' },
      { id: 'RL-1028', time: '10:31 AM', action: 'IP Blocked', trigger: 'Multiple failed API auths', impact: 'Blocked traffic from 45.33.x.x. API Gateway protected.', status: 'Completed', type: 'network' },
      { id: 'RL-1027', time: '09:16 AM', action: 'Session Terminated', trigger: 'Unusual data exfiltration pattern', impact: 'Terminated DB_SYNC session. Data leakage stopped.', status: 'Completed', type: 'data' },
      { id: 'RL-1026', time: '08:05 AM', action: 'MFA Enforced', trigger: 'Privilege escalation attempt', impact: 'Enforced MFA for admin group. Attack thwarted.', status: 'Completed', type: 'identity' },
      { id: 'RL-1025', time: '07:22 AM', action: 'Traffic Throttled', trigger: 'DDoS signature detected', impact: 'Throttled incoming connections. Availability maintained.', status: 'Completed', type: 'network' },
      { id: 'RL-1024', time: '06:15 AM', action: 'Quarantine Asset', trigger: 'Malware signature matched', impact: 'Isolated Workstation-42. Lateral movement prevented.', status: 'Completed', type: 'endpoint' }
    ]
  });
});

// Telemetry Broadcast
setInterval(() => {
  io.emit("telemetry_update", {
    riskScore: 40 + Math.floor(Math.random() * 20),
    activeIncidents: 10 + Math.floor(Math.random() * 8),
    xgbAccuracy: 90 + Math.random() * 9,
    rfAccuracy: 90 + Math.random() * 9
  });
}, 3000);

app.post("/api/copilot/chat", async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "Gemini API is not configured on the server." });
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
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4.x
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
