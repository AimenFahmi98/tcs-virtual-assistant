"use client";

import { useEffect, useRef, useState } from "react"; // Add useState
import Question from "./Question";
import Answer from "./Answer";
import Spinner from "@/app/ui-components/common/Spinner";
import { ArrowDownward } from "@mui/icons-material";
import { useSelector } from "react-redux";

function MessagesBox() {
  const { questionAnswerMap, isFetchingQuestions } = useSelector(
    (state) => state.chat,
  );
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
  }, []);

  return !isFetchingQuestions ? (
    <div
      className="relative flex h-full w-full flex-col items-center justify-start overflow-y-scroll text-sm xs:h-[730px]"
      onScroll={handleScroll}
    >
      {Object.keys(questionAnswerMap).map((questionId) => {
        return (
          <div key={questionId}>
            <Question question={questionAnswerMap[questionId].question}>
              {questionAnswerMap[questionId].question.content}
            </Question>
            <Answer
              answer={questionAnswerMap[questionId].answers[0]}
              filesUsedAsContext={
                questionAnswerMap[questionId].answers[0].filesUsedAsContext
              }
            />
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
