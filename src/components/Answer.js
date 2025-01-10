import { BsFiletypePdf } from "react-icons/bs";
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
      } pb-8 pt-2`}
    >
      <div
        className={"relative flex items-center justify-start w-[45%] m-auto"}
      >
        <LogoIcon />
        <div className="inline-block max-w-[96%] w-auto bg-primary_light p-6 rounded-3xl">
          <HtmlBox>{answer?.content}</HtmlBox>
          {isRAGUsed && (
            <div className="mt-6 py-4 px-6 rounded-xl bg-accent inline-block text-center">
              <h2 className="text-xl mb-4">Sources</h2>
              <div className="flex gap-4">
                {calculateFileStatistics(filesUsedAsContext).map(
                  (fileStats, index) => (
                    <SourceTag fileStats={fileStats} key={index} />
                  )
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
    <div className="absolute top-0 left-0 -translate-x-[140%] bg-red-50 p-2.5 border border-primary rounded-[50%]">
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
  return (
    <div className="flex items-center justify-center text-[11px] rounded-full bg-white px-4 py-2 border border-red-300">
      <div className="flex items-center justify-center mr-2">
        <BsFiletypePdf className="text-red-600 w-4 h-4" />
      </div>
      <div>{fileStats.file}</div>
    </div>
  );
}

export default Answer;
