import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { encode } from "gpt-tokenizer";

/**
 * @fileoverview Handles text tokenization and chunking using LangChain
 * @module utils/document-management/tokenization/langchain-tokenization
 */

/**
 * Tokenizes and splits text into manageable chunks
 *
 * @param {string} text - Raw text content to be processed
 * @param {Object} options - Configuration options for text splitting
 * @param {number} options.chunkSize - Maximum size of each chunk (default: 500)
 * @param {number} options.chunkOverlap - Overlap between chunks (default: 50)
 * @returns {Promise<Object>} Object containing chunks and tokenization info
 * @property {string[]} chunks - Array of text chunks after splitting
 * @property {number} numTokens - Total number of tokens in the text
 * @property {number} numChunks - Number of chunks generated
 */
export async function tokenizeText(
  text,
  options = { chunkSize: 500, chunkOverlap: 50 },
) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid input: text must be a non-empty string");
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: options.chunkSize,
    chunkOverlap: options.chunkOverlap,
  });

  const chunks = await splitter.splitText(text);
  const numTokens = encode(text).length;

  return {
    chunks,
    numTokens,
  };
}
