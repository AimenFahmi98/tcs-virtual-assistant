"use client";

import { useChatContext } from "@/context/chatContext";
import Conversation from "./Conversation";
import Loading from "@/app/(routes)/virtual-assistant/loading";

function ConversationHistory() {
  const context = useChatContext();

  return (
    <div className="flex max-h-[70%] min-h-[70%] w-full flex-col items-start justify-start gap-4 overflow-visible px-4">
      <span className="text-md font-bold text-text">Conversations</span>
      {context.isFetchingForConversations ? (
        <Loading />
      ) : (
        <div className="flex w-full flex-col gap-2 overflow-y-scroll">
          {context.conversations.map((conversation) => (
            <Conversation
              title={conversation.title}
              isActive={conversation.id === context.activeConversationId}
              setActive={() => context.setActiveConversationId(conversation.id)}
              conversationId={conversation.id}
              key={conversation.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ConversationHistory;
