import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { user_id } = await params;
  const supabase = await createClient();

  try {
    // First, get all roles for the user
    const { data: userRoles, error: userRolesError } = await supabase
      .from("user_roles")
      .select("role_id")
      .eq("user_id", user_id);

    if (userRolesError) {
      return NextResponse.json(
        { error: userRolesError.message },
        { status: 500 },
      );
    }

    // Extract role IDs
    const roleIds = userRoles.map((role) => role.role_id);

    if (roleIds.length === 0) {
      return NextResponse.json({ documents: [] });
    }

    // Get all documents that have roles matching the user's roles
    const { data: documents, error: documentsError } = await supabase
      .from("documents")
      .select(
        `
        *,
        document_roles!inner (
          role_id
        )
      `,
      )
      .in("document_roles.role_id", roleIds);

    if (documentsError) {
      return NextResponse.json(
        { error: documentsError.message },
        { status: 500 },
      );
    }

    // Remove duplicate documents and clean up the response
    const uniqueDocuments = Array.from(new Set(documents.map((doc) => doc.id)))
      .map((id) => documents.find((doc) => doc.id === id))
      .map(({ document_roles, ...doc }) => doc); // Remove the document_roles from the response

    return NextResponse.json({ documents: uniqueDocuments });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
