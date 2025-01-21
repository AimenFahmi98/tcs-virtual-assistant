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
  getAllRAGSelectedDocuments,
} from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

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
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [isFetchingForConversations, setIsFetchingForConversations] =
    useState(true);
  const [isConversationsFetched, setIsConversationsFetched] = useState(false);
  const [isFetchingForQuestions, setIsFetchingForQuestions] = useState(true);
  const [intentionToDeleteQuestion, setIntentionToDeleteQuestion] = useState({
    questionId: -1,
  });
  const [hasQuestions, setHasQuestions] = useState(false);

  useEffect(() => {
    /**
     * Fetches conversations from the server and updates the state with the retrieved data.
     * Sets the active conversation ID to the first conversation if data exists.
     * Updates loading states during the fetch operation.
     *
     * @async
     * @function fetchConversations
     * @throws {Error} If the API call fails
     *
     * Side Effects:
     * - Sets isFetchingForConversations loading state
     * - Sets activeConversationId with first conversation's ID
     * - Updates conversations state with mapped conversation data
     * - Sets isConversationsFetched flag when complete
     */
    async function fetchConversations() {
      setIsFetchingForConversations(true);
      const conversationsResult = await getConversations();
      if (conversationsResult.success && conversationsResult.data.length > 0) {
        setActiveConversationId(conversationsResult.data[0].id);
        setConversations(
          conversationsResult.data.map((conversation) => ({
            id: conversation.id,
            title: conversation.title,
          })),
        );
      }
      setIsFetchingForConversations(false);
      setIsConversationsFetched(true);
    }

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!isConversationsFetched) return;
    /**
     * Asynchronously fetches and sets questions, answers, and documents data for the active conversation.
     * Updates loading states and data states based on the API responses.
     *
     * @async
     * @function fetchData
     * @throws {Error} Logs error message if questions or answers fetch fails
     *
     * Sets the following states:
     * - isLoading: boolean
     * - isFetchingForQuestions: boolean
     * - hasQuestions: boolean
     * - questions: Array<{content: string, id: string, conversationId: string}>
     * - answers: Array<{content: string, filesUsedAsContext: any, questionId: string, conversationId: string}>
     * - documents: Array<{id: string, name: string, size: number, isSelectedForRAG: boolean, type: string, path: string, nbChunks: number}>
     *
     * @returns {Promise<void>}
     */
    async function fetchData() {
      setIsLoading(true);
      setIsFetchingForQuestions(true);

      const questionsResult = await getQuestions(activeConversationId);
      const answersResult = await getAnswers(activeConversationId);
      const documentsResult =
        await getAllRAGSelectedDocuments(activeConversationId);

      if (
        questionsResult.success &&
        answersResult.success &&
        documentsResult.success
      ) {
        questionsResult.data.length !== 0
          ? setHasQuestions(true)
          : setHasQuestions(false);
        setQuestions(
          questionsResult.data.map((question) => {
            return {
              content: question.content,
              id: question.id,
              conversationId: question.conversationId,
            };
          }),
        );
        setAnswers(
          answersResult.data.map((answer) => {
            return {
              content: answer.content,
              filesUsedAsContext: answer.filesUsedAsContext,
              questionId: answer.questionId,
              conversationId: answer.conversationId,
            };
          }),
        );
        setDocuments(
          documentsResult.data.map((document) => {
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
        setIsFetchingForQuestions(false);
        setIsLoading(false);
      } else if (questionsResult.error || answersResult.error) {
        console.log("Something went wrong...");
      }
    }
    fetchData();
  }, [activeConversationId, isConversationsFetched]);

  useEffect(() => {
    questions.length !== 0 ? setHasQuestions(true) : setHasQuestions(false);
  }, [questions]);

  /**
   * Stores a question in the database and updates the local state.
   * @param {string} question - The question text to be stored.
   * @returns {Promise<number>} The ID of the newly stored question.
   * @throws {Error} If the question fails to be added to the database.
   * @async
   */
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

  /**
   * Removes a question and its associated answer from the state and database
   * @async
   * @param {string|number} questionId - The unique identifier of the question to be removed
   * @throws {Error} If the deletion operation fails
   * @returns {Promise<void>}
   */
  async function removeQuestionAndAssociatedAnswer(questionId) {
    setQuestions((questions) =>
      questions.filter((question) => question.id !== questionId),
    );
    setAnswers((answers) =>
      answers.filter((answer) => answer.questionId !== questionId),
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

  /**
   * Creates a new empty answer object and adds it to the answers state.
   * @param {string|number} questionId - The ID of the question this answer corresponds to
   * @returns {Object} The newly created answer object with empty content and context files
   */
  function createNewEmptyAnswer(questionId) {
    const newEmptyAnswer = { content: "", filesUsedAsContext: [], questionId };
    setAnswers((answers) => [...answers, newEmptyAnswer]);
    return newEmptyAnswer;
  }

  /**
   * Updates the answers array by appending a new answer
   * @param {any} answer - The answer to be added to the answers array
   * @returns {void}
   */
  function updateAnswer(answer) {
    setAnswers((answers) => [...answers, answer]);
  }

  /**
   * Stores an answer in the database for a given question.
   * @async
   * @param {Object} params - The parameters object.
   * @param {string} params.content - The content of the answer.
   * @param {Array} params.filesUsedAsContext - Array of files used as context for the answer.
   * @param {string} params.questionId - The ID of the question being answered.
   * @throws {Error} Throws an error if storing the answer fails.
   * @returns {Promise<void>}
   */
  async function storeAnswer({ content, filesUsedAsContext, questionId }) {
    // Add the question to the database
    const { success, data } = await addAnswer(
      content,
      filesUsedAsContext,
      questionId,
      activeConversationId,
    );
    if (!success || !data || data.length === 0) {
      throw new Error("Failed to add the answer to the database.");
    }
  }

  /**
   * Creates a new empty conversation with a default title and adds it to the conversations list.
   * @async
   * @function createNewEmptyConversation
   * @returns {Promise<Object>} A promise that resolves to the newly created conversation object
   *                           containing the title and id properties.
   * @throws {Error} If the conversation creation fails
   */
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

  /**
   * Updates the title of a specific conversation both in local state and database
   * @param {string} conversationId - The unique identifier of the conversation to update
   * @param {string} newTitle - The new title to set for the conversation
   * @returns {Promise<void>} A promise that resolves when the update is complete
   * @throws {Error} When the database update fails
   */
  async function updateConversationTitle(conversationId, newTitle) {
    // Update the title in the local state
    setConversations((conversations) =>
      conversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, title: newTitle }
          : conversation,
      ),
    );

    try {
      // Update the title in the database
      const { success, error } = await storeNewConversationTitle(
        conversationId,
        newTitle,
      );
      if (!success) {
        throw new Error(`Failed to update the conversation title: ${error}`);
      }
    } catch (error) {
      console.error("Error updating conversation title:", error);
    }
  }

  /**
   * Deletes a conversation from both local state and the database.
   * @async
   * @param {number|string} conversationId - The unique identifier of the conversation to delete.
   * @throws {Error} When the database deletion operation fails.
   * @returns {Promise<void>}
   */
  async function deleteConversation(conversationId) {
    // Update the local state to remove the conversation
    setConversations((conversations) =>
      conversations.filter(
        (conversation) => conversation.id !== conversationId,
      ),
    );

    // Reset active conversation if the deleted conversation was active
    if (activeConversationId === conversationId) {
      setActiveConversationId(
        conversations.length > 0 ? conversations[0].id : -1,
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
    removeQuestionAndAssociatedAnswer,
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
