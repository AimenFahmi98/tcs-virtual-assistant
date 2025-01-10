"use client";

import { useRef, useState } from "react";
import { BsArrowUpCircleFill } from "react-icons/bs";
import Spinner from "./Spinner";
import { useChatContext } from "@/context/chatContext";
import { LuAudioLines } from "react-icons/lu";

function QuestionBox() {
  const textAreaRef = useRef();
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const context = useChatContext();

  async function handleSubmitQuestion(e) {
    setIsLoading(true);
    e.preventDefault();

    const question = e.target.elements.question.value.trim();
    e.target.elements.question.value = "";
    adjustTextAreaHeight();

    if (!question) {
      setIsLoading(false);
      return;
    }

    try {
      const questionId = await context.storeQuestion(question);

      // Fetch the answer stream and files used
      const response = await fetch("http://localhost:3000/api/openai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          activeConversationId: context.activeConversationId,
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

      await context.storeAnswer(answer);

      // Fetch the new title and files used
      const titleAndFilesUsedResponse = await fetch(
        `http://localhost:3000/api/openai?conversationId=${context.activeConversationId}`
      );

      if (titleAndFilesUsedResponse.ok) {
        const { newConversationTitle, filesUsed } =
          await titleAndFilesUsedResponse.json();
        console.log("New conversation title:", newConversationTitle);
        console.log("Files used:", filesUsed);

        context.updateConversationTitle(
          context.activeConversationId,
          newConversationTitle
        );

        // Optionally, store or process the filesUsed
        answer.filesUsedAsContext = filesUsed;
        context.updateAnswer(answer);
      } else {
        console.error("Failed to fetch new conversation title or files used.");
      }
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
    } finally {
      setIsLoading(false);
    }
  }

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
    <div className="flex items-center justify-center transition-all duration-200 ease-out w-[600px] focus-within:w-[650px] bg-primary rounded-2xl focus-within:shadow-lg_custom">
      <form
        onSubmit={handleSubmitQuestion}
        className="flex items-center justify-center w-full gap-2"
        ref={formRef}
      >
        <textarea
          className="text-text bg-inherit text-md placeholder:text-text_light placeholder:text-md w-full outline-none px-8 py-4 resize-none"
          name="question"
          placeholder="Ask me anything..."
          autoComplete="off"
          rows="1"
          onKeyDown={handleKeyDown}
          onInput={handleInput}
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
            <BsArrowUpCircleFill className="w-9 h-9" />
          )}
        </button>
        <button className="m-4">
          <LuAudioLines className="w-7 h-7 hover:text-gray-600" />
        </button>
      </form>
    </div>
  );
}

export default QuestionBox;
