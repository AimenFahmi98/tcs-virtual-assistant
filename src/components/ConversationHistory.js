"use client";

import { useChatContext } from "@/context/chatContext";
import Conversation from "./Conversation";

function ConversationHistory() {
  const context = useChatContext();

  return (
    <div className="flex flex-col items-start justify-center px-4 gap-4 w-full">
      <span className="text-md font-bold text-text">Conversations</span>
      <div className="flex flex-col gap-2 w-full">
        {context.conversations.map((conversation) => (
          <Conversation
            title={conversation.title}
            isActive={conversation.id === context.activeConversationId}
            setActive={() => context.setActiveConversationId(conversation.id)}
            key={conversation.id}
          />
        ))}
      </div>
    </div>
  );
}

export default ConversationHistory;
