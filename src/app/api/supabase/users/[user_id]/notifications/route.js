import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Retrieves all notifications for a specific user.
 * @async
 * @param {Request} request - The incoming HTTP request
 * @param {Object} context - Contains route parameters
 * @param {Object} context.params - URL parameters
 * @param {string} context.params.user_id - The user ID to fetch notifications for
 * @returns {Promise<Response>} JSON response containing notifications or error
 */
export async function GET(_request, { params }) {
  try {
    const { user_id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error.message);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch notifications",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: "Notifications retrieved successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Unexpected error fetching notifications:", err);
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

/**
 * Creates a new notification for a specific user.
 * @async
 * @param {Request} request - The incoming HTTP request
 * @param {Object} context - Contains route parameters
 * @param {Object} context.params - URL parameters
 * @param {string} context.params.user_id - The user ID to create notification for
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export async function POST(request, { params }) {
  try {
    const { user_id } = await params;
    const { title, content } = await request.json();

    console.log("Creating notification for user:", user_id, title, content);

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and content are required.",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          title,
          content,
          user_id,
        },
      ])
      .select();

    if (error) {
      throw new Error(`Error creating notification: ${error.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Notification created successfully",
        data: data[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
