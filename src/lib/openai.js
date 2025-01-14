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

    // this.printFullHistory();
  }

  printFullHistory() {
    console.log("Full History:", this.history);
  }

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

  async getAdditionalContext(refinedQuestion) {
    console.log("Refined question:", refinedQuestion);

    const openai_result = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: refinedQuestion,
      encoding_format: "float",
      dimensions: 384,
    });

    const embedding = openai_result.data[0].embedding;

    const results = await this.pinecone.queryForEmbedding(
      "pcb-index",
      [
        "offer-letter.pdf",
        "Feature_Branch_Analysis.pdf",
        "Bachelors-Thesis-Submitted.pdf",
      ],
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

  async answer(question) {
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
          const result = await this.getAdditionalContext(refinedQuestion);
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
   * Generate embeddings for an array of text chunks using OpenAI.
   * @param {Array<string>} chunks - Array of text chunks to generate embeddings for.
   * @returns {Promise<Array>} - Array of embedding vectors.
   */
  async generateOpenAIEmbeddings(chunks) {
    try {
      // Ensure chunks array is not empty
      if (!chunks || chunks.length === 0) {
        throw new Error("No chunks provided for embedding generation.");
      }

      // Generate embeddings for each chunk
      const { data } = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunks,
      });

      return data.map((item) => item.embedding);
    } catch (error) {
      console.error("Error generating OpenAI embeddings:", error);
      throw error;
    }
  }
}

export default OpenaiController;
