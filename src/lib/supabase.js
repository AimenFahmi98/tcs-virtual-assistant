"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ssiznirqzcgkeuzesfad.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getQuestions(conversationId) {
  try {
    // Perform the query with a filter for the conversationId
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .eq("conversationId", conversationId); // Filter by conversationId

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error fetching questions:", error.message);
      return { success: false, error: error.message, data: null };
    }

    // Handle case where no data is returned
    if (!questions || questions.length === 0) {
      console.warn("No questions found for the given conversationId.");
      return { success: true, error: null, data: [] };
    }

    // Return the filtered data if successful
    return { success: true, error: null, data: questions };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while fetching questions:", err);
    return { success: false, error: err.message, data: null };
  }
}

export async function getAnswers(conversationId) {
  try {
    let { data: answers, error } = await supabase
      .from("answers")
      .select("*")
      .eq("conversationId", conversationId);

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error fetching questions:", error.message);
      return { success: false, error: error.message, data: null };
    }

    // Handle case where no data is returned
    if (!answers || answers.length === 0) {
      console.warn("No answers found in the database.");
      return { success: true, error: null, data: [] };
    }

    // Return the data if successful
    return { success: true, error: null, data: answers };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while fetching answers:", err);
    return { success: false, error: err.message, data: null };
  }
}

export async function addQuestion(content, conversationId) {
  try {
    // Insert the question into the "questions" table
    const { data, error } = await supabase
      .from("questions")
      .insert([{ content, conversationId }])
      .select();

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error adding question:", error.message);
      return { success: false, error: error.message };
    }

    // Return the inserted data if successful
    return { success: true, data };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while adding question:", err);
    return { success: false, error: err.message };
  }
}

export async function addAnswer(
  content,
  filesUsedAsContext,
  questionId,
  conversationId
) {
  try {
    // Insert the question into the "answers" table
    const { data, error } = await supabase
      .from("answers")
      .insert([{ content, filesUsedAsContext, questionId, conversationId }])
      .select();

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error adding question:", error.message);
      return { success: false, error: error.message };
    }

    // Return the inserted data if successful
    return { success: true, data };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while adding question:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteQuestion(questionId) {
  try {
    // Delete the question from the "questions" table
    const { data, error } = await supabase
      .from("questions")
      .delete()
      .eq("id", questionId);

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error deleting question:", error.message);
      return { success: false, error: error.message };
    }

    // Return success if the question was deleted
    if (data?.length === 0) {
      console.warn("No question found with the specified ID.");
      return {
        success: true,
        message: "No question found with the specified ID.",
      };
    }

    return { success: true, data };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while deleting question:", err);
    return { success: false, error: err.message };
  }
}

export async function getConversations() {
  try {
    // Perform the query
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*");

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error fetching conversations:", error.message);
      return { success: false, error: error.message, data: null };
    }

    // Handle case where no data is returned
    if (!conversations || conversations.length === 0) {
      console.warn("No conversations found in the database.");
      return { success: true, error: null, data: [] };
    }

    // Return the data if successful
    return { success: true, error: null, data: conversations };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while fetching conversations:", err);
    return { success: false, error: err.message, data: null };
  }
}

export async function addConversation(title) {
  try {
    // Insert the conversation into the "conversations" table
    const { data, error } = await supabase
      .from("conversations")
      .insert([{ title }])
      .select();

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error adding conversation:", error.message);
      return { success: false, error: error.message };
    }

    // Return the inserted data if successful
    return { success: true, data };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while adding conversation:", err);
    return { success: false, error: err.message };
  }
}

export async function storeNewConversationTitle(conversationId, newTitle) {
  try {
    // Update the title in the "conversations" table where the ID matches
    const { data, error } = await supabase
      .from("conversations")
      .update({ title: newTitle }) // Set the new title
      .eq("id", conversationId); // Specify the conversation to update by ID

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error updating conversation title:", error.message);
      return { success: false, error: error.message };
    }

    // Return the updated data if successful
    return { success: true, data };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while updating conversation title:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteConversationById(conversationId) {
  try {
    // Delete the conversation itself
    const { data, error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId);

    if (error) {
      console.error("Error deleting conversation:", error.message);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      console.warn("No conversation found with the specified ID.");
      return {
        success: true,
        message: "No conversation found with the specified ID.",
      };
    }

    return { success: true, data };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while deleting conversation:", err);
    return { success: false, error: err.message };
  }
}
