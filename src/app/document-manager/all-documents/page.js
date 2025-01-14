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

  return (
    <div className="container mx-auto h-full w-[95%] py-4">
      <div className="h-full overflow-x-auto rounded-t-[30px] border border-gray-200 bg-background">
        <table className="min-w-full text-center text-sm text-text">
          <thead className="bg-primary text-xs font-semibold uppercase tracking-wider text-text">
            <tr>
              <th className="px-6 py-6">Date of Upload</th>
              <th className="px-6 py-6">File Name</th>
              <th className="px-6 py-6">Size</th>
              <th className="px-6 py-6">Selected for RAG</th>
              <th className="px-6 py-6">Type</th>
              <th className="px-6 py-6">Number of Chunks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {new Date(doc.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-left">{doc.name}</td>
                <td className="px-6 py-4">{(doc.size / 1024).toFixed(2)} KB</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      doc.isSelectedForRAG
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {doc.isSelectedForRAG ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4">{doc.type}</td>

                <td className="px-6 py-4">{doc.nbChunks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default page;
