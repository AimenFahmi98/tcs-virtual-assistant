import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET - Fetch a specific question
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { user_id, question_id } = await params;

    const { data, error } = await supabase
      .from("agent_questions")
      .select("*")
      .eq("user_id", user_id)
      .eq("question_id", question_id)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a specific question
export async function PUT(request, { params }) {
  try {
    const supabase = await createClient();
    const { user_id, question_id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from("agent_questions")
      .update(body)
      .eq("question_id", question_id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a specific question
export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    const { user_id, question_id } = await params;

    const { error } = await supabase
      .from("agent_questions")
      .delete()
      .eq("question_id", question_id)
      .eq("user_id", user_id);

    if (error) throw error;
    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
