"use client";

import { useState } from "react";
import BtnUploadDocument from "./BtnUploadDocument";
import Link from "next/link";

function DocumentManagerHeader() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="flex items-center justify-between py-3 pl-8 pr-2">
      <div className="flex w-[80%] justify-start text-text_light">
        <Link
          href="/document-manager/all-documents"
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
          href="/document-manager/rag-documents"
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
