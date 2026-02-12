import { config } from '../config/env';
import { buildGapAnalysisPrompt } from './ai/prompt';
import { parseAndValidateAIResponse } from './ai/parseResponse';
import { completeWithAnthropic } from './ai/providers/anthropic';
import { completeWithOpenAI } from './ai/providers/openai';
import { completeWithGemini } from './ai/providers/gemini';
import type { AIResponse } from '../schemas/analysis.schema';

const PROVIDER_NAMES: Record<string, string> = {
  anthropic: 'Claude (Anthropic)',
  openai: 'OpenAI',
  gemini: 'Google Gemini',
};

export class AIService {
  private provider = config.ai.provider;

  /**
   * Analyze gap between resume and job description using configured AI provider
   */
  async analyzeGap(
    resumeText: string,
    jobDescriptionText: string
  ): Promise<AIResponse> {
    const prompt = buildGapAnalysisPrompt(resumeText, jobDescriptionText);
    const providerName = PROVIDER_NAMES[this.provider] ?? this.provider;

    try {
      console.log(`[AI Service] Calling ${providerName}...`);
      const startTime = Date.now();

      let text: string;
      if (this.provider === 'anthropic') {
        text = await completeWithAnthropic(prompt, config);
      } else if (this.provider === 'openai') {
        text = await completeWithOpenAI(prompt, config);
      } else if (this.provider === 'gemini') {
        text = await completeWithGemini(prompt, config);
      } else {
        throw new Error(`Unsupported AI provider: ${this.provider}`);
      }

      const duration = Date.now() - startTime;
      console.log(`[AI Service] ${providerName} completed in ${duration}ms`);

      const validated = parseAndValidateAIResponse(text);
      console.log('[AI Service] Response validated successfully');
      return validated;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('[AI Service] Error:', message);
      throw new Error(`AI API Error: ${message}`);
    }
  }
}
