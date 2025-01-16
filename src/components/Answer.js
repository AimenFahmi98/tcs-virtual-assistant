import { FaFilePdf } from "react-icons/fa";
import { FaFileWord } from "react-icons/fa";
import { BsFillFileEarmarkTextFill } from "react-icons/bs";
import HtmlBox from "./HtmlBox";
import Image from "next/image";
import { useChatContext } from "@/context/chatContext";

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

function Answer({ answer, filesUsedAsContext }) {
  let isRAGUsed = filesUsedAsContext && filesUsedAsContext.length !== 0;
  const context = useChatContext();

  return (
    <div
      className={`${
        context.intentionToDeleteQuestion.questionId === answer?.questionId &&
        "bg-primary_light"
      } rounded-b-3xl px-12 pb-8 pt-2`}
    >
      <div
        className={"relative m-auto flex w-[50%] items-center justify-center"}
      >
        <div className="relative inline-block min-w-[850px] max-w-[850px] rounded-3xl bg-primary_light p-6">
          <LogoIcon />
          <HtmlBox>{answer?.content}</HtmlBox>
          {isRAGUsed && (
            <div className="mt-2 inline-block max-w-full overflow-hidden rounded-xl text-left">
              <h2 className="mb-4 text-xl font-[500]">Sources</h2>
              <div className="flex w-full gap-4 overflow-scroll">
                {calculateFileStatistics(filesUsedAsContext).map(
                  (fileStats, index) => (
                    <SourceTag fileStats={fileStats} key={index} />
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
      <div className={`w-30 text-ellipsis text-nowrap ${textColor}`}>
        {fileStats.file}
      </div>
    </div>
  );
}

export default Answer;
