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
      } pt-8 pb-2 w-full`}
    >
      <div className="flex items-center justify-end w-[46%] gap-4">
        <div className=" flex items-center justify-end">
          <div className="w-auto bg-primary_dark px-6 py-3 rounded-3xl ml-20">
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
          <HiOutlineTrash className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default Question;
