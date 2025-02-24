import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get theme for a specific user
export async function GET(request, { params }) {
  const supabase = await createClient();
  const { user_id } = await params;

  try {
    const { data, error } = await supabase
      .from("themes")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Update theme name for a specific user
export async function PATCH(request, { params }) {
  const supabase = await createClient();
  const { user_id } = await params;

  try {
    const { name } = await request.json();

    const { data, error } = await supabase.from("themes").upsert(
      { user_id, name },
      {
        onConflict: ["user_id"],
        returning: true,
      },
    );

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

// Create or update theme for a user
export async function PUT(request, { params }) {
  const supabase = await createClient();
  const { user_id } = await params;

  try {
    const { name } = await request.json();

    const { data, error } = await supabase
      .from("themes")
      .upsert({ user_id, name })
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

// Delete theme for a user
export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const { user_id } = await params;

  try {
    const { error } = await supabase
      .from("themes")
      .delete()
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Theme deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
