import mammoth from "mammoth";

/**
 * @fileoverview Handles DOCX text extraction using mammoth library.
 * @module utils/document-management/docx-processing
 */

/**
 * Extracts text content from a DOCX file.
 *
 * @async
 * @param {ArrayBuffer} arrayBuffer - Buffer containing DOCX file data
 * @returns {Promise<string>} Extracted text from the DOCX file
 * @throws {Error} When text extraction fails
 */
export async function extractTextFromDocx(arrayBuffer) {
  try {
    const result = await mammoth.extractRawText({
      buffer: arrayBuffer,
    });

    // Clean up the extracted text by removing extra whitespace
    const cleanedText = result.value.replace(/\s+/g, " ").trim();

    return cleanedText;
  } catch (error) {
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
}
