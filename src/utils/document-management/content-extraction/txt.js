/**
 * @fileoverview Handles TXT text extraction using TextDecoder.
 * @module utils/document-management/txt-processing
 */

/**
 * Extracts text content from a TXT file.
 *
 * @async
 * @param {ArrayBuffer} arrayBuffer - Buffer containing TXT file data
 * @returns {Promise<string>} Extracted text from the TXT file
 * @throws {Error} When text extraction fails
 */
export async function extractTextFromTxt(arrayBuffer) {
  try {
    // Use TextDecoder to convert the array buffer to string
    const text = new TextDecoder("utf-8").decode(arrayBuffer);

    // Clean up the extracted text by removing extra whitespace
    const cleanedText = text.replace(/\s+/g, " ").trim();

    return cleanedText;
  } catch (error) {
    throw new Error(`Failed to extract text from TXT: ${error.message}`);
  }
}
