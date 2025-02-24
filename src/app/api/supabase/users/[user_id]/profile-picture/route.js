import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const BUCKET_NAME = "images"; // Storage bucket name

export async function POST(req, { params }) {
  try {
    const supabase = await createClient();
    const { user_id } = await params;
    const data = await req.formData();
    const file = data.get("file");

    if (!file || !user_id) {
      return NextResponse.json(
        { error: "Missing file or user_id" },
        { status: 400 },
      );
    }

    // Ensure correct file format
    const fileExt = file.name.split(".").pop();
    const filePath = `${user_id}/profile-picture.${fileExt}`;

    // Upload to Supabase Storage (upsert replaces existing file)
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 },
      );
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    // Update the profile picture URL in `user_profiles` table
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ profile_picture: publicUrl })
      .eq("id", user_id);

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile picture in database" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Profile picture updated", publicUrl });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    const supabase = await createClient();
    const { user_id } = await params;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Retrieve profile picture URL from the `user_profiles` table
    const { data, error } = await supabase
      .from("user_profiles")
      .select("profile_picture")
      .eq("user_id", user_id)
      .single();

    if (error || !data?.profile_picture) {
      return NextResponse.json(
        { error: "Profile picture not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ profilePicture: data.profile_picture });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const supabase = await createClient();
    const { user_id } = await params;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Get existing profile picture URL
    const { data, error } = await supabase
      .from("user_profiles")
      .select("profile_picture")
      .eq("user_id", user_id)
      .single();

    if (error || !data?.profile_picture) {
      return NextResponse.json(
        { error: "Profile picture not found" },
        { status: 404 },
      );
    }

    // Extract filename from URL
    const fileName = data.profile_picture.split("/").pop();

    // Delete the file from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (deleteError) {
      console.error("Error deleting image:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete image from storage" },
        { status: 500 },
      );
    }

    // Remove profile picture URL from `user_profiles` table
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ profile_picture: null })
      .eq("user_id", user_id);

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return NextResponse.json(
        { error: "Failed to remove profile picture from database" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Profile picture deleted" });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
