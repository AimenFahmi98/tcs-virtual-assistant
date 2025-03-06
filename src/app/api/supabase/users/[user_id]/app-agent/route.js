import { OpenAIAppAgent } from "@/lib/openaiAppAgent";

const openaiAppAgent = new OpenAIAppAgent();

export async function POST(req, { params }) {
  try {
    const { message } = await req.json();

    // Get response from assistant
    const { finalResponse, redirectPage } =
      await openaiAppAgent.getAssistantResponse(message);

    return new Response(
      JSON.stringify({ response: finalResponse, redirectPage }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

export async function GET(req, { params }) {
  try {
    const { user_id } = await params;
    await openaiAppAgent.init(user_id);
    return new Response(JSON.stringify({ message: "Agent initialized" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
