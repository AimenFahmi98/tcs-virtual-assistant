import OpenAI from "openai";
import { encode } from "gpt-tokenizer";

export class OpenAIAppAgent {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.MAX_HISTORY_LENGTH = 50000;
    this.MAX_COMPLETION_TOKENS = 5000;
    this.model = "gpt-4o-mini";

    this.history = [
      {
        role: "system",
        content: `You are an AI action agent for Tata Consultancy Services (TCS) tasked with performing automated actions in the application. Your primary responsibilities are to help users navigate to the correct pages and assist admin users in creating new roles.

      IMPORTANT: When users express intent to perform actions themselves, such as:
      - "I want to manage documents"
      - "I need to handle roles"
      - "Take me to the documents page"
      - "I want to see my RAG documents"
      
      ALWAYS use the redirectUserToPage tool to navigate them to the appropriate page. Only use another tool when the user explicitly tell you to do something for them.

      Available Tools:
      • Navigation Actions: Use redirectUserToPage to navigate users to:
        \n- documents: a page to manage all documents the user has access to.
        \n- rag documents: a page to manage the RAG documents a user has access to.
        \n- roles: a page to add or remove roles within the application (only accessible to admin users).
        \n- virtual assistant: a page where the user can chat with the virtual assistant.
        \n- user roles: a page where the admin can assign or unassign roles to users.
        \n- document roles: a page where the admin can assign or unassign roles to documents.
        \n- account information: a page where the user can manage their account information (i.e. their profile).
        \n- appearance settings: a page where the user can manage the appearance of the UI of the app.

      • Role Management: Use createNewRole to create new roles when admin users request it:
        \n- Requires both a role name and description
        \n- Only use when explicitly requested by admin users
      
      IMPORTANT: never respond with a success message if you have not used any tool call. Try your best to find a tool call that matches the user's request.

      Format your responses in HTML, starting with a <div> tag when NOT using tools.
      When using tools, provide a simple confirmation of the action. If you do not use any tools, tell the user that you are unable to help them with their request at the moment`,
      },
    ];

