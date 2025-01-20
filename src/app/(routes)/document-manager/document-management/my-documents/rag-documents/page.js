import DocumentTable from "@/app/(routes)/document-manager/document-management/my-documents/_components/DocumentTable";
import { getAllRAGSelectedDocuments } from "@/lib/supabase";

async function getAllDocuments() {
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
  const documents = await getAllDocuments();
  return <DocumentTable documents={documents} />;
}

export default page;
