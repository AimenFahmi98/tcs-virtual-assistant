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

    // Join user_notifications with notifications table
    const { data, error } = await supabase
      .from("user_notifications")
      .select(
        `
        notification_id,
        is_read,
        notifications:notification_id (
          id,
          title,
          content,
          created_at
        )
      `,
      )
      .eq("user_id", user_id);

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

    // Format the joined data
    const notifications = data.map((item) => ({
      id: item.notifications.id,
      title: item.notifications.title,
      content: item.notifications.content,
      created_at: item.notifications.created_at,
      is_read: item.is_read,
    }));

    return NextResponse.json(
      {
        success: true,
        data: notifications,
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

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "Title and content are required",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // First, create the notification
    const { data: notificationData, error: notificationError } = await supabase
      .from("notifications")
      .insert([
        {
          title,
          content,
        },
      ])
      .select();

    if (notificationError) {
      console.error("Error creating notification:", notificationError.message);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create notification",
          details: notificationError.message,
        },
        { status: 500 },
      );
    }

    // Then link the notification to the user
    const notification_id = notificationData[0].id;
    const { error: userNotificationError } = await supabase
      .from("user_notifications")
      .insert([
        {
          user_id,
          notification_id,
        },
      ]);

    if (userNotificationError) {
      console.error(
        "Error linking notification to user:",
        userNotificationError.message,
      );
      return NextResponse.json(
        {
          success: false,
          error: "Failed to assign notification to user",
          details: userNotificationError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: notificationData[0],
        message: "Notification created successfully",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Unexpected error creating notification:", err);
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
