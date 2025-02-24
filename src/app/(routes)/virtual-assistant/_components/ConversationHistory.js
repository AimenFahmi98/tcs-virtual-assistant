"use client";

import ConversationMenuItem from "@/app/(routes)/virtual-assistant/_components/ConversationMenuItem";
import Loading from "@/app/(routes)/virtual-assistant/loading";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "@/redux/chatSlice";
import { useEffect } from "react";

/**
 * Renders a list of conversations in a scrollable container.
 * Uses the chat context to manage conversation state and display.
 * Shows a loading state while fetching conversations.
 * Each conversation is rendered as a clickable item that can be set as active.
 *
 * @returns {JSX.Element} A div containing the conversations list with a header
 * @component
 */
function ConversationHistory() {
  const dispatch = useDispatch();
  const { conversations, isFetchingConversations } = useSelector(
    (state) => state.chat,
  );
  const { currentUser: user } = useSelector((state) => state.users);

  useEffect(() => {
    if (user) {
      dispatch(fetchConversations(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className="flex max-h-[70%] min-h-[70%] w-full flex-col items-start justify-start gap-4 overflow-auto px-4 pt-4">
      <span className="text-md font-bold text-text">Conversations</span>
      {isFetchingConversations || !conversations ? (
        <Loading />
      ) : (
        <div className="flex w-full flex-col gap-2 overflow-y-scroll">
          {conversations.map((conversation) => (
            <ConversationMenuItem
              conversation={conversation}
              key={conversation.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ConversationHistory;
