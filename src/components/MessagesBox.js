"use client";

import Question from "./Question";
import Answer from "./Answer";
import Spinner from "./Spinner";
import { useChatContext } from "@/context/chatContext";

function MessagesBox() {
  const context = useChatContext();

  return !context.isLoading ? (
    <div className="h-[730px] w-full bg-white overflow-scroll flex flex-col items-center justify-start text-sm">
      {context.questions.map((question) => {
        return (
          <div key={question.id} className="w-full">
            <Question
              handleDelete={context.removeQuestionAndAssociatedAnswer}
              questionId={question.id}
            >
              {question.content}
            </Question>
            <Answer
              answer={context.answers.find((answer) => {
                return answer.questionId === question.id;
              })}
              filesUsedAsContext={
                context.answers.find((answer) => {
                  return answer.questionId === question.id;
                })?.filesUsedAsContext
              }
            ></Answer>
          </div>
        );
      })}
    </div>
  ) : (
    <Spinner />
  );
}

export default MessagesBox;
