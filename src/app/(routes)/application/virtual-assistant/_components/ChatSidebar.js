"use client";

import Sidebar from "@/app/ui-components/sidebar/Sidebar";
import { LuSearch } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";
import ConversationHistory from "./ConversationHistory";
import { useDispatch, useSelector } from "react-redux";
import { createNewEmptyConversation } from "@/redux/chatSlice";

function ChatSidebar() {
  const dispatch = useDispatch();
  const { currentUser: user } = useSelector((state) => state.users);

  return (
    <Sidebar>
      <div className="flex items-center justify-end">
        <button
          className="p-3"
          onClick={() =>
            dispatch(createNewEmptyConversation({ userId: user.id }))
          }
        >
          <TbEdit className="h-7 w-7 text-gray-500 hover:text-text" />
        </button>
        <button className="p-3">
          <LuSearch className="h-7 w-7 text-gray-500 hover:text-text" />
        </button>
      </div>

      <ConversationHistory />
    </Sidebar>
  );
}

export default ChatSidebar;
