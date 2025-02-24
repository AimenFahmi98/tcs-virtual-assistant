import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get a single question by ID
export async function GET(request, { params }) {
  const supabase = await createClient();
  const { user_id, conversation_id, question_id } = await params;

  if (!user_id || !conversation_id || !question_id) {
    return NextResponse.json(
      { error: "user_id, conversation_id and question_id are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("user_id", user_id)
    .eq("conversation_id", conversation_id)
    .eq("id", question_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Update a question by ID
export async function PUT(request, { params }) {
  const supabase = await createClient();
  const { user_id, conversation_id, question_id } = await params;

  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Question content is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("questions")
      .update({ content })
      .eq("user_id", user_id)
      .eq("conversation_id", conversation_id)
      .eq("id", question_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Delete a question by ID
export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const { user_id, conversation_id, question_id } = await params;

  try {
    const { data, error } = await supabase
      .from("questions")
      .delete()
      .eq("user_id", user_id)
      .eq("conversation_id", conversation_id)
      .eq("id", question_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
