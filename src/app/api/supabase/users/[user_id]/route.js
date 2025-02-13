import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get a specific user by ID
export async function GET(request, { params }) {
  const supabase = await createClient();
  const { user_id } = await params;

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (error) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Update a user's information by ID
export async function PATCH(request, { params }) {
  const supabase = await createClient();
  const id = (await params).id;

  try {
    const { email, full_name, role } = await request.json();

    const { data, error } = await supabase
      .from("user_profiles")
      .update({ email, full_name, role })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Delete a specific user by ID
export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const id = (await params).id;

  try {
    const { error } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
