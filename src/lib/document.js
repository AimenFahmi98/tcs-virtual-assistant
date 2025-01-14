// import pdfParse from "pdf-parse";
// import mammoth from "mammoth";
// import { encode } from "gpt-tokenizer";

// /**
//  * Splits text into chunks of a given size.
//  * @param {string} text - The text to split.
//  * @param {number} chunkSize - The maximum size of each chunk in tokens.
//  * @returns {string[]} - An array of text chunks.
//  */
// function splitTextIntoChunks(text, chunkSize = 500) {
//   const tokens = encode(text);
//   const chunks = [];
//   for (let i = 0; i < tokens.length; i += chunkSize) {
//     const chunkTokens = tokens.slice(i, i + chunkSize);
//     chunks.push(chunkTokens.map((t) => t.text).join(" "));
//   }
//   return chunks;
// }

// /**
//  * Processes a file and extracts text chunks and metadata.
//  * @param {Buffer} fileBuffer - The file buffer to process.
//  * @param {string} fileName - The name of the file.
//  * @returns {Promise<{chunks: string[], metadata: object}>} - The text chunks and metadata.
//  */
// export async function processDocument(fileBuffer, fileName) {
//   if (!fileBuffer || !fileName) throw new Error("Invalid file input.");

//   const fileExtension = fileName.split(".").pop().toLowerCase();
//   const metadata = {
//     fileName,
//     fileSize: fileBuffer.byteLength, // In bytes
//     fileType: fileExtension,
//     numTokens: 0,
//     numChunks: 0,
//   };

//   let text = "";

//   try {
//     if (fileExtension === "pdf") {
//       const pdfData = await pdfParse(fileBuffer);
//       text = pdfData.text;
//     } else if (fileExtension === "docx") {
//       const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
//       text = docxData.value;
//     } else if (fileExtension === "txt") {
//       text = fileBuffer.toString("utf-8");
//     } else {
//       throw new Error(
//         "Unsupported file type. Supported types: .pdf, .docx, .txt",
//       );
//     }

//     // Split text into chunks and calculate metadata
//     const chunks = splitTextIntoChunks(text);
//     metadata.numTokens = encode(text).length;
//     metadata.numChunks = chunks.length;

//     return { chunks, metadata };
//   } catch (error) {
//     console.error("Error processing document:", error);
//     throw error;
//   }
// }
