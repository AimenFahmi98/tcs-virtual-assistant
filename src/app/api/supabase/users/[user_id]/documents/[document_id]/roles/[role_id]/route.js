import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Get a specific role associated with a document
export async function GET(request, { params }) {
  const { document_id, role_id } = await params;
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
      .eq("document_id", document_id)
      .eq("role_id", role_id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.roles || null);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Delete a specific role association
export async function DELETE(request, { params }) {
  const { document_id, role_id } = await params;
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("document_roles")
      .delete()
      .eq("document_id", document_id)
      .eq("role_id", role_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Role association removed successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
