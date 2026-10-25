import cors from 'cors';
import express from 'express';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { securityHeaders } from './middleware/securityHeaders.js';
import apiRoutes from './routes/index.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(securityHeaders);
  app.use(
    cors({
      origin: config.clientOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.use('/api', apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
