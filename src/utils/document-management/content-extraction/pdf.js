import pdfParse from "pdf-parse";

/**
 * Extracts text content from a PDF file buffer
 * @param {ArrayBuffer} arrayBuffer - The array buffer containing the PDF data
 * @returns {Promise<string>} The extracted text content from the PDF, trimmed of whitespace
 * @throws {Error} If PDF parsing fails
 */
export async function extractTextFromPdf(arrayBuffer) {
  try {
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    return pdfData.text.replace(/\s+/g, " ").trim();
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}
