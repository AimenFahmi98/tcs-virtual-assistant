"use client";

import { useRef } from "react";
import { BsArrowUpCircleFill } from "react-icons/bs";
import Spinner from "@/app/ui-components/Spinner";
import { useChat } from "@/context/chatContext";
import { LuAudioLines } from "react-icons/lu";

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
  const context = useChat();

  /**
   * Handles the submission of a question in the virtual assistant interface.
   *
   * This async function processes the question submission, sends it to the OpenAI API,
   * handles the streaming response, and updates the UI accordingly. It also manages
   * conversation titles and document context tracking.
   *
   * @param {Event} e - The form submission event
   * @throws {Error} When there's an issue with the API communication
   * @async
   *
   * The function performs the following steps:
   * 1. Prevents form default behavior and validates input
   * 2. Stores the question in the context
   * 3. Sends question to OpenAI API with relevant document context
   * 4. Processes streaming response and updates UI
   * 5. Fetches and updates conversation title and used files
   * 6. Handles error cases and resets loading state
   */
  async function handleSubmitQuestion(e) {
    context.setIsGeneratingAnswer(true);
    e.preventDefault();

    const question = e.target.elements.question.value.trim();
    e.target.elements.question.value = "";
    adjustTextAreaHeight();

    if (!question) {
      context.setIsGeneratingAnswer(false);
      return;
    }

    try {
      const questionId = await context.storeQuestion(question);

      // Fetch the answer stream and files used
      const documentNames = context.documents.map((doc) => doc.name);

      const response = await fetch("http://localhost:3000/api/openai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          activeConversationId: context.activeConversationId,
          RAGDocumentNames: documentNames,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = context.createNewEmptyAnswer(questionId);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        answer.content += chunk;

        context.updateAnswer(answer); // Update the answer in the UI
      }

      // Fetch the new title and files used
      const titleAndFilesUsedResponse = await fetch(
        `http://localhost:3000/api/openai?conversationId=${context.activeConversationId}`,
      );

      if (titleAndFilesUsedResponse.ok) {
        const { newConversationTitle, filesUsed } =
          await titleAndFilesUsedResponse.json();

        context.updateConversationTitle(
          context.activeConversationId,
          newConversationTitle,
        );

        // Optionally, store or process the filesUsed
        answer.filesUsedAsContext = filesUsed;
        context.updateAnswer(answer);

        await context.storeAnswer(answer);
      } else {
        console.error("Failed to fetch new conversation title or files used.");
      }
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
    } finally {
      context.setIsGeneratingAnswer(false);
    }
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
    <div className="flex w-[600px] items-center justify-center rounded-2xl bg-primary transition-all duration-200 ease-out focus-within:w-[650px] focus-within:shadow-lg_custom">
      <form
        onSubmit={handleSubmitQuestion}
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
          disabled={context.isGeneratingAnswer}
          type="submit"
          className="hover:text-gray-600"
        >
          {context.isGeneratingAnswer ? (
            <Spinner />
          ) : (
            <BsArrowUpCircleFill className="h-9 w-9" />
          )}
        </button>
        <button className="m-4">
          <LuAudioLines className="h-7 w-7 hover:text-gray-600" />
        </button>
      </form>
    </div>
  );
}

export default QuestionBox;
