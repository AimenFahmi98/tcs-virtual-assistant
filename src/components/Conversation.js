import { useEffect, useRef, useState } from "react";
import ExtensionMenu from "./ExtensionMenu";
import { TbTrash } from "react-icons/tb";
import { BiEdit } from "react-icons/bi";
import { useChatContext } from "@/context/chatContext";

function Conversation({ title, isActive, setActive }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const context = useChatContext();

  return (
    <div
      className={`px-4 py-2 rounded-xl ${
        isActive ? "bg-primary_dark" : "bg-primary"
      } hover:text-text_light relative w-full`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(isHovered || isMenuExpanded) && (
        <ExtensionMenu
          className={
            "absolute top-0 right-0 h-full text-black bg-inherit px-3 rounded-lg"
          }
          onExpand={() => setIsMenuExpanded(true)}
          onClose={() => setIsMenuExpanded(false)}
        >
          <button className="w-[90%] py-3 px-4 mx-2 flex items-center justify-start gap-4 hover:bg-primary text-text text-sm rounded-lg">
            <BiEdit className="w-5 h-5" />
            <span className=" text-left">Rename</span>
          </button>
          <div className="w-[80%] m-auto h-px bg-primary_darker my-1"></div>
          <button
            className="w-[90%] py-3 px-4 mx-2 flex items-center justify-start gap-4 hover:bg-primary text-text text-sm rounded-lg"
            onClick={() =>
              context.deleteConversation(context.activeConversationId)
            }
          >
            <TbTrash className="w-5 h-5 text-red-400" />
            <span className=" text-left text-red-400">Delete</span>
          </button>
        </ExtensionMenu>
      )}
      <button
        onClick={() => setActive()}
        className="truncate text-sm text-left w-full"
      >
        {title}
      </button>
    </div>
  );
}

export default Conversation;
