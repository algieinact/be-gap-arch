import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Config } from '../../../config/env';

export async function completeWithGemini(
  prompt: string,
  config: Config
): Promise<string> {
  const apiKey = config.gemini?.apiKey;
  if (!apiKey) throw new Error('Gemini API key is not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: config.gemini?.model ?? 'gemini-1.5-flash',
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  if (!text) {
    throw new Error('No text in Gemini response');
  }
  return text;
}
