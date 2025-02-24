import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get a single answer by ID
export async function GET(request, { params }) {
  const supabase = await createClient();
  const { user_id, conversation_id, question_id, answer_id } = await params;

  if (!user_id || !conversation_id || !question_id || !answer_id) {
    return NextResponse.json(
      {
        error:
          "user_id, conversation_id, question_id and answer_id are required",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("user_id", user_id)
    .eq("conversation_id", conversation_id)
    .eq("question_id", question_id)
    .eq("id", answer_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Partially update an answer by ID
export async function PATCH(request, { params }) {
  const supabase = await createClient();
  const { user_id, conversation_id, question_id, answer_id } = await params;

  try {
    const { content, filesUsedAsContext } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Answer content is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("answers")
      .update({ content, filesUsedAsContext })
      .eq("user_id", user_id)
      .eq("conversation_id", conversation_id)
      .eq("question_id", question_id)
      .eq("id", answer_id)
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

// Update an answer by ID
export async function PUT(request, { params }) {
  const supabase = await createClient();
  const { user_id, conversation_id, question_id, answer_id } = await params;

  try {
    const { content, filesUsedAsContext } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Answer content is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("answers")
      .update({ content, filesUsedAsContext })
      .eq("user_id", user_id)
      .eq("conversation_id", conversation_id)
      .eq("question_id", question_id)
      .eq("id", answer_id)
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

// Delete an answer by ID
export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const { user_id, conversation_id, question_id, answer_id } = await params;

  try {
    const { error } = await supabase
      .from("answers")
      .delete()
      .eq("user_id", user_id)
      .eq("conversation_id", conversation_id)
      .eq("question_id", question_id)
      .eq("id", answer_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Answer deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
