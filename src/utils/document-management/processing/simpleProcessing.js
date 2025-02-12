import { extractTextFromPdf } from "@/utils/document-management/content-extraction/pdf";
import { extractTextFromDocx } from "@/utils/document-management/content-extraction/docx";
import { extractTextFromTxt } from "@/utils/document-management/content-extraction/txt";
import { tokenizeText } from "@/utils/document-management/tokenization/langchain-tokenization";

/**
 * Processes a document file and extracts its content into chunks for further processing.
 *
 * @param {File} file - The file object to process
 * @param {string} fileName - The name of the file including extension
 *
 * @returns {Promise<Object>} An object containing:
 *   - chunks: Array of text chunks after splitting
 *   - metadata: Object containing:
 *     - fileName: Original file name
 *     - fileSize: Size of file in bytes
 *     - fileType: File extension (pdf, docx, or txt)
 *     - numTokens: Total number of tokens in the text
 *     - numChunks: Number of chunks after splitting
 *
 * @throws {Error} If file type is not supported (only pdf, docx, and txt are supported)
 */
export async function processDocument(file, fileName) {
  const fileExtension = fileName.split(".").pop().toLowerCase();
  const metadata = {
    fileName,
    fileSize: file.size,
    fileType: fileExtension,
    numTokens: 0,
    numChunks: 0,
  };

  let text = "";

  const arrayBuffer = await file.arrayBuffer();

  if (fileExtension === "pdf") {
    text = await extractTextFromPdf(arrayBuffer);
  } else if (fileExtension === "docx") {
    text = await extractTextFromDocx(arrayBuffer);
  } else if (fileExtension === "txt") {
    text = await extractTextFromTxt(arrayBuffer);
  } else {
    throw new Error(
      "Unsupported file type. Supported types: .pdf, .docx, .txt",
    );
  }

  const { chunks, numTokens } = await tokenizeText(text, {
    chunkSize: 500,
    chunkOverlap: 50,
  });

  metadata.numTokens = numTokens;
  metadata.numChunks = chunks.length;

  return { chunks, metadata };
}
