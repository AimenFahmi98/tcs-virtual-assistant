import DocumentTable from "@/app/(routes)/document-manager/document-management/my-documents/_components/DocumentTable";
import { createClient } from "@/utils/supabase/server";

/**
 * Retrieves all RAG selected documents from the system.
 * @async
 * @function getDocumentsSelectedForRAG
 * @returns {Promise<Array|undefined>} Returns an array of documents if successful, undefined if there's an error
 * @throws {Error} When the response indicates failure with an error message
 */
async function getDocumentsSelectedForRAG() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user || null;

    const docsResponse = await fetch(
      `http://localhost:3000/api/supabase/users/${user.id}/documents/selected-for-rag`,
    );

    const { documents } = await docsResponse.json();

    return documents;
  } catch (error) {
    console.error(
      "Error fetching user documents (the ones selected for RAG):",
      error,
    );
  }
}

async function page() {
  const documents = await getDocumentsSelectedForRAG();
  return <DocumentTable documents={documents} />;
}

export default page;