    this.tools = [
      {
        type: "function",
        function: {
          name: "redirectUserToPage",
          description: `
                    Use this function when the user needs to navigate to a specific page in the application. Currently supported pages include:
                    \n- documents: a page to manage all documents the user has access to.
                    \n- rag documents: a page to manage the RAG documents a user has access to.
                    \n- roles: a page to add or remove roles within the application (only accessible to admin users).
                    \n- virtual assistant: a page where the user can chat with the virtual assistant.
                    \n- user roles: a page where the admin can assign or unassign roles to users.
                    \n- document roles: a page where the admin can assign or unassign roles to documents.
                    \n- account information: a page where the user can manage their account information (i.e. their profile).
                    \n- appearance settings: a page where the user can manage the appearance of the UI of the app.
                    `,
          parameters: {
            type: "object",
            properties: {
              pageName: {
                type: "string",
                enum: [
                  "documents",
                  "rag documents",
                  "roles",
                  "virtual assistant",
                  "user roles",
                  "document roles",
                  "account information",
                  "appearance settings",
                ],
                description: "The page to redirect to.",
              },
            },
            required: ["pageName"],
            additionalProperties: false,
          },
        },
      },
      {
        type: "function",
        function: {
          name: "createNewRole",
          description:
            "Use this function to create a new role in the application when a user explicitly requests to create one. This should only be used for admin-level operations to add new roles to the system. The role requires both a name and description.",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The name of the new role to create",
              },
              description: {
                type: "string",
                description:
                  "A detailed description of what the role is used for",
              },
            },
            required: ["name", "description"],
            additionalProperties: false,
          },
        },
      },
    ];
  }

  redirectUserToPage(pageName) {
    switch (pageName) {
      case "virtual assistant":
        return "virtual-assistant";
      case "documents":
        return "document-manager/document-management/my-documents/all-documents";
      case "rag documents":
        return "document-manager/document-management/my-documents/rag-documents";
      case "roles":
        return "admin-settings/roles";
      case "user roles":
        return "admin-settings/user-roles";
      case "document roles":
        return "admin-settings/document-roles";
      case "account information":
        return "profile/account-info";
      case "appearance settings":
        return "settings/appearance";
      default:
        return "";
    }
  }

  async createNewRole(name, description) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/supabase/roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to create new role");
    } catch (error) {
      console.error("Error creating new role:", error);
      throw error;
    }
  }

  printFilteredHistory() {
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

  async init(user_id) {
    await this.loadConversationHistory(user_id);
  }

  async loadConversationHistory(user_id) {
    try {
      const questionsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/supabase/users/${user_id}/app-agent/questions`,
      );
      if (!questionsResponse.ok) throw new Error("Failed to fetch questions");
      const questions = await questionsResponse.json();

      this.history = [this.history[0]];

      for (const question of questions) {
        this.addToHistory({
          role: "user",
          content: question.content,
        });

        const answersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/supabase/users/${user_id}/app-agent/questions/${question.id}/answers`,
        );
        if (!answersResponse.ok) throw new Error("Failed to fetch answers");
        const answers = await answersResponse.json();

        for (const answer of answers) {
          this.addToHistory({
            role: "assistant",
            content: answer.content,
          });
        }
      }
    } catch (error) {
      console.error("Error loading conversation history:", error);
      throw error;
    }
  }

  pushAnswerToHistory(assistantAnswer) {
    if (!assistantAnswer || typeof assistantAnswer !== "string") {
      throw new Error("Invalid assistant answer provided.");
    }

    this.addToHistory({
      role: "assistant",
      content: assistantAnswer,
    });

    const firstSystemMessage = this.history.find(
      (msg) => msg.role === "system",
    );
    this.history = [
      firstSystemMessage,
      ...this.history.filter(
        (msg) => msg.role !== "system" || msg === firstSystemMessage,
      ),
    ].filter((msg, index, self) => {
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

  getHistoryLength() {
    const historyLength = this.history.reduce(
      (length, message) => length + encode(message.content || "").length,
      0,
    );
    console.log(`History contains ${historyLength} tokens.`);
    return historyLength;
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

  async getAssistantResponse(userMessage) {
    try {
      this.addToHistory({
        role: "user",
        content: userMessage,
      });

      let shouldContinue = true;
      let finalResponse = "";
      let redirectPage = "";

      while (shouldContinue) {
        const assistantResponse = await this.openai.chat.completions.create({
          model: this.model,
          messages: this.history,
          tools: this.tools,
          tool_choice: "auto",
          max_tokens: this.MAX_COMPLETION_TOKENS,
        });

        const message = assistantResponse.choices[0].message;
        this.addToHistory(message);

        if (message.tool_calls) {
          for (const toolCall of message.tool_calls) {
            if (toolCall.function.name === "redirectUserToPage") {
              console.log("Calling redirectUserToPage tool...");
              const args = JSON.parse(toolCall.function.arguments);
              const result = this.redirectUserToPage(args.pageName);
              this.addToHistory({
                role: "tool",
                content: result,
                tool_call_id: toolCall.id,
              });
              redirectPage = result;
            } else if (toolCall.function.name === "createNewRole") {
              console.log("Calling createNewRole tool...");
              const args = JSON.parse(toolCall.function.arguments);
              await this.createNewRole(args.name, args.description);
              this.addToHistory({
                role: "tool",
                content: `Successfully created new role: ${args.name}`,
                tool_call_id: toolCall.id,
              });
            }
          }
        } else {
          finalResponse = message.content;
          shouldContinue = false;
        }
      }

      return { finalResponse, redirectPage };
    } catch (error) {
      console.error("Error getting assistant response:", error);
      throw error;
    }
  }
}
