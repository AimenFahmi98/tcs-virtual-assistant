import DocumentTable from "@/app/(routes)/document-manager/document-management/my-documents/_components/DocumentTable";
import { getAllRAGSelectedDocuments } from "@/lib/supabase";

/**
 * Retrieves all RAG selected documents from the system.
 * @async
 * @function getDocumentsSelectedForRAG
 * @returns {Promise<Array|undefined>} Returns an array of documents if successful, undefined if there's an error
 * @throws {Error} When the response indicates failure with an error message
 */
async function getDocumentsSelectedForRAG() {
  try {
    const response = await getAllRAGSelectedDocuments();
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("Error fetching documents", error);
  }
}

async function page() {
  const documents = await getDocumentsSelectedForRAG();
  return <DocumentTable documents={documents} />;
}

export default page;
