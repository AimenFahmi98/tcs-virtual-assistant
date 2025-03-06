import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { user_id, document_id } = await params;

    if (!document_id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 },
      );
    }

    // Fetch text chunks for the specific document
    const { data: textChunks, error } = await supabase
      .from("document_chunks")
      .select("*")
      .eq("document_id", document_id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch text chunks" },
        { status: 500 },
      );
    }

    if (!textChunks || textChunks.length === 0) {
      return NextResponse.json(
        { message: "No text chunks found for this document" },
        { status: 404 },
      );
    }

    return NextResponse.json(textChunks);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  try {
    const supabase = await createClient();
    const { document_id } = await params;
    const textChunks = await request.json();

    if (!Array.isArray(textChunks)) {
      return NextResponse.json(
        { error: "Request body must be an array of text chunks" },
        { status: 400 },
      );
    }

    const chunks = textChunks.map((chunk) => ({
      pineconeId: chunk.pineconeId,
      content: chunk.content,
      document_id: document_id,
    }));

    const { data, error } = await supabase
      .from("document_chunks")
      .upsert(chunks);

    if (error) {
      return NextResponse.json(
        { error: "Failed to store text chunks" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Text chunks stored successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
