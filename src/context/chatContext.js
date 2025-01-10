"use client";

import {
  addAnswer,
  addConversation,
  addQuestion,
  deleteConversationById,
  deleteQuestion,
  getAnswers,
  getConversations,
  getQuestions,
  storeNewConversationTitle,
} from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

// Create the Context
const ChatContext = createContext();

// Provider Component
export function ChatContextProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [intentionToDeleteQuestion, setIntentionToDeleteQuestion] = useState({
    questionId: -1,
  });
  const [hasQuestions, setHasQuestions] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const conversationsResult = await getConversations();

      if (conversationsResult.success && conversationsResult.success) {
        setConversations(
          conversationsResult.data.map((conversation) => {
            return { id: conversation.id, title: conversation.title };
          })
        );
      }

      const questionsResult = await getQuestions(activeConversationId);
      const answersResult = await getAnswers(activeConversationId);

      if (questionsResult.success && answersResult.success) {
        setQuestions(
          questionsResult.data.map((question) => {
            return {
              content: question.content,
              id: question.id,
              conversationId: question.conversationId,
            };
          })
        );
        setAnswers(
          answersResult.data.map((answer) => {
            return {
              content: answer.content,
              filesUsedAsContext: answer.filesUsedAsContext,
              questionId: answer.questionId,
              conversationId: answer.conversationId,
            };
          })
        );
        setIsLoading(false);
      } else if (questionsResult.error || answersResult.error) {
        console.log("Something went wrong...");
      }
    }
    fetchData();
  }, [activeConversationId]);

  useEffect(() => {
    questions.length !== 0 ? setHasQuestions(true) : setHasQuestions(false);
  }, [questions]);

  async function storeQuestion(question) {
    // Add the question to the database
    const { success, data } = await addQuestion(question, activeConversationId);
    if (!success || !data || data.length === 0) {
      throw new Error("Failed to add the question to the database.");
    }

    const questionId = data[0].id;

    setQuestions((questions) => [
      ...questions,
      { content: question, id: questionId },
    ]);

    return questionId;
  }

  async function removeQuestionAndAssociatedAnswer(questionId) {
    setQuestions((questions) =>
      questions.filter((question) => question.id !== questionId)
    );
    setAnswers((answers) =>
      answers.filter((answer) => answer.questionId !== questionId)
    );

    try {
      const { success, error } = await deleteQuestion(questionId);
      if (!success) {
        throw new Error(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function createNewEmptyAnswer(questionId) {
    const newEmptyAnswer = { content: "", filesUsedAsContext: [], questionId };
    setAnswers((answers) => [...answers, newEmptyAnswer]);
    return newEmptyAnswer;
  }

  function updateAnswer(answer) {
    setAnswers((answers) => [...answers, answer]);
  }

  async function storeAnswer({ content, filesUsedAsContext, questionId }) {
    // Add the question to the database
    const { success, data } = await addAnswer(
      content,
      filesUsedAsContext,
      questionId,
      activeConversationId
    );
    if (!success || !data || data.length === 0) {
      throw new Error("Failed to add the answer to the database.");
    }
  }

  async function createNewEmptyConversation() {
    const title = "New conversation";

    const { success, data } = await addConversation(title);

    const newEmptyConversation = { title, id: data[0].id };
    setConversations((conversations) => [
      ...conversations,
      newEmptyConversation,
    ]);

    setActiveConversationId(data[0].id);

    return newEmptyConversation;
  }

  async function updateConversationTitle(conversationId, newTitle) {
    // Update the title in the local state
    setConversations((conversations) =>
      conversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, title: newTitle }
          : conversation
      )
    );

    try {
      // Update the title in the database
      const { success, error } = await storeNewConversationTitle(
        conversationId,
        newTitle
      );
      if (!success) {
        throw new Error(`Failed to update the conversation title: ${error}`);
      }
    } catch (error) {
      console.error("Error updating conversation title:", error);
    }
  }

  async function deleteConversation(conversationId) {
    // Update the local state to remove the conversation
    setConversations((conversations) =>
      conversations.filter((conversation) => conversation.id !== conversationId)
    );

    // Reset active conversation if the deleted conversation was active
    if (activeConversationId === conversationId) {
      setActiveConversationId(
        conversations.length > 0 ? conversations[0].id : -1
      );
    }

    try {
      // Call the deleteConversation function from the Supabase API
      const { success, error } = await deleteConversationById(conversationId);
      if (!success) {
        throw new Error(`Failed to delete the conversation: ${error}`);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  }

  // Context Value
  const value = {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewEmptyConversation,
    updateConversationTitle,
    deleteConversation,
    questions,
    storeQuestion,
    answers,
    createNewEmptyAnswer,
    updateAnswer,
    storeAnswer,
    removeQuestionAndAssociatedAnswer,
    intentionToDeleteQuestion,
    setIntentionToDeleteQuestion,
    hasQuestions,
    isLoading,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Custom Hook to Use Global Context
export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
}
