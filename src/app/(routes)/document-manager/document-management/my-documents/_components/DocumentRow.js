import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import { format } from "date-fns";

/**
 * Converts a size in kilobytes to a human-readable string representation
 * with appropriate unit (KB, MB, GB, or TB).
 *
 * @param {number} sizeInKB - The size in kilobytes to format
 * @returns {string} A formatted string with the size and appropriate unit
 *
 * @example
 * formatSize(1500) // returns "1.5 MB"
 * formatSize(500) // returns "500.0 KB"
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

/**
 * Renders a table row for a document with selection functionality and visual indicators
 * @param {Object} props - Component properties
 * @param {Object} props.document - Document object containing document details
 * @param {string} props.document.type - Type of document (pdf, docx, txt)
 * @param {string} props.document.name - Name of the document
 * @param {string} props.document.created_at - Creation date of document
 * @param {number} props.document.size - Size of document in bytes
 * @param {number} props.document.nbChunks - Number of chunks in the document
 * @param {boolean} props.document.isSelectedForRAG - Flag indicating if document is selected for RAG
 * @param {Function} props.toggleSelection - Function to handle document selection
 * @param {Function} props.isSelected - Function to check if document is currently selected
 * @returns {JSX.Element} Table row component with document information and selection controls
 */
function DocumentRow({ document, toggleSelection, isSelected }) {
  const documentTypeIcons = new Map([
    ["pdf", <FaFilePdf className="h-5 w-5 text-red-500" key={"pdf"} />],
    ["docx", <FaFileWord className="h-5 w-5 text-blue-500" key={"docx"} />],
    [
      "txt",
      <BsFillFileEarmarkTextFill
        className="h-5 w-5 text-yellow-500"
        key={"txt"}
      />,
    ],
  ]);

  return (
    <tr
      className="hover:bg-primary_light"
      onClick={() => toggleSelection(document)}
    >
      <td className="flex items-center justify-start px-6 py-4">
        <input
          type="checkbox"
          className="mr-4 hover:cursor-pointer"
          checked={isSelected()}
          onChange={() => {}}
        />
        {documentTypeIcons.get(document.type)}
        <span className="px-3 py-4 text-left">{document.name}</span>
      </td>
      <td className="px-6 py-4">
        {format(new Date(document.created_at), "yyyy-MM-dd HH:mm:ss")}
      </td>
      <td className="px-6 py-4">{formatSize(document.size / 1024)}</td>

      <td className="px-6 py-4">{document.nbChunks}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            document.isSelectedForRAG
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {document.isSelectedForRAG ? "Yes" : "No"}
        </span>
      </td>
    </tr>
  );
}

export default DocumentRow;
