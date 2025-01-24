import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createUserProfile, signUp } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { fullName, email, password } = await request.json();
    const signupResponse = await signUp(email, password);

    if (signupResponse.error) {
      return NextResponse.json(
        { success: false, message: signupResponse.error },
        { status: 400 },
      );
    }

    const response = await createUserProfile(
      signupResponse.data.user.id,
      signupResponse.data.user.email,
      fullName,
    );

    if (response.error) {
      return NextResponse.json(
        { success: false, message: response.error.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data: signupResponse.data });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
