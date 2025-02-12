import { FaFilePdf } from "react-icons/fa6";
import { FaFileWord } from "react-icons/fa6";
import { FaFileLines } from "react-icons/fa6";

/**
 * Returns the appropriate icon component based on file extension
 * @param {string} fileName - The name of the file
 * @returns {JSX.Element} - React icon component
 */
export const getFileIcon = (fileName) => {
  const extension = fileName.toLowerCase().split(".").pop();

  switch (extension) {
    case "pdf":
      return <FaFilePdf className="h-5 w-5 text-red-500" />;
    case "docx":
    case "doc":
      return <FaFileWord className="h-5 w-5 text-blue-600" />;
    default:
      return <FaFileLines className="h-5 w-5 text-yellow-500" />;
  }
};

/**
 * Formats file size from KB to appropriate unit
 * @param {number} sizeInKB - File size in kilobytes
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (sizeInKB) => {
  const units = ["Kb", "KB", "MB", "GB", "TB"];
  let size = sizeInKB;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
};
