import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import mammoth from "mammoth";
import { encode } from "gpt-tokenizer";
import pdfParse from "pdf-parse";
import { uploadFileToSupabase, addDocumentToSupabase } from "@/lib/supabase";
import PineconeController from "@/lib/pinecone";
import OpenaiController from "@/lib/openai";

const openai = new OpenaiController();
const pinecone = new PineconeController();

// Function to extract text from a PDF using pdf-parse
async function extractTextFromPDF(arrayBuffer) {
  const buffer = Buffer.from(arrayBuffer);
  const pdfData = await pdfParse(buffer);
  return pdfData.text.trim();
}

// Processes the document and splits it into chunks
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

    const { chunks, metadata } = await processDocument(file, file.name);

    // Upload file to Supabase storage
    const uploadResult = await uploadFileToSupabase(file, "documents");
    if (!uploadResult.success) {
      throw new Error(`File upload failed: ${uploadResult.error}`);
    }

    // Store document metadata in Supabase
    const supabaseResult = await addDocumentToSupabase({
      name: metadata.fileName,
      size: metadata.fileSize,
      type: metadata.fileType,
      path: uploadResult.path,
      nbChunks: metadata.numChunks,
      isSelectedForRAG: false,
    });

    if (!supabaseResult.success) {
      throw new Error(
        `Error storing document metadata: ${supabaseResult.error}`,
      );
    }

    // Generate and store embeddings in Pinecone
    const embeddings = await openai.generateOpenAIEmbeddings(chunks);
    await pinecone.storeEmbeddings(embeddings, metadata.fileName);

    return NextResponse.json({
      success: true,
      message: "Document processed and uploaded successfully.",
    });
  } catch (error) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
