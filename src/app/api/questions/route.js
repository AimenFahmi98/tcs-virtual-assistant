import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const supabase = await createClient();
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("conversationId", conversationId);

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

export async function POST(request) {
  const supabase = await createClient();
  try {
    const { content, conversationId, userId } = await request.json();

    if (!content || !conversationId || !userId) {
      return NextResponse.json(
        { error: "Content, conversationId, and userId are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("questions")
      .insert([{ content, conversationId, user_id: userId }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  const supabase = await createClient();
  try {
    const { questionId, userId } = await request.json();

    if (!questionId || !userId) {
      return NextResponse.json(
        { error: "Question ID and User ID are required" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", questionId)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
