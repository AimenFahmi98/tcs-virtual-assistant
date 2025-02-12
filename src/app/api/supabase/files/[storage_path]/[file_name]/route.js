import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * Handles DELETE requests to remove files from Supabase storage
 * @async
 * @param {Request} request - The incoming HTTP request
 * @param {Object} params - URL parameters containing the storage path and file name
 * @returns {Promise<Response>} JSON response indicating success or failure
 */
export async function DELETE(request, { params }) {
    try {
        const { storage_path, file_name } = await params;
        const supabase = await createClient();
        
        const storagePath = `${storage_path}/${file_name}`;

        // Delete the file
        const { data, error } = await supabase.storage
            .from("documents")
            .remove([storagePath]);

        if (error) {
            console.error("Error deleting file:", error.message);
            return NextResponse.json(
                { success: false, message: "Error deleting file" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "File deleted successfully",
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Unexpected error:", err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}