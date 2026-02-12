import { AIResponseSchema, type AIResponse } from '../../schemas/analysis.schema';

/**
 * Extract JSON from AI response text and validate with Zod
 */
export function parseAndValidateAIResponse(text: string): AIResponse {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in AI response');
  }
  const parsed = JSON.parse(jsonMatch[0]);
  return AIResponseSchema.parse(parsed);
}
