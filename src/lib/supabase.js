"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ssiznirqzcgkeuzesfad.supabase.co";
const supabaseKey = process.env.SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getTheme() {
  try {
    // Perform the query with a filter for the conversationId
    const { data: theme, error } = await supabase
      .from("themes")
      .select("name")
      .single();

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error fetching theme:", error.message);
      return { success: false, error: error.message, data: null };
    }

    // Handle case where no data is returned
    if (!theme || theme.length === 0) {
      console.warn("No theme found.");
      return { success: true, error: null, data: null };
    }

    // Return the filtered data if successful
    return { success: true, error: null, data: theme.name };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while fetching theme:", err);
    return { success: false, error: err.message, data: null };
  }
}

export async function replaceTheme(theme) {
  try {
    // Delete all existing themes
    await supabase.from("themes").delete().neq("id", 0);

    // Insert the new theme into the "themes" table
    const { data, error } = await supabase
      .from("themes")
      .insert([{ name: theme }])
      .select();

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error adding theme:", error.message);
      return { success: false, error: error.message };
    }

    // Return the inserted data if successful
    return { success: true, data };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while adding theme:", err);
    return { success: false, error: err.message };
  }
}

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
      console.warn(
        "No questions found for the given conversationId:",
        conversationId,
      );
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
  conversationId,
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

/* Managing Documents */

/**
 * Upload a file to Supabase storage.
 * @param {File} file - The file object to upload.
 * @param {string} bucketName - The Supabase storage bucket name.
 * @returns {object} - Object containing success status and file path.
 */
export async function uploadFileToSupabase(file, bucketName = "documents") {
  try {
    const filePath = `uploads/${file.name}`;

    // Check if the file already exists
    const { data: existingFile, error: listError } = await supabase.storage
      .from(bucketName)
      .list("uploads", { search: file.name });

    if (listError) {
      console.error(
        "Error checking file existence in Supabase:",
        listError.message,
      );
      return { success: false, error: listError.message };
    }

    if (existingFile && existingFile.length > 0) {
      console.log("File already exists in Supabase storage.");
      return { success: false, path: filePath };
    }

    // Upload the file if it doesn't exist
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading file to Supabase:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, path: data.path };
  } catch (err) {
    console.error("Unexpected error during file upload:", err);
    return { success: false, error: err.message };
  }
}

export async function addDocumentToSupabase(document) {
  const { data, error } = await supabase
    .from("documents")
    .insert(document)
    .select()
    .single();
  if (error) {
    console.error("Error storing document metadata:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

/**
 * Store chunks and metadata in Supabase using parallel batch inserts.
 * @param {Array} chunks - Array of text chunks to store.
 * @param {number} batchSize - The maximum number of chunks to insert per batch.
 * @returns {object} - Object containing success status and details.
 */
export async function storeChunksInSupabase(chunks, batchSize = 10) {
  try {
    const chunkData = chunks.map((chunk) => ({
      content: chunk.content,
      pineconeId: chunk.id,
      documentId: chunk.documentId,
    }));

    // Divide chunks into batches
    const batches = [];
    for (let i = 0; i < chunkData.length; i += batchSize) {
      batches.push(chunkData.slice(i, i + batchSize));
    }

    // Execute batch inserts in parallel
    const insertPromises = batches.map(async (batch, index) => {
      const { data, error } = await supabase
        .from("document_chunks")
        .insert(batch);

      if (error) {
        console.error(`Error storing batch ${index}:`, error.message);
        throw new Error(`Batch ${index} failed: ${error.message}`);
      }

      return data;
    });

    // Wait for all batches to complete
    const results = await Promise.allSettled(insertPromises);

    // Check for errors in the results
    const errors = results.filter((result) => result.status === "rejected");
    if (errors.length > 0) {
      console.error("Errors occurred during batch insertions:", errors);
      return {
        success: false,
        message: "Some batches failed.",
        errors: errors.map((err) => err.reason),
      };
    }

    return { success: true, message: "All chunks stored successfully" };
  } catch (err) {
    console.error("Unexpected error during chunk storage:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Get a single chunk by document ID from Supabase.
 * @param {string} documentId - The ID of the document.
 * @returns {Promise<object>} - Object containing success status and the chunk data or error message.
 */
export async function getChunkByDocumentId(pineconeId) {
  try {
    const { data, error } = await supabase
      .from("document_chunks")
      .select("*")
      .eq("pineconeId", pineconeId)
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching chunk from Supabase:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, chunk: data.content };
  } catch (err) {
    console.error("Unexpected error during fetching chunk:", err);
    return { success: false, error: err.message };
  }
}

export async function getDocuments() {
  try {
    const { data, error } = await supabase.from("documents").select("*");

    if (error) {
      console.error("Error fetching documents:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error fetching documents:", err);
    return { success: false, error: err.message };
  }
}
