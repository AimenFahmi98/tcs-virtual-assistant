/**
 * Controller class for handling OpenAI API interactions and conversation management.
 * @class
 * @classdesc Manages conversations with OpenAI, including history tracking, context retrieval, and embedding generation.
 *
 * @param {number} [MAX_HISTORY_LENGTH=50000] - Maximum length of conversation history in tokens
 * @param {number} [MAX_COMPLETION_TOKENS=5000] - Maximum tokens for completion responses
 *
 * @property {PineconeController} pinecone - Instance of PineconeController for vector database operations
 * @property {OpenAI} openai - OpenAI API client instance
 * @property {Array<Object>} history - Conversation history array
 * @property {number} MAX_HISTORY_LENGTH - Maximum allowed history length
 * @property {number} MAX_COMPLETION_TOKENS - Maximum allowed completion tokens
 * @property {string} model - OpenAI model identifier
 * @property {Array<string>} filesUsedInLastRequest - Tracks files used in the most recent request
 * @property {Array<Object>} tools - Available function tools for the AI
 *
 * @example
 * const openaiController = new OpenaiController();
 * await openaiController.answer("What is TCS?", ["document1.pdf", "document2.pdf"]);
 */
import OpenAI from "openai";
import { encode } from "gpt-tokenizer";
import PineconeController from "./pinecone";
import { getAnswers, getQuestions } from "./supabase";

class OpenaiController {
  constructor(MAX_HISTORY_LENGTH = 50000, MAX_COMPLETION_TOKENS = 5000) {
    this.pinecone = new PineconeController();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.history = [
      {
        role: "system",
        content: `You are an AI assistant for Tata Consultancy Services (TCS).

        **Using the Database for Context:**
        - When you think you need more information to answer the question, you can use the 'getAdditionalContext' tool to retrieve embedded text chunks from our vector store from various available files that can serve as context.
        - Before calling the 'getAdditionalContext' function, look at the previous messages between you and the user and check if there isn't already enough information to answer the question. If there is, you should not call the function in the first place.
        - Every time you use the 'getAdditionalContext' function, you should think to yourself: 'what information do I still need to be able to answer the user's initial question given the information I have gathered so far?'. Then, you should pass a new question asking for that information as an argument to the 'getAdditionalContext' function.
        - The database currently contains information about the user's contracts and educational files.
        - If the user asks about a change in styling, you should not use the 'getAdditionalContext' function for this.

        **Purpose and Presentation:**
        - Always present yourself as a representative of TCS.
        - Your answers must be formatted as HTML elements that can be rendered directly in a React.js application. The answer should always start with a <div></div> element and not with '''html'''. You can use tables, forms or any other relevant HTML elements. 
        - Do not include any css for formatting. This will be provided by the React app.
      `,
      },
    ];
    this.MAX_HISTORY_LENGTH = MAX_HISTORY_LENGTH;
    this.MAX_COMPLETION_TOKENS = MAX_COMPLETION_TOKENS;
    this.model = "gpt-4o-mini";
    this.filesUsedInLastRequest = [];
    this.tools = [
      {
        type: "function",
        function: {
          name: "getAdditionalContext",
          description:
            "Use this function when the user's question might relate to content stored in the RAG database. This function retrieves relevant text chunks from the database to provide additional context for answering the query. To improve relevance, refine the user's question by incorporating the conversational history into the query passed to this function. It is good to make this query long and detailed.",
          parameters: {
            type: "object",
            properties: {
              refinedQuestion: {
                type: "string",
                description:
                  "A refined version of the user's question, enriched with context from the conversation history. This question will be embedded and used to search the vector store for relevant text chunks. It is encouraged to make this question as long and detailed as possible so that the vector seach is more rich.",
              },
            },
            required: ["refinedQuestion"],
            additionalProperties: false,
          },
        },
      },
    ];
  }

  // Function to filter and print user questions and assistant answers
  /**
   * Prints the filtered conversation history to the console.
   * Only displays messages from 'user' and 'assistant' roles.
   * Each message is printed with a numerical index, role identifier, and content.
   * @returns {void}
   */
  printFilteredHistory() {
    console.log("Filtered History:");
    this.history
      .filter(
        (message) => message.role === "user" || message.role === "assistant",
      )
      .forEach((message, index) => {
        console.log(
          `${index + 1}. ${message.role === "user" ? "User" : "Assistant"}: ${
            message.content
          }`,
        );
      });
  }

  /**
   * Loads the conversation history for a specific conversation by fetching questions and answers from the database.
   * Maps the questions and answers into the history array in the correct sequence, maintaining the conversation flow.
   * Questions are mapped as "user" role and answers as "assistant" role.
   *
   * @async
   * @param {string|number} conversationId - The unique identifier for the conversation to load
   * @throws {Error} When there's an error fetching data from the database
   * @returns {Promise<void>}
   */
  async loadConversationHistory(conversationId) {
    try {
      const questionsResult = await getQuestions(conversationId);
      const answersResult = await getAnswers(conversationId);

      if (questionsResult.success && answersResult.success) {
        const questions = questionsResult.data;
        const answers = answersResult.data;

        // Map questions and answers into the history
        questions.forEach((question) => {
          this.history.push({
            role: "user",
            content: question.content,
          });

          const answer = answers.find((ans) => ans.questionId === question.id);
          if (answer) {
            this.history.push({
              role: "assistant",
              content: answer.content,
            });
          }
        });

        console.log("Conversation history loaded successfully.");
      } else {
        console.error("Failed to fetch questions or answers from Supabase.");
      }
    } catch (error) {
      console.error("Error loading conversation history:", error);
    }
  }

