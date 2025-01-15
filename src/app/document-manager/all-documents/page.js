import { getDocuments } from "@/lib/supabase";
import { BsFiletypeTxt } from "react-icons/bs";
import { FaFilePdf } from "react-icons/fa";
import { FaFileWord } from "react-icons/fa";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";

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

/**
 * Convert size in kilobytes to a readable format.
 * @param {number} sizeInKB - The size in kilobytes.
 * @returns {string} - The formatted size string.
 */
function formatSize(sizeInKB) {
  if (sizeInKB < 1024) {
    return `${sizeInKB.toFixed(1)} KB`;
  } else if (sizeInKB < 1024 * 1024) {
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  } else if (sizeInKB < 1024 * 1024 * 1024) {
    return `${(sizeInKB / (1024 * 1024)).toFixed(1)} GB`;
  } else {
    return `${(sizeInKB / (1024 * 1024 * 1024)).toFixed(1)} TB`;
  }
}

async function page() {
  const documents = await getAllDocuments();
  const documentTypeIcons = new Map([
    ["pdf", <FaFilePdf className="h-6 w-6 text-red-500" key={"pdf"} />],
    ["docx", <FaFileWord className="h-6 w-6 text-blue-500" key={"docx"} />],
    [
      "txt",
      <BsFillFileEarmarkTextFill
        className="h-6 w-6 text-yellow-500"
        key={"txt"}
      />,
    ],
  ]);

  return (
    <div className="container mx-auto h-full w-[95%] py-2">
      <div className="h-full overflow-x-auto rounded-t-[30px] border border-primary border-b-transparent bg-background">
        <table className="min-w-full text-center text-sm text-text">
          <thead className="bg-primary text-xs font-semibold uppercase tracking-wider text-text">
            <tr>
              <th className="px-6 py-6">Type</th>
              <th className="px-6 py-6">Date of Upload</th>
              <th className="px-6 py-6">File Name</th>
              <th className="px-6 py-6">Size</th>
              <th className="px-6 py-6">Number of Chunks</th>
              <th className="px-6 py-6">Selected for RAG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-primary_light">
                <td className="flex items-center justify-center px-6 py-4">
                  {documentTypeIcons.get(doc.type)}
                </td>
                <td className="px-6 py-4">
                  {new Date(doc.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-left">{doc.name}</td>
                <td className="px-6 py-4">{formatSize(doc.size / 1024)}</td>

                <td className="px-6 py-4">{doc.nbChunks}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default page;
