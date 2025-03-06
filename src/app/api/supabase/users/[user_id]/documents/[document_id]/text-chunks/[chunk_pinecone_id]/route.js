import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  try {
    const supabase = await createClient();

    const { chunk_pinecone_id } = await params;

    const { data: chunk, error } = await supabase
      .from("document_chunks")
      .select("*")
      .eq("pineconeId", chunk_pinecone_id)
      .single();

    if (error) {
      console.log("Error fetching chunk:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!chunk) {
      return NextResponse.json({ error: "Chunk not found" }, { status: 404 });
    }

    return NextResponse.json(chunk);
  } catch (error) {
    console.log("Error fetching chunk:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
