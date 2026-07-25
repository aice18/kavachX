# Deployment Guide

This guide outlines the steps to deploy KavachX across various environments.

## Prerequisites

Ensure you have the following installed locally:
- Node.js (v18+)
- npm or yarn
- Docker (for containerized deployments)
- Git

## Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aice18/kavachX.git
   cd kavachX
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="your-gemini-key"
   DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
   ```

4. **Run the Development Servers (Frontend + Backend):**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

## Production Deployment

KavachX uses a decoupled architecture, allowing independent deployment of the frontend and backend.

### 1. Frontend (Vercel)
- Connect your GitHub repository to Vercel.
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- The React application will be deployed globally on Vercel's Edge Network.

### 2. Backend (Render / AWS / Azure)
- **Render:** Connect the repository, choose "Web Service", set the build command to `npm install && npm run build` (if compiling TS), and set the start command to `node dist/index.js` (or `tsx backend/src/index.ts`). Ensure `.env` variables are added to the Render dashboard.
- **Docker:**
  A `Dockerfile` can be used to containerize the Express backend for deployment on AWS ECS or Azure Container Apps.

### 3. Database (Supabase)
- Use the hosted Supabase PostgreSQL instance. Ensure connection pooling (port 6543) is enabled for production workloads to handle high connection concurrency from the Node.js backend.
