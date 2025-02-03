import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get all roles for a specific user
export async function GET(request, { params }) {
  const { user_id } = await params;
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select(
        `
         role_id,
         roles:role_id (
           id,
           name
         )
        `,
      )
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const roles = data ? data.map((item) => item.roles) : [];
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Assign a role to a user
export async function POST(request, { params }) {
  const { user_id } = await params;
  const supabase = await createClient();

  try {
    const { role_id } = await request.json();

    if (!role_id) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("user_roles")
      .insert([{ user_id, role_id }])
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

// Remove a role from a user
export async function DELETE(request, { params }) {
  const { user_id } = await params;
  const supabase = await createClient();

  try {
    const { role_id } = await request.json();

    if (!role_id) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", user_id)
      .eq("role_id", role_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Role removed successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/*

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get all roles for a specific user
export async function GET(request, { params }) {
  const supabase = await createClient();
  try {
    const { user_id } = await params;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select(
        `
                *,
                roles (
                    id,
                    name,
                    description
                )
            `,
      )
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: "No roles found for this user" },
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

// Create a new user-role association
export async function POST(request) {
  const supabase = await createClient();
  try {
    const body = await request.json();
    const { user_id, role_id } = body;

    if (!user_id || !role_id) {
      return NextResponse.json(
        { error: "User ID and Role ID are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("user_roles")
      .insert([{ user_id, role_id }])
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

// Update a user-role association
export async function PUT(request, { params }) {
  const supabase = await createClient();
  try {
    const { user_id } = await params;
    const body = await request.json();
    const { new_role_id } = body;

    if (!new_role_id) {
      return NextResponse.json(
        { error: "New role ID is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("user_roles")
      .update({ role_id: new_role_id })
      .eq("user_id", user_id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Delete a user-role association for a specific user
export async function DELETE(request, { params }) {
  const supabase = await createClient();
  try {
    const { user_id } = await params;

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Successfully deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Delete all user-role associations for a specific user
export async function DELETE_ALL(request, { params }) {
  const supabase = await createClient();
  try {
    const { user_id } = await params;

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Successfully deleted all roles for user",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}


*/
