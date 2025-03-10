"use client";

import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "@/app/ui-components/common/Spinner";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { uploadDocument } from "@/redux/documentSlice";

/**
 * A button component that handles document file uploads.
 *
 * @component
 * @description Renders a button that allows users to select and upload document files.
 * The component manages the upload state, displays loading indicators, and shows
 * toast notifications for success/error feedback.
 *
 * Features:
 * - File selection through hidden input
 * - Upload progress indication
 * - Success/Error toast notifications
 * - Automatic route refresh on successful upload
 * - Input clearing after upload
 *
 * @returns {JSX.Element} A button component with file upload functionality
 *
 * @example
 * return (
 *   <BtnUploadDocument />
 * )
 */
function BtnUploadDocument() {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { isUploadingDocument } = useSelector((state) => state.documents);

  const handleFileUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await dispatch(
        uploadDocument({
          user_id: userId, // You'll need to get userId from your auth context/state
          formData,
        }),
      ).unwrap();

      toast.success("Document uploaded successfully", {
        position: "top-right",
      });
      router.refresh();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(error || "Failed to upload document", {
        position: "top-right",
      });
    } finally {
      setIsUploading(false);
      fileInput.value = "";
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
