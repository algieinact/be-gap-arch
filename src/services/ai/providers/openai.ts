import OpenAI from 'openai';
import type { Config } from '../../../config/env';

export async function completeWithOpenAI(
  prompt: string,
  config: Config
): Promise<string> {
  const client = new OpenAI({
    apiKey: config.openai?.apiKey,
  });
  const model = config.openai?.model ?? 'gpt-4o-mini';

  const response = await client.chat.completions.create({
    model,
    max_tokens: 4000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content in OpenAI response');
  }
  return content;
}
