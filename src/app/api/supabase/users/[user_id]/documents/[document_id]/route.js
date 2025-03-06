import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Deletes a document and its associated data from storage
 * @param {Request} request - The incoming HTTP request
 * @param {Object} params - URL parameters containing document_id
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export async function DELETE(_, { params }) {
  try {
    const { document_id } = await params;

    if (!document_id) {
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
      .eq("id", document_id)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 },
      );
    }

    // Delete the file from storage
    const { data, error: storageError } = await supabase.storage
      .from("documents")
      .remove([document.path]);

    if (storageError) {
      return NextResponse.json(
        { success: false, message: "Error deleting file from storage" },
        { status: 500 },
      );
    }

    const { data: files, error } = await supabase.storage
      .from("documents")
      .list("uploads");

    console.log("Files in bucket:", files);

    console.log("Deleted file from storage:", data);

    // Delete the document record from the database
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", document_id);

    if (deleteError) {
      return NextResponse.json(
        { success: false, message: "Error deleting document record" },
        { status: 500 },
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

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file || !userId) {
      return NextResponse.json(
        { success: false, message: "File and user ID are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const fileName = `${file.name}`;
    const filePath = `uploads/${fileName}`;

    // Upload file to storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (storageError) {
      return NextResponse.json(
        { success: false, message: "Error uploading file to storage" },
        { status: 500 },
      );
    }

    // Create document record in database
    const { data: documentData, error: dbError } = await supabase
      .from("documents")
      .insert([
        {
          name: file.name,
          path: filePath,
          user_id: userId,
          size: file.size,
          type: file.type,
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

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully",
        document: documentData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
