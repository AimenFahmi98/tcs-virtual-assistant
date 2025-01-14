import OpenaiController from "../../../lib/openai";

// A map to store OpenaiController instances by conversationId
const controllers = new Map();

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

// Endpoint for generating the answer and files used
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

// New endpoint for generating the conversation title
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
