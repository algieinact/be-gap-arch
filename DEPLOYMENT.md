# 🚀 Deployment Guide - Railway

## Persiapan Sebelum Deploy

### 1. Pastikan Code Sudah Siap
- ✅ `package.json` memiliki script `build`, `start`, dan `postinstall`
- ✅ `prisma/schema.prisma` sudah terkonfigurasi
- ✅ `.env.example` sudah lengkap
- ✅ `railway.json` sudah dibuat

### 2. Buat Akun Railway
1. Kunjungi https://railway.app
2. Sign up dengan GitHub account
3. Verifikasi email

---

## 📦 Langkah Deploy ke Railway

### Step 1: Buat Project Baru di Railway

1. Login ke Railway Dashboard
2. Klik **"New Project"**
3. Pilih **"Deploy from GitHub repo"**
4. Pilih repository `gap-arch-solvara`
5. Railway akan otomatis detect backend

### Step 2: Tambahkan PostgreSQL Database

1. Di Railway project, klik **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway akan otomatis membuat database dan generate `DATABASE_URL`
3. Database akan otomatis ter-link ke service backend

### Step 3: Set Environment Variables

Klik service backend → **"Variables"** → tambahkan:

```env
# Node Environment
NODE_ENV=production

# Port (Railway akan auto-assign, tapi bisa set default)
PORT=5000

# Database URL (otomatis dari PostgreSQL service)
# DATABASE_URL akan otomatis ter-set oleh Railway

# AI Provider Configuration
AI_PROVIDER=gemini

# Google Gemini API (WAJIB)
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyC05rgD-KyIwI5kgYlC_YL59U7ZO9zyfoQ
GEMINI_MODEL=gemini-2.5-flash

# CORS - Frontend URL (ganti dengan URL frontend production Anda)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Optional: Logging
LOG_LEVEL=info
```

**⚠️ PENTING:**
- `DATABASE_URL` akan otomatis di-set oleh Railway dari PostgreSQL service
- Ganti `FRONTEND_URL` dengan domain frontend production Anda
- Jangan commit API keys ke Git!

### Step 4: Configure Build & Deploy

Railway akan otomatis membaca `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build && npx prisma generate"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && node dist/index.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100
  }
}
```

**Penjelasan:**
- **buildCommand**: Install dependencies, compile TypeScript, generate Prisma Client
- **startCommand**: Jalankan migrations, lalu start server
- **healthcheckPath**: Railway akan ping `/health` untuk cek status

### Step 5: Deploy!

1. Railway akan otomatis trigger deployment
2. Tunggu proses build (±2-3 menit)
3. Jika sukses, akan muncul URL deployment (contoh: `https://your-app.up.railway.app`)

---

## 🔍 Verifikasi Deployment

### 1. Test Health Endpoint
```bash
curl https://your-app.up.railway.app/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-02-12T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 2. Test API Analyze
```bash
curl -X POST https://your-app.up.railway.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Software Engineer with 3 years experience in Node.js",
    "jobDescriptionText": "Looking for Senior Developer with Docker and Kubernetes"
  }'
```

### 3. Check Logs
Di Railway Dashboard:
- Klik service backend
- Tab **"Deployments"** → pilih deployment terbaru
- Tab **"Logs"** untuk melihat console output

---

## 🔧 Troubleshooting

### Error: "Cannot connect to database"
**Solusi:**
1. Pastikan PostgreSQL service sudah running
2. Check `DATABASE_URL` di Variables tab
3. Pastikan database dan backend service ter-link

### Error: "Prisma Client not generated"
**Solusi:**
- Pastikan `postinstall` script ada di `package.json`:
  ```json
  "postinstall": "prisma generate"
  ```
- Redeploy project

### Error: "Port already in use"
**Solusi:**
- Railway otomatis assign port via `process.env.PORT`
- Pastikan code menggunakan: `const PORT = process.env.PORT || 5000`

### Error: "CORS policy blocked"
**Solusi:**
- Update `FRONTEND_URL` di environment variables
- Pastikan frontend domain sudah benar

### Build Timeout
**Solusi:**
- Periksa `railway.json` buildCommand
- Pastikan tidak ada dependencies yang terlalu besar
- Check logs untuk error spesifik

---

## 📊 Monitoring

### Railway Dashboard
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Deployments**: History dan rollback

### Health Check
Railway akan otomatis ping `/health` setiap 30 detik:
- ✅ Status 200 = Healthy
- ❌ Status non-200 = Unhealthy (auto-restart)

---

## 🔄 Update & Redeploy

### Auto Deploy (Recommended)
1. Push code ke GitHub
2. Railway otomatis detect changes
3. Auto trigger new deployment

### Manual Deploy
1. Di Railway Dashboard
2. Klik service → **"Deployments"**
3. Klik **"Redeploy"**

---

## 💰 Pricing

Railway menyediakan:
- **Free Tier**: $5 credit/month (cukup untuk testing)
- **Pro Plan**: $20/month (untuk production)

**Estimasi Usage:**
- Backend service: ~$3-5/month
- PostgreSQL: ~$2-3/month
- **Total**: ~$5-8/month

---

## 🔐 Security Checklist

- ✅ `.env` di-gitignore
- ✅ API keys di Railway Variables (bukan hardcoded)
- ✅ CORS configured untuk frontend domain
- ✅ Helmet.js enabled untuk security headers
- ✅ Input validation dengan Zod
- ✅ PostgreSQL credentials dari Railway (auto-managed)

---

## 📝 Post-Deployment

### 1. Update Frontend
Ganti API URL di frontend dari:
```typescript
const API_URL = 'http://localhost:5000'
```

Menjadi:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-app.up.railway.app'
```

### 2. Test End-to-End
- Upload resume dari frontend
- Paste job description
- Klik "Analyze"
- Verify hasil analysis muncul

### 3. Monitor Logs
- Check Railway logs untuk errors
- Monitor database connections
- Track API response times

---

## 🎯 Next Steps

1. ✅ Deploy backend ke Railway
2. ✅ Deploy frontend ke Vercel/Netlify
3. ✅ Update CORS dengan frontend URL
4. ✅ Test end-to-end
5. ✅ Setup custom domain (optional)
6. ✅ Enable monitoring & alerts

---

## 📞 Support

Jika ada masalah:
1. Check Railway logs
2. Review environment variables
3. Test health endpoint
4. Check database connection
5. Review Prisma migrations

**Railway Documentation:**
- https://docs.railway.app
- https://docs.railway.app/deploy/deployments
- https://docs.railway.app/databases/postgresql
