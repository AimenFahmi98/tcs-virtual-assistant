"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Create the Context
const ChatContext = createContext();

/**
 * Provides a context wrapper for managing chat-related state and operations.
 * Handles conversations, questions, answers, and documents management through various state variables and functions.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by the context provider
 *
 * @returns {JSX.Element} ChatContext.Provider component wrapping children with chat-related context
 *
 * @context ChatContext
 * @property {Array} conversations - List of chat conversations
 * @property {boolean} isFetchingForConversations - Loading state for conversations fetch
 * @property {number} activeConversationId - ID of the currently active conversation
 * @property {function} setActiveConversationId - Function to update active conversation
 * @property {function} createNewEmptyConversation - Creates a new conversation
 * @property {function} updateConversationTitle - Updates title of existing conversation
 * @property {function} deleteConversation - Removes a conversation
 * @property {Array} questions - List of questions in current conversation
 * @property {boolean} isFetchingForQuestions - Loading state for questions fetch
 * @property {function} storeQuestion - Saves a new question
 * @property {Array} answers - List of answers to questions
 * @property {function} createNewEmptyAnswer - Creates a new empty answer
 * @property {function} updateAnswer - Updates an existing answer
 * @property {function} storeAnswer - Saves an answer to storage
 * @property {function} removeQuestionAndAssociatedAnswer - Deletes a question and its answer
 * @property {Array} documents - List of RAG documents
 * @property {Object} intentionToDeleteQuestion - Tracks question deletion intent
 * @property {function} setIntentionToDeleteQuestion - Updates question deletion intent
 * @property {boolean} hasQuestions - Indicates if current conversation has questions
 * @property {boolean} isLoading - General loading state
 * @property {boolean} isGeneratingAnswer - Loading state for answer generation
 * @property {function} setIsGeneratingAnswer - Updates answer generation loading state
 */
