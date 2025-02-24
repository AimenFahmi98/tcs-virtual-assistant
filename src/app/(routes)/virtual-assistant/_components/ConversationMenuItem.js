"use client";

import { useState } from "react";
import { TbTrash } from "react-icons/tb";
import { BiEdit } from "react-icons/bi";
import SlidingExtensionMenu from "@/app/ui-components/SlidingExtensionMenu";
import { useDispatch, useSelector } from "react-redux";
import { deleteConversation, setActiveConversationId } from "@/redux/chatSlice";
import Spinner from "@/app/ui-components/Spinner";
import { redirect } from "next/navigation";

/**
 * Renders a conversation component with hover effects and sliding menu
 * @param {Object} props - Component properties
 * @param {string} props.title - Title of the conversation
 * @param {boolean} props.isActive - Whether the conversation is currently active
 * @param {Function} props.setActive - Function to set this conversation as active
 * @param {string} props.conversationId - Unique identifier for the conversation
 * @returns {JSX.Element} A conversation component with title and menu options
 */
function ConversationMenuItem({ conversation }) {
  const dispatch = useDispatch();
  const { activeConversationId, isDeletingConversation } = useSelector(
    (state) => state.chat,
  );
  const { currentUser: user } = useSelector((state) => state.users);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const isActive = activeConversationId === conversation?.id;

  return conversation ? (
    <div
      className={`rounded-xl px-4 py-2 ${
        isActive ? "bg-primary_dark" : "bg-primary"
      } relative min-h-10 w-full overflow-hidden text-text hover:text-text_light ${isActive && isDeletingConversation ? "opacity-20" : ""}`}
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
            onClick={() => {
              dispatch(
                deleteConversation({
                  userId: user.id,
                  conversationId: conversation.id,
                }),
              );
            }}
          >
            <TbTrash className="h-5 w-5 text-red-400" />
          </button>
        </SlidingExtensionMenu>
      )}
      <button
        onClick={() => {
          dispatch(setActiveConversationId(conversation.id));
          redirect(`/virtual-assistant/${conversation.id}`);
        }}
        className="w-full truncate text-left text-sm"
      >
        {conversation.title}
      </button>
    </div>
  ) : (
    <Spinner />
  );
}

export default ConversationMenuItem;
