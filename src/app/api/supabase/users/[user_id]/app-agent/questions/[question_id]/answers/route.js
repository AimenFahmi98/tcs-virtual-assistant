import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET - Fetch all answers for a specific question
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { question_id } = await params;

    const { data, error } = await supabase
      .from("agent_answers")
      .select("*")
      .eq("question_id", question_id);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new answer for a question
export async function POST(request, { params }) {
  try {
    const supabase = await createClient();
    const { question_id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from("agent_answers")
      .insert({ ...body, question_id })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a specific answer
export async function PUT(request, { params }) {
  try {
    const supabase = await createClient();
    const { answer_id } = await request.json();
    const body = await request.json();

    const { data, error } = await supabase
      .from("agent_answers")
      .update(body)
      .eq("answer_id", answer_id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a specific answer
export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    const { answer_id } = await request.json();

    const { error } = await supabase
      .from("agent_answers")
      .delete()
      .eq("answer_id", answer_id);

    if (error) throw error;
    return NextResponse.json({ message: "Answer deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
