import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get all roles
export async function GET() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from("roles").select("*");

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

// Create a new role
export async function POST(request) {
  const supabase = await createClient();
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Role name is required" },
        { status: 400 },
      );
    }

    // Check if role already exists
    const { data: existing } = await supabase
      .from("roles")
      .select()
      .eq("name", name)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Role already exists" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("roles")
      .insert([{ name, description }])
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

// Delete all roles
export async function DELETE_ALL() {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from("roles").delete().neq("id", 0);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "All roles deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
