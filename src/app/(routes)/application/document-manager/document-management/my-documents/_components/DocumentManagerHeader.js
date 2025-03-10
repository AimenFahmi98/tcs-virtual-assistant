"use client";

import { useState } from "react";
import BtnUploadDocument from "./BtnUploadDocument";
import Link from "next/link";

/**
 * A component that renders the header section of the document manager.
 * Contains navigation tabs for 'All Documents' and 'Selected for RAG' sections,
 * along with an upload document button.
 *
 * @component
 * @returns {JSX.Element} A header component with navigation tabs and upload button
 *
 * @example
 * return (
 *   <DocumentManagerHeader />
 * )
 */
function DocumentManagerHeader() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="sticky left-0 top-0 flex w-full items-center justify-between bg-background py-3 pl-8 pr-2">
      <div className="flex w-[80%] justify-start text-text_light">
        <Link
          href="/document-manager/document-management/my-documents/all-documents"
          onClick={() => setActiveTab("All")}
          className={`px-4 py-4 hover:text-text ${
            activeTab === "All"
              ? "border-b-2 border-accent_secondary"
              : "border-b-2 border-transparent"
          }`}
        >
          <span className={`${activeTab === "All" && "text-accent_secondary"}`}>
            All
          </span>
        </Link>
        <Link
          href="/document-manager/document-management/my-documents/rag-documents"
          onClick={() => setActiveTab("Selected for RAG")}
          className={`px-4 py-4 hover:text-text ${
            activeTab === "Selected for RAG"
              ? "border-b-2 border-accent_secondary"
              : "border-b-2 border-transparent"
          }`}
        >
          <span
            className={`${activeTab === "Selected for RAG" && "text-accent_secondary"}`}
          >
            Selected for RAG
          </span>
        </Link>
      </div>
      <BtnUploadDocument />
    </div>
  );
}

export default DocumentManagerHeader;
