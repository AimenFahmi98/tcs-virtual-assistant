"use client";

import { useDispatch, useSelector } from "react-redux";
import MessagesBox from "./MessagesBox";
import QuestionBox from "./QuestionInputBox";
import VAWelcome from "./VAWelcome";
import Loading from "@/app/(routes)/virtual-assistant/loading";
import { useEffect } from "react";
import { fetchQuestionsAndAnswers, setRedirectPage } from "@/redux/chatSlice";
import { useRouter } from "next/navigation";

/**
 * A component that renders a virtual assistant interface.
 * Displays a loading state when fetching questions, and either shows
 * a messages box with conversation history or a welcome screen depending
 * on whether there are existing questions.
 * Also includes a question box component for user input.
 *
 * @component
 * @returns {JSX.Element} A virtual assistant interface component
 */
function Conversation() {
  const dispatch = useDispatch();
  const {
    activeConversationId,
    questionAnswerMap,
    isFetchingQuestions,
    redirectPage,
  } = useSelector((state) => state.chat);
  const { currentUser: user } = useSelector((state) => state.users);
  const hasQuestions = Object.keys(questionAnswerMap).length > 0;
  const router = useRouter();
  const isAdmin = user?.roles.some((role) => role.name === "Admin");

  useEffect(() => {
    if (redirectPage !== "") {
      const baseUrl = "http://localhost:3000";
      const fullPath = `${baseUrl}/${redirectPage}`;

      dispatch(setRedirectPage(""));
      router.replace(fullPath);
    }
  }, [redirectPage, dispatch, router, isAdmin]);

  useEffect(() => {
    if (user && activeConversationId) {
      dispatch(
        fetchQuestionsAndAnswers({
          userId: user.id,
          conversationId: activeConversationId,
        }),
      );
    }
  }, [dispatch, activeConversationId, user]);

  return (
    <div className="col-span-1 col-start-2 h-[95%]">
      {isFetchingQuestions ? (
        <Loading />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-8">
          {hasQuestions ? <MessagesBox /> : <VAWelcome />}
          <QuestionBox />
        </div>
      )}
    </div>
  );
}

export default Conversation;
