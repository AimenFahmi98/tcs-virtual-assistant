import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { user_id, notification_id } = await params;

  try {
    const supabase = await createClient();
    const { data: notification, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user_id)
      .eq("id", notification_id)
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(notification, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { user_id, notification_id } = await params;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", user_id)
      .eq("id", notification_id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  const { user_id, notification_id } = await params;
  const { title, description, isRead } = await request.json();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .update({
        title: title,
        description: description,
        isRead,
      })
      .eq("user_id", user_id)
      .eq("id", notification_id)
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Notification updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  const { user_id, notification_id } = await params;
  const { isRead } = await request.json();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .update({
        isRead: isRead,
      })
      .eq("user_id", user_id)
      .eq("id", notification_id)
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Notification updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
