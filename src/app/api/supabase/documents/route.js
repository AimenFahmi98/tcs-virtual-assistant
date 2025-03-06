// /**
//  * @fileoverview Handles document processing, embedding generation, and storage operations for the TCS Virtual Assistant.
//  * @module documents/route
//  *
//  * @typedef {Object} ProcessedDocument
//  * @property {string[]} chunks - Array of text chunks from the processed document
//  * @property {Object} metadata - Document metadata
//  * @property {string} metadata.fileName - Name of the file
//  * @property {number} metadata.fileSize - Size of the file in bytes
//  * @property {string} metadata.fileType - File extension/type
//  * @property {number} metadata.numTokens - Number of tokens in the document
//  * @property {number} metadata.numChunks - Number of chunks the document was split into
//  *
//  * @typedef {Object} EmbeddingResult
//  * @property {string} id - Unique identifier for the embedding
//  * @property {string} chunk - Text content of the chunk
//  * @property {number[]} embedding - Vector embedding of the chunk
//  *
//  * @function extractTextFromPDF
//  * @async
//  * @param {ArrayBuffer} arrayBuffer - Buffer containing PDF data
//  * @returns {Promise<string>} Extracted text from the PDF
//  *
//  * @function processDocument
//  * @async
//  * @param {File} file - The uploaded file to process
//  * @param {string} fileName - Name of the file
//  * @returns {Promise<ProcessedDocument>} Processed document chunks and metadata
//  *
//  * @function POST
//  * @async
//  * @param {Request} request - The incoming HTTP request containing the file
//  * @returns {Promise<Response>} JSON response indicating success or failure
//  * @throws {Error} When file processing or storage operations fail
//  */
// import { NextResponse } from "next/server";
// import {
//   uploadFileToSupabase,
//   addDocumentToSupabase,
//   storeChunksInSupabase,
// } from "@/lib/supabase";
// import PineconeController from "@/lib/pinecone";
// import OpenaiController from "@/lib/openai";
// import { processDocument } from "@/utils/document-management/processing/simpleProcessing";
// import { createClient } from "@/utils/supabase/server";

// /**
//  * @constant {OpenaiController} openai
//  * Instance of OpenaiController used for handling OpenAI API operations
//  */
// const openai = new OpenaiController();
// /**
//  * @constant {PineconeController} pinecone - Instance of PineconeController class
//  * responsible for managing interactions with the Pinecone vector database service.
//  */
// const pinecone = new PineconeController();

// /**
//  * Retrieves all documents from the database.
//  * @async
//  * @returns {Promise<Object>} Result object containing:
//  * @returns {boolean} .success - Whether the operation was successful
//  * @returns {Array|null} .data - Array of document objects if found
//  * @returns {string|null} .error - Error message if any
//  */
// export async function GET() {
//   try {
//     const supabase = await createClient();
//     // Query documents with optional ordering
//     const { data, error } = await supabase
//       .from("documents")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error("Error fetching documents:", error.message);
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Failed to fetch documents",
//           details: error.message,
//         },
//         { status: 500 },
//       );
//     }

//     if (!data || data.length === 0) {
//       return NextResponse.json(
//         {
//           success: true,
//           data: [],
//           message: "No documents found",
//         },
//         { status: 200 },
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         data,
//         count: data.length,
//         message: "Documents retrieved successfully",
//       },
//       { status: 200 },
//     );
//   } catch (err) {
//     console.error("Unexpected error fetching documents:", err);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Internal server error",
//         details: err.message,
//       },
//       { status: 500 },
//     );
//   }
// }

// /**
//  * Handles POST requests for document processing and storage.
//  * This function processes uploaded files by:
//  * 1. Validating and uploading the file to Supabase storage
//  * 2. Processing the document to extract chunks and metadata
//  * 3. Storing document metadata in Supabase
//  * 4. Generating embeddings using OpenAI
//  * 5. Storing embeddings in Pinecone
//  * 6. Storing document chunks in Supabase
//  *
//  * @async
//  * @param {Request} request - The incoming HTTP request containing form data with a file
//  * @returns {Promise<Response>} JSON response indicating success or failure
//  *   - success: true/false
//  *   - message: Status message
//  *   - status: 200 for success, 400 for invalid input, 500 for server errors
//  * @throws {Error} When file processing, upload, or storage operations fail
//  */
// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file");

//     if (!file || !(file instanceof Blob)) {
//       return NextResponse.json(
//         { success: false, message: "No valid file provided." },
//         { status: 400 },
//       );
//     }

//     const { chunks, metadata } = await processDocument(file, file.name);

//     // Store document metadata in Supabase
//     const supabaseResult = await addDocumentToSupabase({
//       name: metadata.fileName,
//       size: metadata.fileSize,
//       type: metadata.fileType,
//       path: supabaseUploadFileResponse.path,
//       nbChunks: metadata.numChunks,
//       isSelectedForRAG: false,
//     });

//     if (!supabaseResult.success) {
//       throw new Error(
//         `Error storing document metadata: ${supabaseResult.error}`,
//       );
//     }

//     const documentId = supabaseResult.data.id;

//     // Generate and store embeddings in Pinecone
//     const embeddings = await openai.generateOpenAIEmbeddings(
//       chunks,
//       metadata.fileName,
//     );

//     await pinecone.storeEmbeddings(embeddings, metadata.fileName);

//     const chunksToStore = embeddings.map((embedding) => ({
//       id: embedding.id,
//       documentId,
//       content: embedding.chunk,
//     }));
//     const supabaseStoreChunksResponse =
//       await storeChunksInSupabase(chunksToStore);

//     if (!supabaseStoreChunksResponse.success) {
//       throw new Error(
//         `Error storing chunks in Supabase: ${supabaseStoreChunksResponse.error}`,
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Document processed and uploaded successfully.",
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Error processing document:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 },
//     );
//   }
// }
