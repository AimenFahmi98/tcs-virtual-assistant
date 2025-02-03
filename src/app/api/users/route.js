import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get all users
export async function GET() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from("user_profiles").select("*");

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

// Create a new user
export async function POST(request) {
  const supabase = await createClient();
  try {
    const { email, full_name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const { data: existing } = await supabase
      .from("user_profiles")
      .select()
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .insert([{ email, full_name }])
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

export async function DELETE_ALL() {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("user_profiles")
      .delete()
      .neq("id", 0); // This will match all rows

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "All users deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
