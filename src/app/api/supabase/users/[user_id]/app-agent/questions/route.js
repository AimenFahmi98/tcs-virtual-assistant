import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET - Fetch all questions for a specific user
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { user_id } = await params;
    const { data, error } = await supabase
      .from("agent_questions")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new question
export async function POST(request, { params }) {
  try {
    const supabase = await createClient();
    const { user_id } = await params;
    const body = await request.json();
    const { data, error } = await supabase
      .from("agent_questions")
      .insert({ ...body, user_id })
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a question
export async function PUT(request, { params }) {
  try {
    const supabase = await createClient();
    const { user_id } = await params;
    const body = await request.json();
    const { question_id, ...updateData } = body;

    const { data, error } = await supabase
      .from("agent_questions")
      .update(updateData)
      .eq("question_id", question_id)
      .eq("user_id", user_id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete all questions for a user
export async function DELETE(_request, { params }) {
  try {
    const supabase = await createClient();
    const { user_id } = await params;

    const { error } = await supabase
      .from("agent_questions")
      .delete()
      .eq("user_id", user_id);

    if (error) throw error;
    return NextResponse.json({
      message: "All questions deleted successfully for user",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
