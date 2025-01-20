import { useState } from "react";
import { TbTrash } from "react-icons/tb";
import { BiEdit } from "react-icons/bi";
import { useChatContext } from "@/context/chatContext";
import SlidingExtensionMenu from "./SlidingExtensionMenu";

function Conversation({ title, isActive, setActive, conversationId }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const context = useChatContext();

  return (
    <div
      className={`rounded-xl px-4 py-2 ${
        isActive ? "bg-primary_dark" : "bg-primary"
      } relative w-full overflow-hidden text-text hover:text-text_light`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(isHovered || isMenuExpanded) && (
        <SlidingExtensionMenu
          className={
            "absolute right-0 top-0 h-full rounded-xl bg-inherit px-3 text-text"
          }
          onExpand={() => setIsMenuExpanded(true)}
          onClose={() => setIsMenuExpanded(false)}
        >
          <button className="rounded-xl px-2 py-2 hover:bg-primary">
            <BiEdit className="h-5 w-5" />
          </button>
          <button
            className="rounded-xl px-2 py-2 hover:bg-primary"
            onClick={() => context.deleteConversation(conversationId)}
          >
            <TbTrash className="h-5 w-5 text-red-400" />
          </button>
        </SlidingExtensionMenu>
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
