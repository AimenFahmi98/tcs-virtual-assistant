"use client";

import { useRef } from "react";
import { BsArrowUpCircleFill } from "react-icons/bs";
import Spinner from "@/app/ui-components/common/Spinner";
import VoiceRecorder from "@/app/ui-components/common/VoiceRecorder";
import { useDispatch, useSelector } from "react-redux";
import { submitQuestion } from "@/redux/chatSlice";

/**
 * A React component that renders an interactive question input box with form submission capabilities.
 * The component includes text input with auto-expanding functionality and handles both text and voice input (not yet supported).
 *
 * @component
 * @example
 * return (
 *   <QuestionBox />
 * )
 *
 * @returns {JSX.Element} A form containing a textarea for question input and submission buttons
 *
 * Features:
 * - Auto-adjusting textarea height based on content
 * - Stream-based answer generation
 * - Enter key submission support (without shift)
 * - Loading state indication
 * - Voice input capability (to be added)
 * - Dynamic width expansion on focus
 *
 * @requires useRef from 'react'
 * @requires useChat from context
 * @requires BsArrowUpCircleFill from 'react-icons/bs'
 * @requires LuAudioLines from 'react-icons/lu'
 * @requires Spinner component
 */
function QuestionBox() {
  const textAreaRef = useRef();
  const formRef = useRef();
  const dispatch = useDispatch();
  const { isGeneratingAnswer } = useSelector((state) => state.chat);
  const { availableRAGDocuments } = useSelector((state) => state.documents);
  const { currentUser: user } = useSelector((state) => state.users);

  async function handleSubmitQuestion(question) {
    dispatch(
      submitQuestion({
        user,
        question: question,
        RAGDocumentIds: availableRAGDocuments.map((doc) => doc.id) || [],
        RAGDocumentNames: availableRAGDocuments.map((doc) => doc.name) || [],
      }),
    );

    adjustTextAreaHeight();
  }

  /**
   * Dynamically adjusts the height of a textarea element up to a maximum number of lines.
   * The function first resets the textarea's height to auto, then calculates and sets
   * the new height based on content, ensuring it doesn't exceed the height of 7 lines.
   * @function adjustTextAreaHeight
   * @requires textAreaRef - React ref object pointing to the textarea element
   */
  function adjustTextAreaHeight() {
    const maxNumberOfLines = 7;
    const textarea = textAreaRef.current;
    // Reset height to calculate new height properly
    textarea.style.height = "auto";

    // Calculate the new height and ensure it doesn't exceed the maximum height
    const maxHeight =
      maxNumberOfLines * parseFloat(getComputedStyle(textarea).lineHeight); // 4 lines
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter behavior (adding a new line)
      formRef.current.requestSubmit(); // Programmatically submit the form
    }
  }

  function handleInput() {
    adjustTextAreaHeight(); // Adjust height dynamically as the user types
  }

  return (
    <div className="flex w-[90%] max-w-[600px] items-center justify-center rounded-2xl bg-primary transition-all duration-200 ease-out xl:focus-within:shadow-lg_custom">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const question = e.target.elements.question.value.trim();
          e.target.elements.question.value = "";
          handleSubmitQuestion(question);
        }}
        className="flex w-full items-center justify-center gap-2"
        ref={formRef}
      >
        <textarea
          className="text-md placeholder:text-md w-full resize-none bg-inherit px-8 py-4 text-text outline-none placeholder:text-text_light"
          name="question"
          placeholder="Ask me anything..."
          autoComplete="off"
          rows="1"
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          ref={textAreaRef}
        />
        <button
          disabled={isGeneratingAnswer}
          type="submit"
          className="hover:text-gray-600"
        >
          {isGeneratingAnswer ? (
            <Spinner />
          ) : (
            <BsArrowUpCircleFill className="h-8 w-8 text-text hover:text-text_light" />
          )}
        </button>
        <VoiceRecorder
          onTranscription={handleSubmitQuestion}
          iconSize={"h-7 w-7"}
        />
      </form>
    </div>
  );
}

export default QuestionBox;
