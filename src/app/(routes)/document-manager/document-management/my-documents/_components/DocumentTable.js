"use client";

import {
  deleteDocumentsByIds,
  deleteFilesFromSupabase,
  selectDocumentsForRAG,
  unselectDocumentsForRAG,
} from "@/lib/supabase";
import DocumentRow from "./DocumentRow";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { IoMdCheckboxOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { useRouter } from "next/navigation";

/**
 * A component that renders a table of documents with selection and bulk operation capabilities.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.documents - Array of document objects to display in the table
 * @param {Object} props.documents[].id - Unique identifier for each document
 * @param {string} props.documents[].name - Name of the document
 * @param {Date} props.documents[].uploadDate - Date when document was uploaded
 * @param {number} props.documents[].size - Size of the document
 * @param {number} props.documents[].chunks - Number of chunks the document is divided into
 * @param {boolean} props.documents[].selectedForRAG - Whether document is selected for RAG
 *
 * @returns {JSX.Element} A table component with document rows and bulk operation buttons
 *
 * @example
 * const documents = [{
 *   id: 1,
 *   name: "document.pdf",
 *   uploadDate: "2023-01-01",
 *   size: 1024,
 *   chunks: 5,
 *   selectedForRAG: false
 * }];
 *
 * return <DocumentTable documents={documents} />;
 */
function DocumentTable({ documents }) {
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  /**
   * Handles document operations asynchronously
   * @param {Function} operation - The operation function to execute on documents
   * @param {Array|string} ids - Document ID(s) to perform the operation on
   * @returns {Promise<void>} A promise that resolves when the operation is complete
   * @throws {Error} When the operation fails
   */
  const handleOperation = async (operation, ids) => {
    setIsProcessing(true);
    try {
      await operation(ids);
      setSelectedDocuments(new Set());
      router.refresh();
    } catch (error) {
      console.error("Operation failed:", error);
      // Add error toast notification here
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Toggles the selection state of a document in the selected documents Set.
   * If the document is already selected, it will be removed from the selection.
   * If the document is not selected, it will be added to the selection.
   *
   * @param {Object} document - The document object to toggle selection for
   * @returns {void}
   */
  const toggleSelection = (document) => {
    setSelectedDocuments((prevSelectedDocuments) => {
      const newSelectedDocuments = new Set(prevSelectedDocuments);

      if (newSelectedDocuments.has(document)) {
        newSelectedDocuments.delete(document); // Remove entire document if already selected
      } else {
        newSelectedDocuments.add(document); // Add entire document if not selected
      }

      return newSelectedDocuments;
    });
  };

  /**
   * Checks if a document is currently selected in the documents table
   * @param {string} documentId - The unique identifier of the document to check
   * @returns {boolean} - True if the document is selected, false otherwise
   */
  const isDocumentSelected = (documentId) => {
    // Convert Set to Array to use find method
    return Array.from(selectedDocuments).some((doc) => doc.id === documentId);
  };

  return (
    <div className={`mx-auto w-[95%] flex-1 py-2`}>
      {selectedDocuments.size > 0 && (
        <div className="flex items-center justify-start gap-4 bg-background">
          <button
            disabled={isProcessing}
            onClick={() => {
              const ids = Array.from(selectedDocuments).map((doc) => doc.id);
              handleOperation(async () => {
                await deleteDocumentsByIds(ids);
                await deleteFilesFromSupabase(
                  Array.from(selectedDocuments).map((doc) => doc.name),
                );
              }, ids);
            }}
            className="mb-2 ml-8 flex items-center justify-center rounded-lg bg-red-500 px-3 py-2 text-sm text-white"
          >
            <BiTrash className="mr-2 inline-block h-5 w-5" />
            <span>Delete</span>
          </button>
          <button
            disabled={isProcessing}
            onClick={() => {
              const ids = Array.from(selectedDocuments).map((doc) => doc.id);
              handleOperation(selectDocumentsForRAG, ids);
            }}
            className="mb-2 flex items-center justify-center rounded-lg border border-primary_dark bg-background px-3 py-2 text-sm text-text hover:bg-primary_light"
          >
            <IoMdCheckboxOutline className="mr-2 inline-block h-5 w-5" />
            <span>Select for RAG</span>
          </button>
          <button
            disabled={isProcessing}
            onClick={() => {
              const ids = Array.from(selectedDocuments).map((doc) => doc.id);
              handleOperation(unselectDocumentsForRAG, ids);
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
