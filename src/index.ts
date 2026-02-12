import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import analysisRoutes from './routes/analysis.routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app: Application = express();

// ============================================
// Middlewares
// ============================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Request logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// Routes
// ============================================

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api', analysisRoutes);

// ============================================
// Error Handling
// ============================================

// 404 handler (must be before error handler)
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

const PORT = config.port;

app.listen(PORT, () => {
  console.log('\n===========================================');
  console.log('🚀 Career Gap Architect Backend Server');
  console.log('===========================================');
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Server running on port: ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 CORS enabled for: ${config.cors.origin}`);
  console.log(`🤖 AI Model: ${config.anthropic.model}`);
  console.log('===========================================\n');
});

export default app;
