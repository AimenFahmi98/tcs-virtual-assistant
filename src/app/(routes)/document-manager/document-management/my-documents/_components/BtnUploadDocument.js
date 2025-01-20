"use client";

import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "@/app/ui-components/Spinner";
import { useRouter } from "next/navigation";

function BtnUploadDocument() {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (event) => {
    const fileInput = event.target; // Reference to the input element
    const file = fileInput.files[0]; // Get the first selected file
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3000/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process and upload the document.");
      }

      const result = await response.json();

      if (result.success) {
        // Display success toast
        toast.success(result.message, {
          position: "top-right",
        });
        // Refresh the current route
        router.refresh();
      } else {
        // Display error toast
        toast.error(`Error: ${result.error}`, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Unexpected error during file processing/upload:", error);
      toast.error("Unexpected error during file processing/upload.", {
        position: "top-right",
      });
    } finally {
      setIsUploading(false);
      fileInput.value = ""; // Clear the file input value
    }
  };

  return (
    <div className="relative flex items-center justify-center gap-4">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-background_accent_secondary px-6 py-3 text-accent_secondary transition-all duration-300 hover:scale-95">
        {isUploading ? (
          <Spinner
            color={"var(--color-accent-secondary)"}
            size="16px"
            borderSize="2px"
          />
        ) : (
          <BiPlus />
        )}
        {isUploading ? (
          <span className="text-nowrap">Uploading...</span>
        ) : (
          <span className="text-nowrap">Add Document</span>
        )}
        <input
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </label>

      {/* Toast notification container */}
      <ToastContainer />
    </div>
  );
}

export default BtnUploadDocument;
