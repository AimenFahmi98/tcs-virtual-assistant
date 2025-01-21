import DocumentTable from "@/app/(routes)/document-manager/document-management/my-documents/_components/DocumentTable";
import { getDocuments } from "@/lib/supabase";

/**
 * Fetches all documents from the system
 * @async
 * @function getAllDocuments
 * @returns {Promise<Array|undefined>} Array of documents if successful, undefined if there's an error
 * @throws {Error} Throws an error if the documents fetch fails
 */
async function getAllDocuments() {
  try {
    const response = await getDocuments();
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
  const documents = await getAllDocuments();
  return <DocumentTable documents={documents} />;
}

export default page;
