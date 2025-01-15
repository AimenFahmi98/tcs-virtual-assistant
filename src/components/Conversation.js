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
      className={`rounded-xl px-4 py-2 ${
        isActive ? "bg-primary_dark" : "bg-primary"
      } relative w-full text-text hover:text-text_light`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(isHovered || isMenuExpanded) && (
        <ExtensionMenu
          className={
            "absolute right-0 top-0 h-full rounded-lg bg-inherit px-3 text-text"
          }
          onExpand={() => setIsMenuExpanded(true)}
          onClose={() => setIsMenuExpanded(false)}
        >
          <button className="mx-2 flex w-[90%] items-center justify-start gap-4 rounded-lg px-4 py-3 text-sm text-text hover:bg-primary">
            <BiEdit className="h-5 w-5" />
            <span className="text-left">Rename</span>
          </button>
          <div className="m-auto my-1 h-px w-[80%] bg-primary_darker"></div>
          <button
            className="mx-2 flex w-[90%] items-center justify-start gap-4 rounded-lg px-4 py-3 text-sm text-text hover:cursor-pointer hover:bg-primary"
            onClick={() =>
              context.deleteConversation(context.activeConversationId)
            }
          >
            <TbTrash className="h-5 w-5 text-red-400" />
            <span className="text-left text-red-400">Delete</span>
          </button>
        </ExtensionMenu>
      )}
      <button
        onClick={() => setActive()}
        className="w-full truncate text-left text-sm"
      >
        {title}
      </button>
    </div>
  );
}

export default Conversation;
