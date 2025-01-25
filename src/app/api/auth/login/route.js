import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (response.error) {
      return NextResponse.json(
        { success: false, message: response.error.message },
        { status: 400 },
      );
    }

    return NextResponse.redirect(new URL("/virtual-assistant", request.url));
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
