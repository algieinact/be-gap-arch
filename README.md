# Career Gap Architect - Backend

Backend API for Career Gap Architect - AI-powered resume gap analysis tool.

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Anthropic API key

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your database URL and Anthropic API key

# Run database migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Start development server
npm run dev
```

Server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Prisma client configuration
│   │   └── env.ts           # Environment variables
│   ├── controllers/
│   │   └── analysis.controller.ts  # Request handlers
│   ├── services/
│   │   ├── ai.service.ts    # Claude AI integration
│   │   ├── cache.service.ts # Database cache operations
│   │   └── hash.service.ts  # SHA-256 hashing
│   ├── middlewares/
│   │   └── errorHandler.ts  # Error handling
│   ├── schemas/
│   │   └── analysis.schema.ts  # Zod validation
│   ├── routes/
│   │   └── analysis.routes.ts  # API routes
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   └── index.ts             # Express app entry
├── prisma/
│   └── schema.prisma        # Database schema
├── .env.example             # Environment variables template
├── package.json
└── tsconfig.json
```

## 🔧 Environment Variables

Create a `.env` file with:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/career_gap_architect"
ANTHROPIC_API_KEY="your-api-key-here"
ANTHROPIC_MODEL="claude-sonnet-4-20250514"
FRONTEND_URL="http://localhost:3000"
```

## 📡 API Endpoints

### POST /api/analyze
Analyze gap between resume and job description.

**Request Body:**
```json
{
  "resumeText": "Your resume content...",
  "jobDescriptionText": "Target job description..."
}
```

**Response:**
```json
{
  "success": true,
  "cached": false,
  "data": {
    "id": "clx...",
    "missingSkills": ["Docker", "Kubernetes"],
    "learningSteps": [...],
    "interviewQuestions": [...],
    "roadmapMarkdown": "...",
    "createdAt": "2025-02-11T..."
  }
}
```

### GET /api/stats
Get cache statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAnalyses": 42,
    "averageAccessCount": 2.3
  }
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-02-11T...",
  "uptime": 123.45,
  "environment": "development"
}
```

## 🗄️ Database

### Run Migrations
```bash
# Create new migration
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:migrate:deploy

# Reset database (warning: deletes all data)
npm run prisma:reset
```

### Prisma Studio
```bash
# Open database GUI
npm run prisma:studio
```

## 🧪 Testing

### Test Health Endpoint
```bash
curl http://localhost:5000/health
```

### Test Analysis (Cache Miss)
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Software Engineer with 3 years of experience...",
    "jobDescriptionText": "Looking for Senior Developer with Docker..."
  }'
```

### Test Analysis (Cache Hit)
```bash
# Run the same request again - should return in <1 second
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Software Engineer with 3 years of experience...",
    "jobDescriptionText": "Looking for Senior Developer with Docker..."
  }'
```

## 🔨 Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## 🏗️ Architecture

### Caching Strategy
1. Generate SHA-256 hash from normalized resume + job description
2. Check if hash exists in PostgreSQL
3. If found (cache hit): return immediately
4. If not found (cache miss): call Claude API, save result, return

### Error Handling
- Input validation with Zod
- AI response validation
- Database error handling
- Graceful error messages

### Performance
- Cache hit: <1 second
- Cache miss: 5-10 seconds (AI processing time)
- Database queries: ~10ms

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://..."
ANTHROPIC_API_KEY="sk-ant-..."
FRONTEND_URL="https://yourdomain.com"
```

## 📝 Logs

Development logs show:
- Cache hits/misses
- AI API call duration
- Error details with stack traces

Production logs show:
- Errors only
- Request logging (combined format)

## 🛡️ Security

- Helmet.js for security headers
- CORS configured for specific origin
- Input validation with Zod
- Request size limits (10MB)
- Environment variable validation

## 📚 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **AI**: Anthropic Claude API

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use async/await for async operations
3. Handle errors properly
4. Add logging for debugging
5. Update types when changing schemas

## 📄 License

MIT