export function ChatContextProvider({ children }) {
  const [user, setUser] = useState(null); // Track the current user
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [isFetchingForConversations, setIsFetchingForConversations] =
    useState(true);
  const [isFetchingForQuestions, setIsFetchingForQuestions] = useState(true);
  const [intentionToDeleteQuestion, setIntentionToDeleteQuestion] = useState({
    questionId: -1,
  });
  const [hasQuestions, setHasQuestions] = useState(false);

  useEffect(() => {
    questions.length !== 0 ? setHasQuestions(true) : setHasQuestions(false);
  }, [questions]);

  // Fetch and set the current user
  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const userResponse = await supabase.auth.getUser();
      setUser(userResponse.data?.user);
    }
    fetchUser();
  }, []);

  // Fetch conversations for the current user
  useEffect(() => {
    if (!user) return;

    async function fetchConversations() {
      setIsFetchingForConversations(true);
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/supabase/users/${user.id}/conversations`,
        );
        const data = await response.json();

        setConversations(data);
        if (data.length > 0) {
          setActiveConversationId(data[0].id); // Set the first conversation as active
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
        setIsFetchingForConversations(false);
      }
    }

    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!activeConversationId || !user) return;

    async function fetchQuestionsAndAnswers() {
      setIsLoading(true);
      setIsFetchingForQuestions(true);
      try {
        // Fetch questions for the active conversation
        const questionsResponse = await fetch(
          `/api/supabase/users/${user.id}/conversations/${activeConversationId}/questions`,
        );
        const questionsData = await questionsResponse.json();

        // Set questions in state
        setQuestions(questionsData);

        // Fetch answers for each question
        const answersPromises = questionsData.map(async (question) => {
          const answersResponse = await fetch(
            `/api/supabase/users/${user.id}/conversations/${activeConversationId}/questions/${question.id}/answers`,
          );
          return answersResponse.json();
        });

        // Wait for all answers to be fetched and flatten the results
        const allAnswers = (await Promise.all(answersPromises)).flat();
        setAnswers(allAnswers);

        // Fetch RAG selected documents
        const documentsResponse = await fetch(
          `/api/supabase/users/${user.id}/documents/selected-for-rag`,
        );
        const documentsResult = await documentsResponse.json();

        if (!documentsResult.error) {
          setDocuments(
            documentsResult.documents.map((document) => {
              return {
                id: document.id,
                name: document.name,
                size: document.size,
                isSelectedForRAG: document.isSelectedForRAG,
                type: document.type,
                path: document.path,
                nbChunks: document.nbChunks,
              };
            }),
          );
        }
      } catch (error) {
        console.error("Error fetching questions and answers:", error);
      } finally {
        setIsLoading(false);
        setIsFetchingForQuestions(false);
      }
    }

    fetchQuestionsAndAnswers();
  }, [activeConversationId, user]);

  /**
   * Stores a question in the database and updates the local state.
   * @param {string} question - The question text to be stored.
   * @returns {Promise<number>} The ID of the newly stored question.
   * @throws {Error} If the question fails to be added to the database.
   * @async
   */
  async function storeQuestion(question) {
    const supabase = createClient();
    const userResponse = await supabase.auth.getUser();

    if (!userResponse.data?.user) {
      throw new Error("User not authenticated");
    }

    const response = await fetch("/api/supabase/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: question,
        conversation_id: activeConversationId,
        user_id: userResponse.data.user.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add the question to the database.");
    }

    const data = await response.json();
    const questionId = data.id;

    setQuestions((questions) => [
      ...questions,
      { content: question, id: questionId },
    ]);

    return questionId;
  }

  // Methods for Conversations
  async function createNewEmptyConversation(title = "New Conversation") {
    try {
      const response = await fetch(
        `/api/supabase/users/${user.id}/conversations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        },
      );
      const data = await response.json();
      setConversations((prev) => [...prev, data]);
      setActiveConversationId(data.id);
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  }

  async function updateConversationTitle(conversationId, newTitle) {
    try {
      const response = await fetch(
        `/api/supabase/users/${user.id}/conversations/${conversationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newTitle }),
        },
      );
      if (response.ok) {
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, title: newTitle }
              : conversation,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating conversation title:", error);
    }
  }

  async function deleteConversation(conversationId) {
    try {
      const response = await fetch(
        `/api/supabase/users/${user.id}/conversations/${conversationId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setConversations((prev) =>
          prev.filter((conversation) => conversation.id !== conversationId),
        );
        if (conversationId === activeConversationId) {
          setActiveConversationId(
            conversations.length > 0 ? conversations[0].id : null,
          );
        }
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  }

  // Methods for Questions
  async function storeQuestion(content) {
    try {
      const response = await fetch(
        `/api/supabase/users/${user.id}/conversations/${activeConversationId}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        },
      );
      const data = await response.json();
      setQuestions((prev) => [...prev, data]);
      return data.id; // Return the question ID
    } catch (error) {
      console.error("Error adding question:", error);
      throw error; // Re-throw error to handle it in the calling code
    }
  }

  async function deleteQuestion(questionId) {
    try {
      const response = await fetch(
        `/api/supabase/users/${user.id}/conversations/${activeConversationId}/questions/${questionId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setQuestions((prev) =>
          prev.filter((question) => question.id !== questionId),
        );
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  }

  // Methods for Answers
  async function storeAnswer(questionId, content, filesUsedAsContext = []) {
    try {
      const response = await fetch(
        `/api/supabase/users/${user.id}/conversations/${activeConversationId}/questions/${questionId}/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, filesUsedAsContext }),
        },
      );
      const data = await response.json();
      setAnswers((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  }

  async function createNewEmptyAnswer(questionId) {
    try {
      const response = await fetch(
        `/api/supabase/users/${user.id}/conversations/${activeConversationId}/questions/${questionId}/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: "", isTemp: true }),
        },
      );
      const data = await response.json();
      setAnswers((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Error creating empty answer:", error);
      return null;
    }
  }

  async function updateAnswer(
    question_id,
    answer_id,
    content,
    filesUsedAsContext = [],
  ) {
    try {
      const response = await fetch(
        `/api/supabase/users/${user.id}/conversations/${activeConversationId}/questions/${question_id}/answers/${answer_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, filesUsedAsContext }),
        },
      );
      if (response.ok) {
        setAnswers((prev) =>
          prev.map((answer) =>
            answer.id === answer_id
              ? { ...answer, content, filesUsedAsContext }
              : answer,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  }

  // Context Value
  const value = {
    conversations,
    isFetchingForConversations,
    activeConversationId,
    setActiveConversationId,
    createNewEmptyConversation,
    updateConversationTitle,
    deleteConversation,
    questions,
    isFetchingForQuestions,
    storeQuestion,
    answers,
    createNewEmptyAnswer,
    updateAnswer,
    storeAnswer,
    deleteQuestion,
    documents,
    intentionToDeleteQuestion,
    setIntentionToDeleteQuestion,
    hasQuestions,
    isLoading,
    isGeneratingAnswer,
    setIsGeneratingAnswer,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

/**
 * Custom hook for accessing chat context
 * @function
 * @throws {Error} If used outside of ChatContextProvider
 * @returns {Object} Chat context value containing:
 * @returns {Array<Conversation>} conversations - List of all conversations
 * @returns {boolean} isFetchingForConversations - Loading state for conversations
 * @returns {number} activeConversationId - ID of the currently active conversation
 * @returns {Function} setActiveConversationId - Function to set active conversation
 * @returns {Function} createNewEmptyConversation - Function to create new conversation
 * @returns {Function} updateConversationTitle - Function to update conversation title
 * @returns {Function} deleteConversation - Function to delete a conversation
 * @returns {Array<Question>} questions - List of questions in active conversation
 * @returns {boolean} isFetchingForQuestions - Loading state for questions
 * @returns {Function} storeQuestion - Function to store a new question
 * @returns {Array<Answer>} answers - List of answers in active conversation
 * @returns {Function} createNewEmptyAnswer - Function to create new empty answer
 * @returns {Function} updateAnswer - Function to update an answer
 * @returns {Function} storeAnswer - Function to store an answer
 * @returns {Function} removeQuestionAndAssociatedAnswer - Function to remove a question and its answer
 * @returns {Array<Document>} documents - List of documents
 * @returns {Object} intentionToDeleteQuestion - State for question deletion intention
 * @returns {Function} setIntentionToDeleteQuestion - Function to set question deletion intention
 * @returns {boolean} hasQuestions - Whether there are any questions
 * @returns {boolean} isLoading - General loading state
 * @returns {boolean} isGeneratingAnswer - Whether an answer is being generated
 * @returns {Function} setIsGeneratingAnswer - Function to set answer generation state
 */
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
}
