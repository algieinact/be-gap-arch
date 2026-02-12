import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export type AIProviderType = 'anthropic' | 'openai' | 'gemini';

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  ai: {
    provider: (process.env.AI_PROVIDER || 'openai').toLowerCase() as AIProviderType,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  gemini: {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};

export type Config = typeof config;

// Validate: DATABASE_URL always required; AI API key required based on AI_PROVIDER
const requiredEnvVars: string[] = ['DATABASE_URL'];

const provider = config.ai.provider;
if (provider === 'anthropic') {
  requiredEnvVars.push('ANTHROPIC_API_KEY');
} else if (provider === 'openai') {
  requiredEnvVars.push('OPENAI_API_KEY');
} else if (provider === 'gemini') {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('Missing required env: GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY when AI_PROVIDER=gemini');
  }
} else {
  throw new Error(`Invalid AI_PROVIDER: ${provider}. Use: anthropic | openai | gemini`);
}

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
