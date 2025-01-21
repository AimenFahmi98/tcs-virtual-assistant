/**
 * @fileoverview API routes for handling OpenAI interactions and conversation management
 * @module api/openai/route
 */

import OpenaiController from "../../../lib/openai";

/**
 * @type {Map<string, OpenaiController>}
 * A map to store OpenAI controller instances indexed by conversation ID
 */
const controllers = new Map();

/**
 * Gets an existing OpenAI controller or creates a new one for a given conversation
 * @param {string|number} conversationId - The ID of the conversation
 * @returns {Promise<OpenaiController>} The OpenAI controller instance
 */
async function getOrCreateController(conversationId) {
  const id = String(conversationId); // Ensure the ID is a string
  if (controllers.has(id)) {
    return controllers.get(id);
  }

  const newController = new OpenaiController();
  await newController.loadConversationHistory(id);
  controllers.set(id, newController);
  return newController;
}

/**
 * POST endpoint for generating streaming answers from OpenAI
 * @async
 * @function POST
 * @param {Request} request - The incoming request object containing question and conversation details
 * @property {string} request.question - The user's question
 * @property {string} request.activeConversationId - The current conversation ID
 * @property {string[]} request.RAGDocumentNames - Array of document names for RAG context
 * @returns {Response} Streaming response with answer chunks
 */
export async function POST(request) {
  const { question, activeConversationId, RAGDocumentNames } =
    await request.json();

  const openaiController = await getOrCreateController(
    String(activeConversationId),
  );
  const answerStream = await openaiController.answer(
    question,
    RAGDocumentNames,
  );
  let fullAnswer = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of answerStream) {
          if (chunk?.choices && chunk.choices[0]?.delta?.content) {
            const message = chunk.choices[0].delta.content;
            controller.enqueue(`${message}`);
            fullAnswer += message;
          }
        }
        openaiController.pushAnswerToHistory(fullAnswer);
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/**
 * GET endpoint for generating conversation titles and retrieving used files
 * @async
 * @function GET
 * @param {Request} request - The incoming request object
 * @param {string} request.url.searchParams.conversationId - The conversation ID to generate title for
 * @returns {Response} JSON response containing new conversation title and files used
 * @throws {Response} 400 error if conversationId is missing
 */
export async function GET(request) {
  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId");

  if (!conversationId) {
    return new Response("Missing conversationId", { status: 400 });
  }

  const openaiController = await getOrCreateController(String(conversationId));
  const newConversationTitle = await openaiController.generateTitle();
  const filesUsed = openaiController.getFilesUsedInLastRequest();

  return new Response(JSON.stringify({ newConversationTitle, filesUsed }), {
    headers: { "Content-Type": "application/json" },
  });
}
