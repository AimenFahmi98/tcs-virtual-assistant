"use client";

import { deleteQuestion } from "@/redux/chatSlice";
import { HiOutlineTrash, HiTrash } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { setAboutToDeleteQuestion } from "@/redux/chatSlice";
import { FaTrash, FaTrashCan } from "react-icons/fa6";
import { IoIosTrash } from "react-icons/io";
import { BsFillTrash3Fill } from "react-icons/bs";

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
  const { currentUser: user } = useSelector((state) => state.users);
  const { activeConversationId, aboutToDeleteQuestion } = useSelector(
    (state) => state.chat,
  );
  const isAboutToDelete = aboutToDeleteQuestion === question.id;

  return (
    <div
      className={` ${
        isAboutToDelete && "bg-primary_light"
      } rounded-t-3xl px-12 pb-2 pt-8 text-text`}
    >
      <div className="xs:w-[950px] relative m-auto flex w-[80%] items-center justify-end gap-4">
        <div className="flex items-center justify-end">
          <div className="ml-20 w-auto rounded-3xl bg-primary_dark px-6 py-3">
            {children}
          </div>
        </div>
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
          onMouseEnter={() => {
            dispatch(setAboutToDeleteQuestion(question.id));
          }}
          onMouseLeave={() => {
            dispatch(setAboutToDeleteQuestion(-1));
          }}
          className="text-red-400"
        >
          <HiTrash className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default Question;
