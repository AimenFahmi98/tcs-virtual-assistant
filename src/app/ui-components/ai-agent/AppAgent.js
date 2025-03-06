"use client";

import { useDispatch, useSelector } from "react-redux";
import Conversation from "./Conversation";
import QuestionInput from "./QuestionInput";
import { createQuestion, generateAnswer } from "@/redux/agentSlice";
import Spinner from "../common/Spinner";

function AppAgent() {
  const { currentUser: user } = useSelector((state) => state.users);
  const { loadingStates, questions } = useSelector((state) => state.agent);
  const dispatch = useDispatch();

  function onSubmitQuestion(content) {
    dispatch(createQuestion({ content, userId: user.id }));
    dispatch(generateAnswer({ userId: user.id, message: content }));
  }

  return (
    <div className="flex h-full flex-col text-text">
      {loadingStates.loadingConversation ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <Conversation />
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
