# Career Gap Architect - Backend

Backend API for Career Gap Architect - AI-powered resume gap analysis tool.

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [Configuration](#configuration)
6. [API Endpoints](#api-endpoints)
7. [Database](#database)
8. [Development](#development)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Complete backend API with features:
- ✅ Express.js with TypeScript
- ✅ PostgreSQL + Prisma ORM
- ✅ Claude AI integration for analysis
- ✅ Smart caching with SHA-256
- ✅ Zod validation
- ✅ Robust error handling
- ✅ CORS & security (Helmet)

---

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher
- **Anthropic API Key**: Get it at [console.anthropic.com](https://console.anthropic.com/)

Check versions:
```bash
node -v    # Should be v18.x.x or higher
psql --version  # Should be 14.x or higher
```

---

## 📦 Installation

### Step 1: Clone Repository

```bash
# Clone from GitHub (adjust to your repo)
git clone <your-repo-url>
cd career-gap-architect/backend

# Or if folder already exists
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 245 packages in 35s
```

**Installed dependencies:**
- `express` - Web framework
- `@prisma/client` - Database ORM
- `@anthropic-ai/sdk` - Claude AI
- `zod` - Schema validation
- And others...

### Step 3: Setup Environment Variables

```bash
# Copy template
cp .env.example .env
```

**Edit `.env` file:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database (adjust to your PostgreSQL setup)
DATABASE_URL="postgresql://postgres:password@localhost:5432/career_gap_architect?schema=public"

# Anthropic AI (get from console.anthropic.com)
ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxxx"
ANTHROPIC_MODEL="claude-sonnet-4-20250514"

# CORS
FRONTEND_URL="http://localhost:3000"
```

**How to get Anthropic API Key:**
1. Visit https://console.anthropic.com/
2. Login or create new account
3. Go to Settings → API Keys
4. Click "Create Key"
5. Copy key and paste to `.env`

### Step 4: Setup Database

**A. Create Database in PostgreSQL:**

```bash
# Login to PostgreSQL
psql -U postgres

# Create new database
CREATE DATABASE career_gap_architect;

# Exit
\q
```

**Or for Windows (PowerShell):**
```powershell
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE career_gap_architect;

# Exit
\q
```

**B. Generate Prisma Client:**

```bash
npm run prisma:generate
```

**Expected output:**
```
✔ Generated Prisma Client to ./node_modules/@prisma/client
```

**C. Run Database Migrations:**

```bash
npm run prisma:migrate
```

**Expected output:**
```
✔ Your database is now in sync with your schema.
```

### Step 5: Verify Setup

**Check Database:**
```bash
# Check if tables are created
psql -U postgres -d career_gap_architect -c "\dt"
```

**Expected output:**
```
            List of relations
 Schema |   Name   | Type  |  Owner   
--------+----------+-------+----------
 public | analyses | table | postgres
```

### Step 6: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
===========================================
🚀 Career Gap Architect Backend Server
===========================================
📝 Environment: development
🌐 Server running on port: 5000
🔗 Health check: http://localhost:5000/health
🔗 API base URL: http://localhost:5000/api
🌍 CORS enabled for: http://localhost:3000
🤖 AI Model: claude-sonnet-4-20250514
===========================================
```

### Step 7: Test API

```bash
# Test health endpoint
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "OK",
  "timestamp": "2025-02-11T...",
  "uptime": 5.123,
  "environment": "development"
}
```

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

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts           # Prisma client setup
│   │   └── env.ts                # Environment config & validation
│   │
│   ├── controllers/
│   │   └── analysis.controller.ts # Request handlers (analyze, stats)
│   │
│   ├── services/
│   │   ├── ai.service.ts         # Claude AI integration
│   │   ├── cache.service.ts      # PostgreSQL caching logic
│   │   └── hash.service.ts       # SHA-256 hash generation
│   │
│   ├── middlewares/
│   │   └── errorHandler.ts       # Error handling & async wrapper
│   │
│   ├── schemas/
│   │   └── analysis.schema.ts    # Zod validation schemas
│   │
│   ├── routes/
│   │   └── analysis.routes.ts    # API endpoint definitions
│   │
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   │
│   └── index.ts                  # Main Express app
│
├── prisma/
│   └── schema.prisma             # Database schema
│
├── .env.example                  # Environment template
├── .env                          # Your environment (gitignored)
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── setup.sh                      # Auto setup script
├── test-api.sh                   # Testing script
├── test-data.json                # Sample test data
└── README.md                     # This file
```

---

## ⚙️ Configuration

### Environment Variables

`.env` file (create from `.env.example`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Anthropic AI
ANTHROPIC_API_KEY="sk-ant-api03-xxxxxx"
ANTHROPIC_MODEL="claude-sonnet-4-20250514"

# CORS
FRONTEND_URL="http://localhost:3000"
```

**Notes:**
- `DATABASE_URL`: Adjust to your PostgreSQL credentials
- `ANTHROPIC_API_KEY`: Required, get from console.anthropic.com
- `FRONTEND_URL`: Frontend URL for CORS (default: localhost:3000)

### Prisma Schema

`prisma/schema.prisma` file defines database model:

```prisma
model Analysis {
  id                String   @id @default(cuid())
  cacheKey          String   @unique  // SHA-256 hash
  resumeText        String   @db.Text
  jobDescriptionText String  @db.Text
  
  // Results
  missingSkills     String[]
  learningSteps     String[]
  interviewQuestions String[]
  roadmapMarkdown   String   @db.Text
  
  // Metadata
  createdAt         DateTime @default(now())
  accessCount       Int      @default(1)
  lastAccessedAt    DateTime @default(now())
}
```

---

## 📡 API Endpoints

### GET /health
Health check endpoint.

**Request:**
```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-02-11T10:30:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

### POST /api/analyze
Analyze gap between resume and job description.

**Request:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Software Engineer with 3 years...",
    "jobDescriptionText": "Looking for Senior Developer..."
  }'
```

**Response (Cache Miss):**
```json
{
  "success": true,
  "cached": false,
  "data": {
    "id": "clx123...",
    "missingSkills": ["Docker", "Kubernetes", "TypeScript"],
    "learningSteps": [
      "Complete TypeScript course...",
      "Learn Docker containerization...",
      "Build microservices project..."
    ],
    "interviewQuestions": [
      "Explain TypeScript benefits...",
      "How to containerize apps...",
      "Describe CI/CD experience..."
    ],
    "roadmapMarkdown": "# Your 90-Day Learning Path\n\n...",
    "createdAt": "2025-02-11T..."
  }
}
```

**Response (Cache Hit):**
```json
{
  "success": true,
  "cached": true,  // ← indicates from cache
  "data": { ... }
}
```

### GET /api/stats
Get cache statistics.

**Request:**
```bash
curl http://localhost:5000/api/stats
```

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

### POST /api/cleanup
Cleanup old analyses (optional maintenance).

**Request:**
```bash
curl -X POST http://localhost:5000/api/cleanup \
  -H "Content-Type: application/json" \
  -d '{"daysOld": 90}'
```

---

## 🗄️ Database

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (development)
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:migrate:deploy

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (⚠️ deletes all data!)
npm run prisma:reset
```

### Database Management

**View data with Prisma Studio:**
```bash
npm run prisma:studio
```

Opens GUI at `http://localhost:5555`

**Direct SQL queries:**
```bash
psql -U postgres -d career_gap_architect

-- Count analyses
SELECT COUNT(*) FROM analyses;

-- View recent analyses
SELECT id, "createdAt", "accessCount" 
FROM analyses 
ORDER BY "createdAt" DESC 
LIMIT 5;
```

---

## 🛠 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open database GUI |

### Development Workflow

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Watch logs
# Server logs will show:
# - [Cache] HIT/MISS status
# - [AI Service] API call duration
# - [Controller] Request processing

# Terminal 3: Test API
curl http://localhost:5000/health
```

### Hot Reload

Using `tsx watch` - changes auto-reload:
- Edit any `.ts` file
- Save
- Server restarts automatically
- No manual restart needed

---

## 🧪 Testing

### Manual Testing

**Test with curl:**
```bash
# Health check
curl http://localhost:5000/health

# Analyze (cache miss)
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d @test-data.json

# Analyze (cache hit) - run same request again
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

### Automated Testing

**Run test suite:**
```bash
chmod +x test-api.sh
./test-api.sh
```

**Test suite includes:**
- ✅ Health check
- ✅ Analysis (cache miss)
- ✅ Analysis (cache hit)
- ✅ Stats endpoint
- ✅ Validation errors
- ✅ 404 handling

**Expected output:**
```
========================================
Career Gap Architect - API Test Suite
========================================

Test 1: Health Check Endpoint
✅ PASSED

Test 2: Analysis Endpoint (Cache Miss)
✅ PASSED
Duration: 5234ms

Test 3: Analysis Endpoint (Cache Hit)
✅ PASSED
Duration: 87ms
⚡ Response time < 1 second (excellent!)

...

========================================
Test Summary
========================================
Total Tests: 7
Passed: 7
All tests passed! 🎉
```

---

## 🚀 Deployment

### Production Build

```bash
# Build TypeScript
npm run build

# Check dist/ folder
ls dist/
```

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://..."
ANTHROPIC_API_KEY="sk-ant-..."
FRONTEND_URL="https://your-frontend-domain.com"
```

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Init project
railway init

# Add PostgreSQL
railway add

# Set environment variables
railway variables set ANTHROPIC_API_KEY=sk-ant-...

# Deploy
railway up
```

### Deploy to Render

1. Connect GitHub repository
2. Create new Web Service
3. Set environment variables in dashboard
4. Auto-deploy on push

### Deploy to Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Launch app
fly launch

# Set secrets
fly secrets set ANTHROPIC_API_KEY=sk-ant-...

# Deploy
fly deploy
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Symptoms:**
```
Error: Can't reach database server at localhost:5432
```

**Solutions:**

1. **Check PostgreSQL is running:**
```bash
# macOS
brew services start postgresql@16

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL service from Services app

# Verify
pg_isready
```

2. **Check DATABASE_URL:**
```bash
cat .env | grep DATABASE_URL
```

Should match your PostgreSQL setup.

3. **Test connection:**
```bash
psql -U postgres -c "SELECT version();"
```

---

### Error: "Invalid API key"

**Symptoms:**
```
AI API Error: Invalid API key
```

**Solutions:**

1. **Verify key at console.anthropic.com**
2. **Check .env file:**
```bash
cat .env | grep ANTHROPIC_API_KEY
```

3. **Restart server:**
```bash
npm run dev
```

---

### Error: "Port 5000 already in use"

**Solutions:**

**Windows:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

**Or change port in `.env`:**
```env
PORT=5001
```

---

### Error: "Prisma Client not generated"

**Symptoms:**
```
Cannot find module '@prisma/client'
```

**Solution:**
```bash
npm run prisma:generate
```

---

### CORS Error from Frontend

**Symptoms:**
- Frontend cannot connect
- Browser console: "blocked by CORS policy"

**Solution:**

Check backend `.env`:
```env
FRONTEND_URL="http://localhost:3000"
```

Restart backend:
```bash
npm run dev
```

---

## 📊 Performance

### Metrics

| Metric | Expected Value |
|--------|---------------|
| Cache Hit Response | < 100ms |
| Cache Miss Response | 5-10 seconds |
| Database Query | ~10ms |
| AI API Call | 3-8 seconds |

### Optimization Tips

1. **Database Indexes** - Already added in Prisma schema
2. **Connection Pooling** - Prisma handles automatically
3. **Caching Strategy** - SHA-256 ensures deduplication

---

## ✅ Setup Checklist

Before starting development:

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Database `career_gap_architect` created
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Anthropic API key added to `.env`
- [ ] Prisma Client generated
- [ ] Migrations completed
- [ ] Server starts without errors
- [ ] Health endpoint returns OK
- [ ] Can submit analysis and get results

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Anthropic API Reference](https://docs.anthropic.com/)
- [Zod Documentation](https://zod.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 🔐 Security

- ✅ Helmet.js for security headers
- ✅ CORS configured for specific origin
- ✅ Input validation with Zod
- ✅ Environment variables for secrets
- ✅ Request size limits (10MB)
- ✅ No sensitive data in error responses

---

## 🎉 Done!

Backend is ready to use!

**Next steps:**
1. Start backend: `npm run dev`
2. Test API: `curl http://localhost:5000/health`
3. Start frontend in another terminal
4. Test full integration

Happy coding! 🚀