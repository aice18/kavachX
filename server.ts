import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createServer as createHttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { syntheticDataGenerator } from './server/data/synthetic.js';
import { setupApiRoutes } from './server/routes/api.js';
import { wsHandler } from './server/routes/ws.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  app.use(express.json());

  const httpServer = createHttpServer(app);
  const allowedOrigins = process.env.APP_URL
    ? [process.env.APP_URL, 'http://localhost:3000']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Init Data
  console.log("Initializing KavachX Data Engine...");
  await syntheticDataGenerator();
  
  // API Routes
  setupApiRoutes(app, io);
  wsHandler(io);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0" as any, () => {
    console.log(`KavachX Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
