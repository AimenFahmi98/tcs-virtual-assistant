import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { user_id } = await params;
  const supabase = await createClient();

  try {
    // Get document IDs from user_rag_files table
    const { data: userRagFiles, error: ragFilesError } = await supabase
      .from("user_rag_files")
      .select("document_id")
      .eq("user_id", user_id);

    if (ragFilesError) {
      return NextResponse.json(
        { error: ragFilesError.message },
        { status: 500 },
      );
    }

    if (!userRagFiles || userRagFiles.length === 0) {
      return NextResponse.json({ documents: [] });
    }

    // Extract document IDs
    const documentIds = userRagFiles.map((file) => file.document_id);

    // Get the full document objects
    const { data: documents, error: documentsError } = await supabase
      .from("documents")
      .select("*")
      .in("id", documentIds);

    if (documentsError) {
      return NextResponse.json(
        { error: documentsError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  const { user_id } = await params;
  const { document_id } = await request.json();
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("user_rag_files")
      .insert([{ user_id, document_id }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { user_id } = await params;
  const { document_id } = await request.json();
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("user_rag_files")
      .delete()
      .match({ user_id, document_id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
