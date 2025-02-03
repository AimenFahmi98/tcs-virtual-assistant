import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { user_id, conversation_id, question_id } = await params;
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("answers")
      .select("*")
      .eq("user_id", user_id)
      .eq("conversation_id", conversation_id)
      .eq("question_id", question_id)
      .order("created_at", { ascending: false });

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

export async function POST(request, { params }) {
  const { user_id, conversation_id, question_id } = await params;
  const supabase = await createClient();

  try {
    const { content, filesUsedAsContext } = await request.json();

    const { data, error } = await supabase
      .from("answers")
      .insert([
        {
          content,
          conversation_id,
          user_id,
          question_id,
          filesUsedAsContext,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { user_id, conversation_id, question_id } = await params;
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("answers")
      .delete()
      .eq("user_id", user_id)
      .eq("conversation_id", conversation_id)
      .eq("question_id", question_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Answers deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
