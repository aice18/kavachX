import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import metricsRoutes from './routes/metrics.routes';
import mlRoutes from './routes/ml.routes';
import fraudRoutes from './routes/fraud.routes.js';
import copilotRoutes from './routes/copilot.routes.js';
import ingestionRoutes from './routes/ingestion.routes.js';
import demoRoutes from './routes/demo.routes.js';
import { startSimulator } from './services/simulator.js';
import { startCDCConsumer } from './services/cdcConsumer.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const httpServer = http.createServer(app);
export const io = new SocketIOServer(httpServer, {
  cors: { origin: '*' }
});

// Telemetry interval
setInterval(() => {
  io.emit("telemetry_update", {
    riskScore: 40 + Math.floor(Math.random() * 20),
    activeIncidents: 10 + Math.floor(Math.random() * 8),
    xgbAccuracy: 90 + Math.random() * 9,
    rfAccuracy: 90 + Math.random() * 9
  });
}, 3000);

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'https://kavach-x-omega.vercel.app', 'https://kavach-x-gamma.vercel.app', process.env.FRONTEND_URL].filter(Boolean) as string[],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/ingestion', ingestionRoutes);
app.use('/api/demo', demoRoutes);

// Database check (optional)
import { query } from './db';
query('SELECT NOW()').then((res) => {
  console.log('PostgreSQL (Supabase) Database Connected at:', res.rows[0].now);
}).catch((err) => {
  console.error('Failed to connect to Database. (Proceeding without DB connection) - Error:', err.message);
});

httpServer.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  
  // Start the background simulators and CDC listeners
  startSimulator();
  startCDCConsumer();
});
