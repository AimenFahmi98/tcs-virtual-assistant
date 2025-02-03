import HtmlBox from "../../../ui-components/HtmlBox";
import Image from "next/image";
import { useChat } from "@/context/chatContext";
import SourceTag from "./SourceTag";

/**
 * Calculates statistics about the frequency and relevance of files in an array.
 * @param {string[]} fileArray - An array of file names to analyze.
 * @returns {Array<{file: string, relevance: string}>} An array of objects containing:
 *   - file: The name of the file
 *   - relevance: The percentage of occurrences in the array (as a string with % suffix)
 * @returns {Array<never>} Returns empty array if input is invalid or empty
 * @example
 * calculateFileStatistics(['file1.txt', 'file2.txt', 'file1.txt'])
 * // Returns: [
 * //   { file: 'file1.txt', relevance: '66.67%' },
 * //   { file: 'file2.txt', relevance: '33.33%' }
 * // ]
 */
function calculateFileStatistics(fileArray) {
  if (!Array.isArray(fileArray) || fileArray.length === 0) {
    return [];
  }

  // Count occurrences of each file
  const fileCounts = fileArray.reduce((counts, fileName) => {
    counts[fileName] = (counts[fileName] || 0) + 1;
    return counts;
  }, {});

  // Total number of files
  const totalFiles = fileArray.length;

  // Calculate percentages and format the output
  const fileStatistics = Object.entries(fileCounts).map(([fileName, count]) => {
    return {
      file: fileName,
      relevance: ((count / totalFiles) * 100).toFixed(2) + "%",
    };
  });

  return fileStatistics;
}

/**
 * Renders an answer component with optional context sources
 * @param {Object} props - Component properties
 * @param {Object} props.answer - The answer object containing question ID and content
 * @param {Array} props.filesUsedAsContext - Array of files used as context for RAG (Retrieval-Augmented Generation)
 * @returns {JSX.Element} A div containing the answer content and optional source files
 */
function Answer({ answer, filesUsedAsContext }) {
  let isRAGUsed = filesUsedAsContext && filesUsedAsContext.length !== 0;
  const context = useChat();

  return (
    <div
      className={`${
        context.intentionToDeleteQuestion.questionId === answer?.question_id &&
        "bg-primary_light"
      } rounded-b-3xl px-12 pb-8 pt-2`}
    >
      <div
        className={"relative m-auto flex w-[50%] items-center justify-center"}
      >
        <div
          className={`relative inline-block min-w-[850px] max-w-[850px] rounded-3xl bg-primary_light p-6 ${context.isGeneratingAnswer && "animate-pulse"}`}
        >
          <LogoIcon />
          <HtmlBox>{answer?.content}</HtmlBox>
          {isRAGUsed && (
            <div className="mt-2 inline-block max-w-full overflow-hidden rounded-xl text-left">
              <h2 className="mb-4 text-xl font-[500]">Sources</h2>
              <div className="flex w-full gap-4 overflow-scroll">
                {calculateFileStatistics(filesUsedAsContext)
                  .sort(
                    (a, b) => parseFloat(b.relevance) - parseFloat(a.relevance),
                  )
                  .map((fileStats, index) => (
                    <SourceTag fileStats={fileStats} key={index} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a circular logo icon component with TCS logo.
 * The component is positioned absolutely with specific styling and includes an Image element.
 * @returns {JSX.Element} A div container with the TCS logo image
 */
function LogoIcon() {
  return (
    <div className="absolute left-0 top-0 -translate-x-[140%] rounded-[50%] border border-primary bg-red-50 p-2.5">
      <div className="flex items-center justify-center">
        <Image
          src={"/tcs-logo-no-text.webp"}
          alt="TCS Logo"
          width={26}
          height={26}
        />
      </div>
    </div>
  );
}

export default Answer;
