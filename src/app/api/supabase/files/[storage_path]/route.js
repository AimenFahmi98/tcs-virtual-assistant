import { createClient } from "@/utils/supabase/server";

/**
 * Handles POST requests for file uploads to Supabase storage with dynamic paths.
 * @async
 * @param {Request} request - The incoming HTTP request containing form data with a file
 * @param {Object} params - URL parameters containing the storage path
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export async function POST(request, { params }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const path = await params.storage_path;

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: "No valid file provided." },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const storagePath = `${path}/${file.name}`;

    // Check if file already exists
    const { data: existingFile, error: listError } = await supabase.storage
      .from("documents")
      .list(path, { search: file.name });

    if (listError) {
      console.error("Error checking file existence:", listError.message);
      return NextResponse.json(
        { success: false, message: "Error checking file existence" },
        { status: 500 },
      );
    }

    if (existingFile && existingFile.length > 0) {
      return NextResponse.json(
        { success: true, message: "File already exists" },
        { status: 200 },
      );
    }

    // Upload the file
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(storagePath, file);

    if (error) {
      console.error("Error uploading file:", error.message);
      return NextResponse.json(
        { success: false, message: "Error uploading file" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        path: data.path,
        message: "File uploaded successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
