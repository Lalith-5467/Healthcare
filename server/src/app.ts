import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Middleware: CORS (Support ports 3000, 5173, and configured clientUrl)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  config.clientUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Middleware: Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Gateway Route Handler
app.get('/', (req: Request, res: Response) => {
  const acceptsHtml = req.accepts(['html', 'json']) === 'html';
  if (acceptsHtml) {
    return res.redirect(config.clientUrl || 'http://localhost:3000');
  }
  return res.status(200).json({
    success: true,
    name: 'MediCare Digital Health Record (DHR) API Backend',
    version: '1.0.0',
    status: 'online',
    frontendUrl: config.clientUrl || 'http://localhost:3000',
    healthCheck: '/api/health',
  });
});

// API Routes
app.use('/api', apiRouter);

// 404 Handler (Redirect browser navigation to frontend app, return JSON for API requests)
app.use((req: Request, res: Response) => {
  const acceptsHtml = req.accepts(['html', 'json']) === 'html';
  if (acceptsHtml && !req.path.startsWith('/api')) {
    const frontendBase = config.clientUrl || 'http://localhost:3000';
    return res.redirect(`${frontendBase}${req.originalUrl}`);
  }

  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
