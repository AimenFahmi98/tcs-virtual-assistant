"use client";

import { useEffect, useRef, useState } from "react"; // Add useState
import Question from "./Question";
import Answer from "./Answer";
import Spinner from "@/app/ui-components/Spinner";
import { useChat } from "@/context/chatContext";
import { ArrowDownward } from "@mui/icons-material";

function MessagesBox() {
  const context = useChat();
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle scroll event to show/hide button
  const handleScroll = (e) => {
    const element = e.target;
    const isNotAtBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight > 100;
    setShowScrollButton(isNotAtBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [context.questions, context.answers]);

  return !context.isLoading ? (
    <div
      className="relative flex h-[730px] w-full flex-col items-center justify-start overflow-y-scroll text-sm"
      onScroll={handleScroll}
    >
      {context.questions.map((question) => {
        return (
          <div key={question.id}>
            <Question
              handleDelete={context.deleteQuestion}
              questionId={question.id}
            >
              {question.content}
            </Question>
            <Answer
              answer={context.answers.find((answer) => {
                return answer.question_id === question.id;
              })}
              filesUsedAsContext={
                context.answers.find((answer) => {
                  return answer.question_id === question.id;
                })?.filesUsedAsContext
              }
            ></Answer>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-0 -translate-x-1/2 -translate-y-[9rem] rounded-full border border-primary bg-background p-2 text-text shadow-lg hover:bg-primary_light"
        >
          <ArrowDownward />
        </button>
      )}
    </div>
  ) : (
    <Spinner />
  );
}

export default MessagesBox;
