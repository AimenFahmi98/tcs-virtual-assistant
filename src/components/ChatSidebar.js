"use client";

import { LuSearch } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";
import { useChatContext } from "@/context/chatContext";
import ConversationHistory from "./ConversationHistory";
import Sidebar from "./Sidebar";

function ChatSidebar() {
  const context = useChatContext();

  return (
    <Sidebar className={"relative row-span-full gap-8"}>
      <div className="flex items-center justify-end">
        <button
          className="p-3"
          onClick={() => context.createNewEmptyConversation()}
        >
          <TbEdit className="h-7 w-7 text-gray-500 hover:text-gray-800" />
        </button>
        <button className="p-3">
          <LuSearch className="h-7 w-7 text-gray-500 hover:text-gray-800" />
        </button>
      </div>

      <ConversationHistory />
    </Sidebar>
  );
}

export default ChatSidebar;
