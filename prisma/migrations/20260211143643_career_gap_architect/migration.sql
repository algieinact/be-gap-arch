-- CreateTable
CREATE TABLE "analyses" (
    "id" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "resumeText" TEXT NOT NULL,
    "jobDescriptionText" TEXT NOT NULL,
    "missingSkills" TEXT[],
    "learningSteps" TEXT[],
    "interviewQuestions" TEXT[],
    "roadmapMarkdown" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessCount" INTEGER NOT NULL DEFAULT 1,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "analyses_cacheKey_key" ON "analyses"("cacheKey");

-- CreateIndex
CREATE INDEX "analyses_cacheKey_idx" ON "analyses"("cacheKey");

-- CreateIndex
CREATE INDEX "analyses_createdAt_idx" ON "analyses"("createdAt");
