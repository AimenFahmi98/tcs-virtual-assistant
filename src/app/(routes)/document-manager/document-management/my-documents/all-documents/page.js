import DocumentTable from "@/app/(routes)/document-manager/document-management/my-documents/_components/DocumentTable";
import { createClient } from "@/utils/supabase/server";

/**
 * Fetches all documents from the system
 * @async
 * @function getAllDocuments
 * @returns {Promise<Array|undefined>} Array of documents if successful, undefined if there's an error
 * @throws {Error} Throws an error if the documents fetch fails
 */
async function getAllDocuments() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user || null;

    const docsResponse = await fetch(
      `http://localhost:3000/api/supabase/users/${user.id}/documents`,
    );
    const { documents } = await docsResponse.json();

    return documents;
  } catch (error) {
    console.error("Error fetching user documents:", error);
  }
}

async function page() {
  const documents = await getAllDocuments();
  return <DocumentTable documents={documents} />;
}

export default page;
