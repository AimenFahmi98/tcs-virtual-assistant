import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get all users for a specific role
export async function GET(request, { params }) {
  const supabase = await createClient();
  try {
    const { role_id } = await params;

    if (!role_id) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select(
        `
                *,
                profiles:users (
                    id,
                    email,
                    full_name
                )
            `,
      )
      .eq("role_id", role_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: "No users found with this role" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Delete all user associations for a specific role
export async function DELETE(request, { params }) {
  const supabase = await createClient();
  try {
    const { role_id } = await params;

    if (!role_id) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("roles").delete().eq("id", role_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Successfully deleted the role",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