  printFullHistory() {
    console.log("Full History:", this.history);
  }

  /**
   * Adds the assistant's answer to the conversation history and manages system messages.
   * This method ensures that only one system message (the first one) is retained while
   * maintaining the chronological order of other messages. In other words, it removes RAG file context from the history of messages as the last answer of the assistant is usually a summary of the context anyway. Therefore, a lot less tokens are used.
   *
   * @param {string} assistantAnswer - The response from the assistant to be added to history
   * @throws {Error} Throws an error if assistantAnswer is null, undefined, or not a string
   * @returns {void}
   */
  pushAnswerToHistory(assistantAnswer) {
    if (!assistantAnswer || typeof assistantAnswer !== "string") {
      throw new Error("Invalid assistant answer provided.");
    }

    // Add the assistant's answer to the history
    this.addToHistory({
      role: "assistant",
      content: assistantAnswer,
    });

    // Retain only the first system message and other messages
    const firstSystemMessage = this.history.find(
      (msg) => msg.role === "system",
    );
    this.history = [
      firstSystemMessage,
      ...this.history.filter(
        (msg) => msg.role !== "system" || msg === firstSystemMessage,
      ),
    ].filter((msg, index, self) => {
      // Ensure that the first system message is only included once
      return (
        msg.role !== "system" ||
        index ===
          self.findIndex(
            (innerMsg) =>
              innerMsg.role === "system" && innerMsg === firstSystemMessage,
          )
      );
    });
  }

  getFilesUsedInLastRequest() {
    return this.filesUsedInLastRequest;
  }

  /**
   * Generates a concise title for the conversation based on the message history.
   * This method processes the conversation history and uses OpenAI to create a brief,
   * relevant title of maximum 5 words.
   *
   * @async
   * @returns {Promise<string>} A promise that resolves to the generated title string.
   * @throws {Error} If title generation fails or if OpenAI API returns no content.
   *
   * @example
   * const title = await conversation.generateTitle();
   * // Returns: "Weather Forecast Discussion with User"
   */
  async generateTitle() {
    // Filter the conversation history to include only user and assistant messages
    const filteredHistory = this.history.filter(
      (message) => message.role === "user" || message.role === "assistant",
    );

    // Combine the filtered messages into a single summary input for the model
    const conversationSummary = filteredHistory
      .map(
        (message) =>
          `${message.role === "user" ? "User" : "Assistant"}: ${
            message.content
          }`,
      )
      .join("\n");

    try {
      // Use OpenAI to generate a title
      const response = await this.openai.chat.completions.create({
        model: this.model,
        max_tokens: 50, // Limit the token count for brevity
        messages: [
          {
            role: "system",
            content: `You are a summarization assistant. Summarize the following conversation into a title of maximum 5 words. No quotation marks please.`,
          },
          {
            role: "user",
            content: conversationSummary,
          },
        ],
      });

      // Extract the title from the response
      const title = response.choices[0]?.message?.content?.trim();

      if (!title) {
        throw new Error("Failed to generate a title.");
      }

      return title;
    } catch (error) {
      console.error("Error generating title:", error);
      throw new Error("Could not generate a conversation title.");
    }
  }

  /**
   * Calculates the total length of encoded message content in the conversation history.
   * This method processes each message in the history array and sums up the length
   * of their encoded content using the 'encode' function.
   *
   * @returns {number} The total length of all encoded messages in the history.
   */
  getHistoryLength() {
    let length = 0;
    this.history.forEach((message) => {
      length += encode(message.content).length;
    });
    return length;
  }

  addToHistory(message) {
    this.history.push(message);
    this.deleteExcessMsgs();
  }

  /**
   * Removes messages from the conversation history when it exceeds the maximum allowed length.
   * Messages are deleted in the following priority order:
   * 1. RAG (Retrieval-Augmented Generation) context messages
   * 2. Assistant (chatbot) responses
   * 3. User messages (starting from index 2)
   *
   * The method continues removing messages until the history length is within
   * the MAX_HISTORY_LENGTH limit.
   *
   * @returns {void}
   */
  deleteExcessMsgs() {
    let historyLength = this.getHistoryLength();
    while (historyLength > this.MAX_HISTORY_LENGTH) {
      console.log(
        `History contains ${historyLength} tokens. Deleting excessive message from history...`,
      );

      // Prioritize deleting the RAG context, then the chatbot responses, then the user questions
      const rag_context_msg_idx = this.history.findIndex(
        (message) =>
          message.role === "user" &&
          message.content.startsWith("Context for the question"),
      );

      const chatbot_answer_idx = this.history.findIndex(
        (message) => message.role === "assistant",
      );

      if (rag_context_msg_idx !== -1) {
        this.history.splice(rag_context_msg_idx, 1);
      } else if (chatbot_answer_idx !== -1) {
        this.history.splice(chatbot_answer_idx, 1);
      } else {
        this.history.splice(2, 1);
      }

      historyLength = this.getHistoryLength();

      console.log(`History now contains ${historyLength} tokens.`);
    }
  }

