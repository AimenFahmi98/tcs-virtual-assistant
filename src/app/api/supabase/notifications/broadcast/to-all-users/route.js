import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Function to get all user IDs from user_profiles
async function getAllUserIds(supabase) {
  const { data: userProfiles, error } = await supabase
    .from("user_profiles")
    .select("id");

  if (error) {
    console.error("Error fetching user profiles:", error);
    return [];
  }

  return userProfiles.map((profile) => profile.id);
}

export async function POST(request) {
  const supabase = await createClient();

  try {
    const { title, content } = await request.json();

    // 1. Get all user IDs from user_profiles
    const userIds = await getAllUserIds(supabase);

    if (userIds.length === 0) {
      return NextResponse.json(
        { message: "No users found in the system." },
        { status: 200 },
      );
    }

    // 2. Create the notification
    const { data: newNotification, error: notificationError } = await supabase
      .from("notifications")
      .insert([{ title, content }])
      .select();

    if (notificationError) {
      console.error("Error creating notification:", notificationError);
      return NextResponse.json(
        { error: "Failed to create notification" },
        { status: 500 },
      );
    }

    const notificationId = newNotification[0].id;

    // 3. Create user notifications for all users
    const userNotificationsToInsert = userIds.map((userId) => ({
      user_id: userId,
      notification_id: notificationId,
    }));

    const { error: userNotificationsError } = await supabase
      .from("user_notifications")
      .insert(userNotificationsToInsert);

    if (userNotificationsError) {
      console.error(
        "Error creating user notifications:",
        userNotificationsError,
      );
      return NextResponse.json(
        { error: "Failed to create user notifications" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Broadcasted notification to all users successfully",
        data: newNotification[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  const supabase = await createClient();

  try {
    // Fetch all broadcasted notifications
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*");

    if (error) {
      console.error("Error fetching notifications:", error);
      return NextResponse.json(
        { error: "Failed to fetch notifications" },
        { status: 500 },
      );
    }

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  const supabase = await createClient();

  try {
    const { notificationId } = await request.json();

    // Delete the notification
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error("Error deleting notification:", error);
      return NextResponse.json(
        { error: "Failed to delete notification" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
