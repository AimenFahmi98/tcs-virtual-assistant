import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Function to get user IDs based on roles
async function getUserIdsByRoles(supabase, roles) {
  if (!roles || roles.length === 0) {
    return [];
  }

  const { data: userRoles, error } = await supabase
    .from("user_roles")
    .select("user_id")
    .in("role_id", roles);

  if (error) {
    console.error("Error fetching user roles:", error);
    return [];
  }

  const userIds = userRoles.map((ur) => ur.user_id);
  return userIds;
}

export async function POST(request) {
  const supabase = await createClient();

  try {
    const { roles, title, content } = await request.json();

    // Fetch role IDs based on role names
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .in("name", roles);

    if (roleError) {
      console.error("Error fetching role IDs:", roleError);
      return NextResponse.json(
        { error: "Failed to fetch role IDs" },
        { status: 500 },
      );
    }

    if (!roleData || roleData.length === 0) {
      return NextResponse.json(
        { message: "No roles found with the specified names." },
        { status: 400 },
      );
    }

    const roleIds = roleData.map((role) => role.id);

    // 1. Get user IDs based on roles
    const userIds = await getUserIdsByRoles(supabase, roleIds);

    if (userIds.length === 0) {
      return NextResponse.json(
        { message: "No users found for the specified roles." },
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

    // 3. Create user notifications
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
        message: "Broadcasted notification successfully",
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
