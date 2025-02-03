import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get a single conversation by ID and user_id
export async function GET(request, { params }) {
  const supabase = await createClient();
  const { conversation_id, user_id } = await params;

  if (!conversation_id || !user_id) {
    return NextResponse.json(
      { error: "Conversation ID and User ID are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversation_id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Update a conversation title by ID and user_id
export async function PUT(request, { params }) {
  const supabase = await createClient();
  const { conversation_id, user_id } = await params;

  try {
    const { newTitle } = await request.json();

    if (!newTitle) {
      return NextResponse.json(
        { error: "New title is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("conversations")
      .update({ title: newTitle })
      .eq("id", conversation_id)
      .eq("user_id", user_id)
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

// Delete a conversation by ID and user_id
export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const { conversation_id, user_id } = await params;

  try {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversation_id)
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
