"use client";

import {
  deleteDocumentsByIds,
  selectDocumentsForRAG,
  unselectDocumentsForRAG,
} from "@/lib/supabase";
import DocumentRow from "./DocumentRow";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { IoMdCheckboxOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";

function DocumentTable({ documents }) {
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());

  const toggleSelection = (document) => {
    setSelectedDocuments((prevSelectedDocuments) => {
      // Create a shallow copy of the previous set to ensure immutability
      const newSelectedDocuments = new Set(prevSelectedDocuments);

      if (newSelectedDocuments.has(document.id)) {
        newSelectedDocuments.delete(document.id); // Remove document if already selected
      } else {
        newSelectedDocuments.add(document.id); // Add document if not selected
      }

      return newSelectedDocuments; // Return the updated set
    });
  };

  const isDocumentSelected = (documentId) => {
    return selectedDocuments.has(documentId); // Check if the document is selected
  };

  return (
    <div className={`mx-auto w-[95%] flex-1 py-2`}>
      {selectedDocuments.size > 0 && (
        <div className="flex items-center justify-start gap-4 bg-background">
          <button
            onClick={() => {
              // Call the supabase function to delete selected documents
              deleteDocumentsByIds(Array.from(selectedDocuments));
              setSelectedDocuments(new Set()); // Clear the selection after deletion
            }}
            className="mb-2 ml-8 flex items-center justify-center rounded-lg bg-red-500 px-3 py-2 text-sm text-white"
          >
            <BiTrash className="mr-2 inline-block h-5 w-5" />
            <span>Delete</span>
          </button>
          <button
            onClick={() => {
              // Call the supabase function to select documents for RAG
              selectDocumentsForRAG(Array.from(selectedDocuments));
              setSelectedDocuments(new Set()); // Clear the selection after selection
            }}
            className="mb-2 flex items-center justify-center rounded-lg border border-primary_dark bg-background px-3 py-2 text-sm text-text hover:bg-primary_light"
          >
            <IoMdCheckboxOutline className="mr-2 inline-block h-5 w-5" />
            <span>Select for RAG</span>
          </button>
          <button
            onClick={() => {
              // Call the supabase function to unselect documents for RAG
              unselectDocumentsForRAG(Array.from(selectedDocuments));
              setSelectedDocuments(new Set()); // Clear the selection after unselection
            }}
            className="mb-2 flex items-center justify-center rounded-lg border border-primary_dark bg-background px-3 py-2 text-sm text-text hover:bg-primary_light"
          >
            <RxCrossCircled className="mr-2 inline-block h-5 w-5" />
            <span>Unselect for RAG</span>
          </button>
        </div>
      )}
      <div className="flex-1 overflow-auto rounded-t-[30px] border border-primary border-b-transparent bg-background">
        <table className="min-w-full overflow-auto text-center text-sm text-text">
          <thead className="bg-primary text-xs font-semibold uppercase tracking-wider text-text">
            <tr>
              <th className="px-6 py-6">File Name</th>
              <th className="px-6 py-6">Date of Upload</th>
              <th className="px-6 py-6">Size</th>
              <th className="px-6 py-6">Number of Chunks</th>
              <th className="px-6 py-6">Selected for RAG</th>
            </tr>
          </thead>
          <tbody className="h-full divide-y divide-gray-200 overflow-scroll">
            {!documents || documents.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-6">
                  No documents found
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <DocumentRow
                  document={doc}
                  key={doc.id}
                  toggleSelection={toggleSelection}
                  isSelected={() => isDocumentSelected(doc.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocumentTable;
