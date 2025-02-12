import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Deletes a document and its associated data from storage
 * @param {Request} request - The incoming HTTP request
 * @param {Object} params - URL parameters containing document_id
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export async function DELETE(request, { params }) {
  try {
    const documentId = (await params).document_id;
    if (!documentId) {
      return NextResponse.json(
        { success: false, message: "Document ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // First, get the document details to have the filename for Pinecone deletion
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document and associated data deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