  /**
   * Retrieves additional context by embedding a refined question and querying related documents
   * @async
   * @param {string} refinedQuestion - The refined question to get context for
   * @param {Array} RAGDocuments - Array of RAG documents to search through
   * @returns {Promise<Object>} Object containing:
   *   - filesUsed {string[]} Array of filenames used for context
   *   - context {string[]} Array of text chunks with file source information
   * @throws {Error} If embedding creation or Pinecone query fails
   */
  async getAdditionalContext(refinedQuestion, RAGDocuments) {
    console.log("Refined question:", refinedQuestion);

    const openai_result = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: refinedQuestion,
      encoding_format: "float",
      dimensions: 256,
    });

    const embedding = openai_result.data[0].embedding;

    const results = await this.pinecone.queryForEmbedding(
      RAGDocuments,
      embedding,
      10,
    );

    const context = results.map(
      (result) =>
        `The name of the file used for this chunk is: ${result.fromFile}\n\n` +
        result.textChunk,
    );
    const filesUsed = results.map((result) => result.fromFile);

    return { filesUsed, context };
  }

  /**
   * Processes a user question and generates an answer using OpenAI's API with optional RAG documents
   * @async
   * @param {string} question - The user's question to be answered
   * @param {Object[]} RAGDocuments - Array of RAG documents for additional context
   * @returns {Promise<StreamCompletion>} A stream of the AI's response
   * @throws {Error} May throw errors from OpenAI API calls
   * @description
   * This method:
   * 1. Adds the question to conversation history
   * 2. Makes initial API call that may trigger tool calls
   * 3. If tool calls are triggered, refines the question and gets additional context
   * 4. Tracks files used in the request
   * 5. Returns a streamed completion from OpenAI
   *
   * The method implements a tool call loop limited to one iteration by default (configurable).,
   * where it can refine the question and gather additional context before
   * generating the final answer.
   */
  async answer(question, RAGDocuments) {
    // Add the user's question to the history
    this.history.push({
      role: "user",
      content: question + ". Use tool calls if necessary.",
    });

    this.filesUsedInLastRequest = [];
    let refinedQuestion = question;

    let toolCallLoop = true; // Flag to continue or exit the loop
    let maxNbToolCalls = 1; // Limit the number of tool calls
    let currentNbToolCalls = 0;

    while (toolCallLoop && currentNbToolCalls < maxNbToolCalls) {
      currentNbToolCalls++;
      // Make the API request to OpenAI
      const response = await this.openai.chat.completions.create({
        model: this.model,
        max_completion_tokens: this.MAX_COMPLETION_TOKENS,
        messages: this.history,
        tools: this.tools,
      });

      if (response.choices[0].message.tool_calls) {
        const toolCall = response.choices[0].message.tool_calls[0];
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        refinedQuestion = args.refinedQuestion;

        if (functionName === "getAdditionalContext") {
          const result = await this.getAdditionalContext(
            refinedQuestion,
            RAGDocuments,
          );
          this.filesUsedInLastRequest.push(...result.filesUsed); // Append new files used

          this.history.push({
            role: "system",
            content: `Context: ${result.context.join("\n\n")}`,
          });
        }
      } else {
        // Exit the loop if no tool calls are detected
        toolCallLoop = false;
      }
    }

    this.history.push({
      role: "system",
      content: `Answer the following question based on the history of messages so far: ${question}`,
    });

    const answerStream = await this.openai.chat.completions.create({
      model: this.model,
      max_completion_tokens: this.MAX_COMPLETION_TOKENS,
      messages: this.history,
      stream: true,
    });

    return answerStream;
  }

  /**
   * Generates embeddings for text chunks using OpenAI's embedding model.
   * @param {string[]} chunks - Array of text chunks to generate embeddings for
   * @param {string} fileName - Name of the file being processed
   * @returns {Promise<Array<{id: string, chunk: string, vector: number[]}>>} Array of objects containing chunk ID, text content and embedding vector
   * @throws {Error} If chunks array is empty or undefined
   * @throws {Error} If OpenAI API call fails
   */
  async generateOpenAIEmbeddings(chunks, fileName) {
    try {
      // Ensure chunks array is not empty
      if (!chunks || chunks.length === 0) {
        throw new Error("No chunks provided for embedding generation.");
      }

      // Generate embeddings for each chunk
      const { data } = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        dimensions: 256,
        input: chunks,
      });

      // Return an array of objects containing the chunk and its embedding
      return data.map((item, index) => ({
        id: `${fileName}_chunk_${index}`,
        chunk: chunks[index],
        vector: item.embedding,
      }));
    } catch (error) {
      console.error("Error generating OpenAI embeddings:", error);
      throw error;
    }
  }
}

export default OpenaiController;
