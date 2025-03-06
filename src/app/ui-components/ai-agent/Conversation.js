"use client";

import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import Question from "./Question";
import Answer from "./Answer";

function Conversation() {
  const { questions, questionAnswerMap } = useSelector((state) => state.agent);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [questions, questionAnswerMap]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex flex-col gap-4 p-4">
        {questions.map((question) => (
          <div key={question.id}>
            <Question
              className={
                "mb-4 justify-self-end rounded-3xl bg-primary_dark px-4 py-2 text-sm"
              }
            >
              {question.content}
            </Question>
            <div>
              {questionAnswerMap[question.id].map((answer) => (
                <Answer
                  key={answer.id}
                  className={"rounded-3xl bg-primary_light px-4 py-2 text-sm"}
                >
                  {answer.content}
                </Answer>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Conversation;
