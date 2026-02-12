import { Router } from "express";
import multer from "multer";
import { AnalysisController } from "../controllers/analysis.controller";
import { asyncHandler } from "../middlewares/errorHandler";

const router = Router();
const controller = new AnalysisController();

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit (changed from 10MB)
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

/**
 * POST /api/analyze
 * Analyze resume vs job description
 */
router.post(
  "/analyze",
  asyncHandler((req, res, next) => controller.analyze(req, res, next)),
);

/**
 * GET /api/stats
 * Get cache statistics
 */
router.get(
  "/stats",
  asyncHandler((req, res, next) => controller.getStats(req, res, next)),
);

/**
 * POST /api/cleanup
 * Cleanup old analyses (optional maintenance endpoint)
 */
router.post(
  "/cleanup",
  asyncHandler((req, res, next) => controller.cleanup(req, res, next)),
);

/**
 * POST /api/extract-pdf
 * Extract text from PDF file
 */
router.post(
  "/extract-pdf",
  upload.single("file"),
  asyncHandler((req, res, next) => controller.extractPdf(req, res, next)),
);

export default router;
