"use client";

import { ChatContextProvider, useChat } from "@/context/chatContext";
import MessagesBox from "./MessagesBox";
import QuestionBox from "./QuestionBox";
import VAWelcome from "./VAWelcome";
import Loading from "@/app/(routes)/virtual-assistant/loading";

/**
 * A component that renders a virtual assistant interface.
 * Displays a loading state when fetching questions, and either shows
 * a messages box with conversation history or a welcome screen depending
 * on whether there are existing questions.
 * Also includes a question box component for user input.
 *
 * @component
 * @returns {JSX.Element} A virtual assistant interface component
 */
function VirtualAssistant() {
  const context = useChat();
  console.log(context.hasQuestions);

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
