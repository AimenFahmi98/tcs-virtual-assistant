"use client";

import { ChatContextProvider, useChatContext } from "@/context/chatContext";
import MessagesBox from "./MessagesBox";
import QuestionBox from "./QuestionBox";
import VAWelcome from "./VAWelcome";
import Loading from "@/app/(routes)/virtual-assistant/loading";

function VirtualAssistant() {
  const context = useChatContext();

  return (
    <div className="col-span-1 col-start-2 h-[95%]">
      {context.isFetchingForQuestions ? (
        <Loading />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-8">
          {context.hasQuestions ? <MessagesBox /> : <VAWelcome />}
          <QuestionBox />
        </div>
      )}
    </div>
  );
}

export default VirtualAssistant;
