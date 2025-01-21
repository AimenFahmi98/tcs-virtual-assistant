import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import { FaFilePdf, FaFileWord } from "react-icons/fa";

/**
 * Renders a tag component that displays file information with appropriate styling based on file extension. This is used to display RAG file information in the sources part of the virtual assistant's answers.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.fileStats - Statistics about the file
 * @param {string} props.fileStats.file - The filename including extension
 * @param {string|number} props.fileStats.relevance - Relevance score as percentage
 *
 * @returns {JSX.Element} A styled tag displaying file information including:
 * - File icon (varies by extension)
 * - Filename
 * - Relevance score with progress bar
 *
 * Supports different styling for PDF, DOCX, TXT files with fallback styling for other types.
 * Each file type has its own color scheme for border, text, icon and background.
 */
function SourceTag({ fileStats }) {
  const fileExtension = fileStats.file.split(".").pop().toLowerCase();
  let borderColor, textColor, IconComponent, bgColor, iconColor;

  switch (fileExtension) {
    case "pdf":
      borderColor = "border-red-300";
      textColor = "text-red-900";
      iconColor = "text-red-600";
      bgColor = "#fefefe";
      IconComponent = <FaFilePdf className={`h-4 w-4 ${iconColor}`} />;
      break;
    case "docx":
      borderColor = "border-blue-300";
      textColor = "text-blue-900";
      iconColor = "text-blue-600";
      bgColor = "#eff6ff";
      IconComponent = <FaFileWord className={`h-4 w-4 ${iconColor}`} />;
      break;
    case "txt":
      borderColor = "border-green-300";
      textColor = "text-green-900";
      iconColor = "text-green-600";
      bgColor = "#dcfce7";
      IconComponent = (
        <BsFillFileEarmarkTextFill className={`h-4 w-4 ${iconColor}`} />
      );
      break;
    default:
      borderColor = "border-gray-300";
      textColor = "text-gray-900";
      iconColor = "text-gray-600";
      bgColor = "#f9fafb";
      IconComponent = (
        <BsFillFileEarmarkTextFill className={`h-4 w-4 ${iconColor}`} />
      ); // Default icon
  }

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={`flex items-center justify-center rounded-full border ${borderColor} px-4 py-2 text-[11px]`}
    >
      <div className="mr-2 flex items-center justify-center">
        {IconComponent}
      </div>
      <div className={`w-30 mr-2 text-ellipsis text-nowrap ${textColor}`}>
        {fileStats.file}
      </div>
      {/* <div className="ml-2 text-gray-500">{fileStats.relevance}</div> */}
      <div className="ml-2 flex items-center">
        <div className="relative h-2 w-16 rounded-full bg-gray-200">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-green-500"
            style={{ width: `${Math.round(parseFloat(fileStats.relevance))}%` }}
          ></div>
        </div>
        <div className="ml-2 text-gray-500">
          {Math.round(parseFloat(fileStats.relevance))}%
        </div>
      </div>
    </div>
  );
}

export default SourceTag;
