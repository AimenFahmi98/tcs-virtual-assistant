import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get all roles associated with a specific document
export async function GET(request, { params }) {
  const { document_id } = await params;
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("document_roles")
      .select(
        `
                role_id,
                roles:role_id (
                    id,
                    name
                )
            `,
      )
      .eq("document_id", document_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const roles = data ? data.map((item) => item.roles) : [];
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Associate a role with a document
export async function POST(request, { params }) {
  const { document_id } = await params;
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
      .from("document_roles")
      .insert([{ document_id, role_id }])
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

// Remove a specific role from a document
export async function DELETE(request, { params }) {
  const { document_id } = await params;
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
      .from("document_roles")
      .delete()
      .eq("document_id", document_id)
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
