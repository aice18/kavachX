import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import metricsRoutes from './routes/metrics.routes';
import copilotRoutes from './routes/copilot.routes';

import mlRoutes from './routes/ml.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'https://kavach-x-omega.vercel.app', process.env.FRONTEND_URL].filter(Boolean) as string[],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/ml', mlRoutes);

// Database check (optional)
import { query } from './db';
query('SELECT NOW()').then((res) => {
  console.log('PostgreSQL (Supabase) Database Connected at:', res.rows[0].now);
}).catch((err) => {
  console.error('Failed to connect to Database. (Proceeding without DB connection) - Error:', err.message);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
