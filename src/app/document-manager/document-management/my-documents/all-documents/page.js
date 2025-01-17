import DocumentTable from "@/components/DocumentTable";
import { getDocuments } from "@/lib/supabase";

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
