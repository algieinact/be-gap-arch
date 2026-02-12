import Anthropic from '@anthropic-ai/sdk';
import type { Config } from '../../../config/env';

export async function completeWithAnthropic(
  prompt: string,
  config: Config
): Promise<string> {
  const client = new Anthropic({
    apiKey: config.anthropic.apiKey,
  });
  const model = config.anthropic.model;

  const response = await client.messages.create({
    model,
    max_tokens: 4000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in AI response');
  }
  return textBlock.text;
}
