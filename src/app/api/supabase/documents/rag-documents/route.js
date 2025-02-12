import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * Retrieves all documents from the database.
 * @async
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Array|null} .data - Array of document objects if found
 * @returns {string|null} .error - Error message if any
 */
export async function GET() {
  try {
    const supabase = await createClient();
    // Query documents with optional ordering
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("isSelectedForRAG", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error.message);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch documents",
          details: error.message,
        },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: "No documents found",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        count: data.length,
        message: "Documents retrieved successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Unexpected error fetching documents:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
