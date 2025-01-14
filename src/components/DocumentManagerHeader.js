"use client";

import { useState } from "react";
import BtnUploadDocument from "./BtnUploadDocument";

function DocumentManagerHeader() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="flex items-center justify-between py-4 pl-12 pr-6">
      <div className="flex w-[80%] justify-start border-b border-gray-300 text-text_light">
        <button
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
        </button>
        <button
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
        </button>
      </div>
      <BtnUploadDocument />
    </div>
  );
}

export default DocumentManagerHeader;
