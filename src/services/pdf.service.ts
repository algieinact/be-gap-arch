import * as fs from "fs";
import pdfParse from "pdf-parse"

export class PDFService {
  /**
   * Extract text from PDF file
   */
  static async extractText(filePath: string): Promise<string> {
    try {
      // Read file
      const fileBuffer = fs.readFileSync(filePath);

      // Check for PDF encryption (basic check - first 1KB for encryption marker)
      const fileStart = fileBuffer.toString("utf-8", 0, Math.min(1024, fileBuffer.length));
      if (fileStart.includes("/Encrypt") || fileStart.includes("/OpenAction")) {
        throw new Error("PDF is encrypted or password-protected. Please provide an unencrypted PDF.");
      }

      // Parse PDF using pdf-parse
      const data = await pdfParse(fileBuffer);

      // Extract text from all pages
      let fullText = data.text || "";

      if (!fullText.trim()) {
        console.warn("No text content found in PDF, returning error");
        throw new Error("PDF appears to be empty or contains no readable text.");
      }

      return fullText.trim();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to extract text from PDF";
      console.error("PDF extraction error:", errorMsg);

      // Re-throw specific errors
      if (errorMsg.includes("encrypted") || errorMsg.includes("password")) {
        throw new Error(errorMsg);
      }

      if (errorMsg.includes("empty")) {
        throw new Error(errorMsg);
      }

      // Generic error for other issues
      throw new Error("Invalid PDF file or corrupted data");
    }
  }

  /**
   * Clean up temporary file
   */
  static cleanupFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.warn(`Could not delete temporary file: ${filePath}`, error);
    }
  }
}
