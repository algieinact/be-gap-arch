import crypto from 'crypto';

export class HashService {
  /**
   * Generate SHA-256 hash from resume and job description
   * This serves as cache key for duplicate detection
   */
  static generateCacheKey(resumeText: string, jobDescriptionText: string): string {
    const normalized = this.normalizeText(resumeText) + '|||' + this.normalizeText(jobDescriptionText);
    return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
  }

  /**
   * Normalize text to ensure consistent hashing
   * - Trim whitespace
   * - Convert to lowercase
   * - Remove extra spaces
   * - Remove line breaks variations
   */
  private static normalizeText(text: string): string {
    return text
      .trim()
      .toLowerCase()
      .replace(/\r\n/g, '\n') // Normalize line breaks
      .replace(/\s+/g, ' '); // Collapse multiple spaces
  }

  /**
   * Validate if a string is a valid SHA-256 hash
   */
  static isValidHash(hash: string): boolean {
    return /^[a-f0-9]{64}$/i.test(hash);
  }
}
