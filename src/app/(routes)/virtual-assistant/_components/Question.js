"use client";

import { deleteQuestion } from "@/redux/chatSlice";
import { HiOutlineTrash, HiTrash } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { setAboutToDeleteQuestion } from "@/redux/chatSlice";
import Image from "next/image";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useState } from "react";
import ExtensionMenu from "@/app/ui-components/common/ExtensionMenu";

/**
 * A component that renders a question with delete functionality
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The content to be displayed inside the question
 * @param {Function} props.handleDelete - Function to handle deletion of the question
 * @param {number} props.questionId - Unique identifier for the question
 * @returns {JSX.Element} A question component with delete functionality
 */
function Question({ children, question }) {
  const dispatch = useDispatch();
  const { activeConversationId } = useSelector((state) => state.chat);
  const { currentUser: user } = useSelector((state) => state.users);
  const [isHovered, setIsHovered] = useState(false);
  const { aboutToDeleteQuestion, questionIdBeingDeleted } = useSelector(
    (state) => state.chat,
  );
  const isAboutToDelete = aboutToDeleteQuestion === question.id;
  const isBeingDeleted = question.id === questionIdBeingDeleted;

  return (
    <div
      className={` ${
        isAboutToDelete && "bg-primary_light"
      } rounded-t-3xl px-12 pb-2 pt-8 text-text ${isBeingDeleted && "opacity-20"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative m-auto flex w-[80%] items-center justify-end gap-2 xs:w-[950px]">
        <div className="flex items-center justify-end">
          <div className="ml-20 w-auto rounded-3xl bg-primary_dark px-6 py-3">
            {children}
          </div>
        </div>
        <div className="rounded-full border border-primary_light p-1">
          <Image
            src={
              user?.profile_picture ||
              "https://api.dicebear.com/7.x/avataaars/svg"
            }
            alt="Profile"
            width={30}
            height={30}
            className="rounded-full object-cover"
          />
        </div>
        {isHovered && (
          <div className="absolute right-0 top-0 z-10 translate-x-[5px] translate-y-[8px]">
            <ExtensionMenu onOpen={() => setIsHovered(true)}>
              <button
                onClick={() =>
                  dispatch(
                    deleteQuestion({
                      userId: user.id,
                      conversationId: activeConversationId,
                      questionId: question.id,
                    }),
                  )
                }
                className="flex items-center gap-2 rounded px-2 py-1 hover:bg-primary"
              >
                <HiTrash className="h-4 w-4 text-red-500" />

                <span className="text-sm font-medium text-red-500">Delete</span>
              </button>
            </ExtensionMenu>
          </div>
        )}
        {/* <button
          onClick={() =>
            dispatch(
              deleteQuestion({
                userId: user.id,
                conversationId: activeConversationId,
                questionId: question.id,
              }),
            )
          }
          onMouseEnter={() => {
            dispatch(setAboutToDeleteQuestion(question.id));
          }}
          onMouseLeave={() => {
            dispatch(setAboutToDeleteQuestion(-1));
          }}
          className="text-red-400"
        >
          <HiTrash className="h-6 w-6" />
        </button> */}
      </div>
    </div>
  );
}

export default Question;
