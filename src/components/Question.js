"use client";

import { useChatContext } from "@/context/chatContext";
import { HiOutlineTrash } from "react-icons/hi2";

function Question({ children, handleDelete, questionId }) {
  const context = useChatContext();

  return (
    <div
      className={`flex items-center justify-center ${
        context.intentionToDeleteQuestion.questionId === questionId &&
        "bg-primary_light"
      } w-full pb-2 pt-8 text-text`}
    >
      <div className="flex w-[46%] items-center justify-end gap-4">
        <div className="flex items-center justify-end">
          <div className="ml-20 w-auto rounded-3xl bg-primary_dark px-6 py-3">
            {children}
          </div>
        </div>
        <button
          onClick={() => handleDelete(questionId)}
          onMouseEnter={() => {
            context.setIntentionToDeleteQuestion({ questionId });
          }}
          onMouseLeave={() => {
            context.setIntentionToDeleteQuestion({ questionId: -1 });
          }}
          className="text-red-400"
        >
          <HiOutlineTrash className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default Question;
