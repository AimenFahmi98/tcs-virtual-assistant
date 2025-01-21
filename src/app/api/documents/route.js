/**
 * @fileoverview Handles document processing, embedding generation, and storage operations for the TCS Virtual Assistant.
 * @module documents/route
 *
 * @typedef {Object} ProcessedDocument
 * @property {string[]} chunks - Array of text chunks from the processed document
 * @property {Object} metadata - Document metadata
 * @property {string} metadata.fileName - Name of the file
 * @property {number} metadata.fileSize - Size of the file in bytes
 * @property {string} metadata.fileType - File extension/type
 * @property {number} metadata.numTokens - Number of tokens in the document
 * @property {number} metadata.numChunks - Number of chunks the document was split into
 *
 * @typedef {Object} EmbeddingResult
 * @property {string} id - Unique identifier for the embedding
 * @property {string} chunk - Text content of the chunk
 * @property {number[]} embedding - Vector embedding of the chunk
 *
 * @function extractTextFromPDF
 * @async
 * @param {ArrayBuffer} arrayBuffer - Buffer containing PDF data
 * @returns {Promise<string>} Extracted text from the PDF
 *
 * @function processDocument
 * @async
 * @param {File} file - The uploaded file to process
 * @param {string} fileName - Name of the file
 * @returns {Promise<ProcessedDocument>} Processed document chunks and metadata
 *
 * @function POST
 * @async
 * @param {Request} request - The incoming HTTP request containing the file
 * @returns {Promise<Response>} JSON response indicating success or failure
 * @throws {Error} When file processing or storage operations fail
 */
import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import mammoth from "mammoth";
import { encode } from "gpt-tokenizer";
import pdfParse from "pdf-parse";
import {
  uploadFileToSupabase,
  addDocumentToSupabase,
  storeChunksInSupabase,
} from "@/lib/supabase";
import PineconeController from "@/lib/pinecone";
import OpenaiController from "@/lib/openai";

/**
 * @constant {OpenaiController} openai
 * Instance of OpenaiController used for handling OpenAI API operations
 */
const openai = new OpenaiController();
/**
 * @constant {PineconeController} pinecone - Instance of PineconeController class
 * responsible for managing interactions with the Pinecone vector database service.
 */
const pinecone = new PineconeController();

/**
 * Extracts text content from a PDF file buffer
 * @param {ArrayBuffer} arrayBuffer - The array buffer containing the PDF data
 * @returns {Promise<string>} The extracted text content from the PDF, trimmed of whitespace
 * @throws {Error} If PDF parsing fails
 */
async function extractTextFromPDF(arrayBuffer) {
  const buffer = Buffer.from(arrayBuffer);
  const pdfData = await pdfParse(buffer);
  return pdfData.text.trim();
}

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
    text = await extractTextFromPDF(arrayBuffer);
  } else if (fileExtension === "docx") {
    const docxData = await mammoth.extractRawText({ buffer: arrayBuffer });
    text = docxData.value;
  } else if (fileExtension === "txt") {
    text = new TextDecoder("utf-8").decode(arrayBuffer);
  } else {
    throw new Error(
      "Unsupported file type. Supported types: .pdf, .docx, .txt",
    );
  }

  text = text.replace(/\s+/g, " ").trim();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const chunks = await splitter.splitText(text);

  metadata.numTokens = encode(text).length;
  metadata.numChunks = chunks.length;

  return { chunks, metadata };
}

/**
 * Handles POST requests for document processing and storage.
 * This function processes uploaded files by:
 * 1. Validating and uploading the file to Supabase storage
 * 2. Processing the document to extract chunks and metadata
 * 3. Storing document metadata in Supabase
 * 4. Generating embeddings using OpenAI
 * 5. Storing embeddings in Pinecone
 * 6. Storing document chunks in Supabase
 *
 * @async
 * @param {Request} request - The incoming HTTP request containing form data with a file
 * @returns {Promise<Response>} JSON response indicating success or failure
 *   - success: true/false
 *   - message: Status message
 *   - status: 200 for success, 400 for invalid input, 500 for server errors
 * @throws {Error} When file processing, upload, or storage operations fail
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: "No valid file provided." },
        { status: 400 },
      );
    }

    // Upload file to Supabase storage
    const supabaseUploadFileResponse = await uploadFileToSupabase(
      file,
      "documents",
    );
    if (!supabaseUploadFileResponse.success) {
      if (supabaseUploadFileResponse.path) {
        return NextResponse.json(
          { success: true, message: "File already exists." },
          { status: 200 },
        );
      }
      throw new Error("Error uploading file to Supabase storage.");
    }

    const { chunks, metadata } = await processDocument(file, file.name);

    // Store document metadata in Supabase
    const supabaseResult = await addDocumentToSupabase({
      name: metadata.fileName,
      size: metadata.fileSize,
      type: metadata.fileType,
      path: supabaseUploadFileResponse.path,
      nbChunks: metadata.numChunks,
      isSelectedForRAG: false,
    });

    if (!supabaseResult.success) {
      throw new Error(
        `Error storing document metadata: ${supabaseResult.error}`,
      );
    }

    const documentId = supabaseResult.data.id;
    console.log(documentId);

    // Generate and store embeddings in Pinecone
    const embeddings = await openai.generateOpenAIEmbeddings(
      chunks,
      metadata.fileName,
    );

    await pinecone.storeEmbeddings(embeddings, metadata.fileName);

    const chunksToStore = embeddings.map((embedding) => ({
      id: embedding.id,
      documentId,
      content: embedding.chunk,
    }));
    const supabaseStoreChunksResponse =
      await storeChunksInSupabase(chunksToStore);

    if (!supabaseStoreChunksResponse.success) {
      throw new Error(
        `Error storing chunks in Supabase: ${supabaseStoreChunksResponse.error}`,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document processed and uploaded successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
