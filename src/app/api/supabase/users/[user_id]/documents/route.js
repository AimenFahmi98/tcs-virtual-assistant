import { createClient } from "@/utils/supabase/server";
import PineconeController from "@/lib/pinecone";
import OpenaiController from "@/lib/openai";
import { NextResponse } from "next/server";
import { processDocument } from "@/utils/document-management/processing/simpleProcessing";

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

export async function GET(request, { params }) {
  const { user_id } = await params;
  const supabase = await createClient();

  try {
    // First, get all roles for the user
    const { data: userRoles, error: userRolesError } = await supabase
      .from("user_roles")
      .select("role_id")
      .eq("user_id", user_id);

    if (userRolesError) {
      return NextResponse.json(
        { error: userRolesError.message },
        { status: 500 },
      );
    }

    // Extract role IDs
    const roleIds = userRoles.map((role) => role.role_id);

    if (roleIds.length === 0) {
      return NextResponse.json({ documents: [] });
    }

    // Get all documents that have roles matching the user's roles
    const { data: documents, error: documentsError } = await supabase
      .from("documents")
      .select(
        `
        *,
        document_roles!inner (
          role_id
        )
      `,
      )
      .in("document_roles.role_id", roleIds);

    if (documentsError) {
      return NextResponse.json(
        { error: documentsError.message },
        { status: 500 },
      );
    }

    // Remove duplicate documents and clean up the response
    const uniqueDocuments = Array.from(new Set(documents.map((doc) => doc.id)))
      .map((id) => documents.find((doc) => doc.id === id))
      .map(({ document_roles, ...doc }) => doc); // Remove the document_roles from the response

    return NextResponse.json({ documents: uniqueDocuments });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
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
export async function POST(request, { params }) {
  try {
    const supabase = await createClient();
    const { user_id } = await params;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: "No valid file provided." },
        { status: 400 },
      );
    }

    const { chunks, metadata } = await processDocument(file, file.name);

    // Create document record in database
    const { data: documentData, error: dbError } = await supabase
      .from("documents")
      .insert([
        {
          name: metadata.fileName,
          size: metadata.fileSize,
          type: metadata.fileType,
          path: supabaseUploadFileResponse.path,
          nbChunks: metadata.numChunks,
        },
      ])
      .select()
      .single();

    if (dbError) {
      // Cleanup: delete file from storage if database insert fails
      await supabase.storage.from("documents").remove([filePath]);
      return NextResponse.json(
        { success: false, message: "Error creating document record" },
        { status: 500 },
      );
    }

    const documentId = documentData.data.id;

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

    // Store chunks in Supabase using the POST endpoint
    const response = await fetch(
      `/api/supabase/users/${user_id}/documents/${documentId}/text-chunks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          chunksToStore.map((chunk) => ({
            pineconeId: `${chunk.documentId}_${chunk.id}`,
            content: chunk.content,
            document_id: chunk.documentId,
          })),
        ),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error storing chunks in Supabase: ${error.error}`);
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
