import { Request, Response, NextFunction } from "express";
import { AIService } from "../services/ai.service";
import { CacheService } from "../services/cache.service";
import { HashService } from "../services/hash.service";
import { PDFService } from "../services/pdf.service";
import { AnalysisRequestSchema } from "../schemas/analysis.schema";
import { ZodError } from "zod";
import type { ApiResponse, CacheStats } from "../types";
import type { AnalysisResponse } from "../schemas/analysis.schema";

export class AnalysisController {
  private aiService: AIService;
  private cacheService: CacheService;

  constructor() {
    this.aiService = new AIService();
    this.cacheService = new CacheService();
  }

  /**
   * POST /api/analyze
   * Analyze gap between resume and job description
   */
  async analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("[Controller] Starting analysis request...");

      // 1. Validate input
      const { resumeText, jobDescriptionText } = AnalysisRequestSchema.parse(req.body);

      // 2. Generate cache key
      const cacheKey = HashService.generateCacheKey(resumeText, jobDescriptionText);
      console.log(`[Controller] Cache key generated: ${cacheKey.substring(0, 16)}...`);

      // 3. Check cache
      const cached = await this.cacheService.get(cacheKey);

      if (cached) {
        const response: ApiResponse<AnalysisResponse> = {
          success: true,
          cached: true,
          data: cached,
        };
        res.status(200).json(response);
        return;
      }

      // 4. Call AI service (cache miss)
      console.log("[Controller] Cache miss - calling AI service...");
      const aiResponse = await this.aiService.analyzeGap(resumeText, jobDescriptionText);

      // 5. Save to cache
      const saved = await this.cacheService.set(cacheKey, resumeText, jobDescriptionText, aiResponse);

      // 6. Return response
      const response: ApiResponse<AnalysisResponse> = {
        success: true,
        cached: false,
        data: saved,
      };

      res.status(201).json(response);
      console.log("[Controller] Analysis completed successfully");
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.errors,
        });
        return;
      }

      // Pass other errors to error handler middleware
      next(error);
    }
  }

  /**
   * GET /api/stats
   * Get cache statistics
   */
  async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("[Controller] Fetching cache stats...");
      const stats = await this.cacheService.getStats();

      const response: ApiResponse<CacheStats> = {
        success: true,
        data: stats,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/cleanup
   * Cleanup old analyses (optional - can be used for maintenance)
   */
  async cleanup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const daysOld = parseInt(req.body.daysOld || "90", 10);
      console.log(`[Controller] Cleaning up analyses older than ${daysOld} days...`);

      const deletedCount = await this.cacheService.cleanup(daysOld);

      const response: ApiResponse<{ deletedCount: number }> = {
        success: true,
        data: { deletedCount },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/extract-pdf
   * Extract text from uploaded PDF file
   */
  async extractPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = (req as any).file;

      if (!file) {
        res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
        return;
      }

      if (file.mimetype !== "application/pdf" && !file.originalname.endsWith(".pdf")) {
        PDFService.cleanupFile(file.path);
        res.status(400).json({
          success: false,
          error: "Only PDF files are allowed",
        });
        return;
      }

      console.log(`[Controller] Extracting text from PDF: ${file.originalname}`);

      try {
        const text = await PDFService.extractText(file.path);

        const response: ApiResponse<{ text: string }> = {
          success: true,
          data: { text },
        };

        res.status(200).json(response);
      } finally {
        // Clean up temporary file
        PDFService.cleanupFile(file.path);
      }
    } catch (error) {
      // Clean up temp file on error
      const file = (req as any).file;
      if (file) {
        PDFService.cleanupFile(file.path);
      }
      next(error);
    }
  }
}
