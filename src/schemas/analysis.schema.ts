import { z } from 'zod';

// Input validation schema
export const AnalysisRequestSchema = z.object({
  resumeText: z
    .string()
    .min(50, 'Resume must be at least 50 characters')
    .max(50000, 'Resume must not exceed 50,000 characters'),
  jobDescriptionText: z
    .string()
    .min(20, 'Job description must be at least 20 characters')
    .max(20000, 'Job description must not exceed 20,000 characters'),
});

export type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>;

// AI Response validation schema
export const AIResponseSchema = z.object({
  missing_skills: z
    .array(z.string())
    .min(1, 'Must have at least one missing skill')
    .max(20, 'Too many missing skills'),
  learning_steps: z
    .array(z.string())
    .length(3, 'Must have exactly 3 learning steps'),
  interview_questions: z
    .array(z.string())
    .length(3, 'Must have exactly 3 interview questions'),
  roadmap_markdown: z
    .string()
    .min(100, 'Roadmap must be detailed (at least 100 characters)'),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

// Database model response schema
export const AnalysisResponseSchema = z.object({
  id: z.string(),
  missingSkills: z.array(z.string()),
  learningSteps: z.array(z.string()),
  interviewQuestions: z.array(z.string()),
  roadmapMarkdown: z.string(),
  createdAt: z.date(),
});

export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;
