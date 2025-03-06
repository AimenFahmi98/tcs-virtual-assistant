"use client";

import { useEffect, useRef } from "react";
import { BsArrowUpCircleFill } from "react-icons/bs";
import Spinner from "@/app/ui-components/common/Spinner";
import VoiceRecorder from "@/app/ui-components/common/VoiceRecorder";

const sizeConfig = {
  sm: {
    padding: "px-4",
    textArea: "text-[15px]",
    iconSize: "h-7 w-7",
    maxLines: 5,
  },
  md: {
    padding: "px-8 py-4",
    textArea: "text-base",
    iconSize: "h-9 w-9",
    maxLines: 7,
  },
  lg: {
    padding: "px-10 py-6",
    textArea: "text-lg",
    iconSize: "h-12 w-12",
    maxLines: 9,
  },
};

function QuestionInput({
  className,
  onSubmit,
  isLoading = false,
  placeholder = "Ask a question...",
  size = "md",
}) {
  const textAreaRef = useRef();
  const formRef = useRef();
  const currentSize = sizeConfig[size] || sizeConfig.md;

  function adjustTextAreaHeight() {
    const maxNumberOfLines = currentSize.maxLines;
    const textarea = textAreaRef.current;
    textarea.style.height = "auto";

    const maxHeight =
      maxNumberOfLines *
      parseFloat(getComputedStyle(textarea).lineHeight) *
      0.5; // Added 0.8 multiplier
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current.requestSubmit();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const question = e.target.elements.question.value.trim();
    if (question) {
      onSubmit(question);
      e.target.elements.question.value = "";
      adjustTextAreaHeight();
    }
  }

  // Add useEffect import at the top of the file along with useRef

  // Add this effect before the return statement
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div
      className={`flex items-center justify-center rounded-2xl ${className} transition-all duration-200 ease-out`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center justify-center gap-2"
        ref={formRef}
      >
        <textarea
          className={`w-full resize-none bg-inherit ${currentSize.padding} ${currentSize.textArea} text-text outline-none placeholder:text-text_light`}
          name="question"
          placeholder={placeholder}
          autoComplete="off"
          rows="1"
          onKeyDown={handleKeyDown}
          onInput={adjustTextAreaHeight}
          ref={textAreaRef}
        />
        <button
          disabled={isLoading}
          type="submit"
          className="hover:text-gray-600"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <BsArrowUpCircleFill
              className={`${currentSize.iconSize} text-text hover:text-text_light`}
            />
          )}
        </button>
        <VoiceRecorder
          onTranscription={onSubmit}
          iconSize={currentSize.iconSize}
        />
      </form>
    </div>
  );
}

export default QuestionInput;
