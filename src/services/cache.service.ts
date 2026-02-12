import { prisma } from '../config/database';
import type { AnalysisResponse } from '../schemas/analysis.schema';
import type { CacheStats } from '../types';

export class CacheService {
  /**
   * Check if analysis exists in cache
   * Updates access count and timestamp if found
   */
  async get(cacheKey: string): Promise<AnalysisResponse | null> {
    try {
      const cached = await prisma.analysis.findUnique({
        where: { cacheKey },
        select: {
          id: true,
          missingSkills: true,
          learningSteps: true,
          interviewQuestions: true,
          roadmapMarkdown: true,
          createdAt: true,
        },
      });

      if (cached) {
        // Update access tracking asynchronously
        prisma.analysis.update({
          where: { cacheKey },
          data: {
            accessCount: { increment: 1 },
            lastAccessedAt: new Date(),
          },
        }).catch((err) => {
          console.error('[Cache Service] Failed to update access count:', err);
        });

        console.log(`[Cache Service] Cache HIT for key: ${cacheKey.substring(0, 16)}...`);
      } else {
        console.log(`[Cache Service] Cache MISS for key: ${cacheKey.substring(0, 16)}...`);
      }

      return cached;
    } catch (error) {
      console.error('[Cache Service] Error fetching from cache:', error);
      return null; // Return null on error to proceed with AI call
    }
  }

  /**
   * Save new analysis to cache
   */
  async set(
    cacheKey: string,
    resumeText: string,
    jobDescriptionText: string,
    analysis: {
      missing_skills: string[];
      learning_steps: string[];
      interview_questions: string[];
      roadmap_markdown: string;
    }
  ): Promise<AnalysisResponse> {
    try {
      const saved = await prisma.analysis.create({
        data: {
          cacheKey,
          resumeText,
          jobDescriptionText,
          missingSkills: analysis.missing_skills,
          learningSteps: analysis.learning_steps,
          interviewQuestions: analysis.interview_questions,
          roadmapMarkdown: analysis.roadmap_markdown,
        },
        select: {
          id: true,
          missingSkills: true,
          learningSteps: true,
          interviewQuestions: true,
          roadmapMarkdown: true,
          createdAt: true,
        },
      });

      console.log(`[Cache Service] Saved analysis with ID: ${saved.id}`);
      return saved;
    } catch (error) {
      console.error('[Cache Service] Error saving to cache:', error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    try {
      const [total, avgAccessCount] = await Promise.all([
        prisma.analysis.count(),
        prisma.analysis.aggregate({
          _avg: { accessCount: true },
        }),
      ]);

      return {
        totalAnalyses: total,
        averageAccessCount: avgAccessCount._avg.accessCount || 0,
      };
    } catch (error) {
      console.error('[Cache Service] Error fetching stats:', error);
      throw error;
    }
  }

  /**
   * Delete old analyses (optional cleanup method)
   */
  async cleanup(daysOld: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await prisma.analysis.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
          accessCount: {
            equals: 1, // Only delete if accessed only once
          },
        },
      });

      console.log(`[Cache Service] Cleaned up ${result.count} old analyses`);
      return result.count;
    } catch (error) {
      console.error('[Cache Service] Error during cleanup:', error);
      throw error;
    }
  }
}
