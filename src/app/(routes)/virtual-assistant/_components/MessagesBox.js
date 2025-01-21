"use client";

import Question from "./Question";
import Answer from "./Answer";
import Spinner from "@/app/ui-components/Spinner";
import { useChat } from "@/context/chatContext";

/**
 * Renders a messages container component that displays a list of questions and their corresponding answers.
 * Uses the chat context to manage the state of messages and loading status.
 *
 * @component
 * @returns {JSX.Element} Returns either a scrollable div containing Question and Answer components, or a Spinner component when loading.
 *
 * @example
 * return (
 *   <MessagesBox />
 * )
 *
 * @requires useChat - Custom hook that provides chat context
 * @requires Question - Component that renders a question
 * @requires Answer - Component that renders an answer
 * @requires Spinner - Loading indicator component
 */
function MessagesBox() {
  const context = useChat();

  return !context.isLoading ? (
    <div className="flex h-[730px] w-full flex-col items-center justify-start overflow-y-scroll text-sm">
      {context.questions.map((question) => {
        return (
          <div key={question.id}>
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
