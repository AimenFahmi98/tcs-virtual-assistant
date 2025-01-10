"use client";

import { useState } from "react";
import { BsLayoutSidebarInset } from "react-icons/bs";
import ThemePicker from "./ThemePicker";
import { LuSearch } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";
import { useChatContext } from "@/context/chatContext";
import ConversationHistory from "./ConversationHistory";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const context = useChatContext();

  return (
    <>
      <div
        className={`row-span-full flex h-screen flex-col justify-start bg-primary_light transition-all duration-300 ease-out ${
          isOpen ? "w-80" : "w-0"
        } relative gap-8`}
      >
        {/* <ThemePicker /> */}

        {/* Tools div on top of the sidebar */}
        {isOpen && (
          <div className="flex items-center justify-end">
            <button
              className="p-3"
              onClick={() => context.createNewEmptyConversation()}
            >
              <TbEdit className="w-7 h-7 text-gray-500 hover:text-gray-800" />
            </button>
            <button className="p-3">
              <LuSearch className="w-7 h-7 text-gray-500 hover:text-gray-800" />
            </button>
          </div>
        )}
        {/* Conversations */}
        {isOpen && <ConversationHistory />}
      </div>

      <BtnOpenSidebar setIsOpen={setIsOpen} />
    </>
  );
}

function BtnOpenSidebar({ setIsOpen, hoverBgColor }) {
  return (
    <button
      onClick={() => setIsOpen((isOpen) => !isOpen)}
      className={`absolute left-3 top-0.5 p-3 text-gray-500 hover:text-gray-800 rounded-lg`}
    >
      <BsLayoutSidebarInset className={`h-7 w-7`} />
    </button>
  );
}

export default Sidebar;
