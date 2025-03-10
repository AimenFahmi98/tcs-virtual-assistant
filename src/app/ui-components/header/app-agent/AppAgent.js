"use client";

import { useDispatch, useSelector } from "react-redux";
import Conversation from "./Conversation";
import QuestionInput from "./QuestionInput";
import {
  clearConversation,
  createQuestion,
  generateAnswer,
} from "@/redux/agentSlice";
import Spinner from "../../common/Spinner";
import { HiTrash } from "react-icons/hi2";

function AppAgent() {
  const { currentUser: user } = useSelector((state) => state.users);
  const { loadingStates } = useSelector((state) => state.agent);
  const dispatch = useDispatch();

  function onSubmitQuestion(content) {
    dispatch(createQuestion({ content, userId: user.id }));
    dispatch(generateAnswer({ userId: user.id, message: content }));
  }

  return (
    <div className="rouded-xl flex h-full flex-col rounded-xl bg-background p-6 text-text">
      {loadingStates.loadingConversation ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <Conversation
            className={`${loadingStates.clearingConversation && "opacity-30"}`}
          />
          <div className="flex items-center justify-start gap-3 py-4">
            <button
              className="flex items-center justify-center gap-2 text-nowrap rounded-lg bg-red-500 px-3 py-1.5 text-[13px] font-medium text-red-50 transition-all duration-150 hover:cursor-pointer hover:bg-red-700"
              onClick={() => dispatch(clearConversation(user.id))}
            >
              {loadingStates.clearingConversation ? (
                <Spinner size="15px" borderSize="2px" color="#fef2f2" />
              ) : (
                <HiTrash className="h-[15px] w-[15px]" />
              )}
              <span>Clear Conversation</span>
            </button>
          </div>
          <QuestionInput
            className={"bg-primary"}
            size="sm"
            onSubmit={onSubmitQuestion}
            isLoading={
              loadingStates.creatingQuestion || loadingStates.generatingAnswer
            }
          />
        </>
      )}
    </div>
  );
}

export default AppAgent;
