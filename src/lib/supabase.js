/**
 * @fileoverview Supabase client configuration and database operations module.
 * This module provides a comprehensive set of functions for interacting with a Supabase database,
 * handling conversations, questions, answers, themes, and document management.
 *
 * Key features include:
 * - Conversation management (CRUD operations)
 * - Q&A handling (questions and answers storage)
 * - Theme management
 * - Document storage and retrieval
 * - File upload and management
 * - Document chunking for RAG (Retrieval-Augmented Generation)
 *
 * @module supabase
 * @requires @supabase/supabase-js
 *
 * @example
 * import { getConversations, addQuestion, uploadFileToSupabase } from './supabase';
 *
 * @author [Your Name]
 * @version 1.0.0
 */
"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ssiznirqzcgkeuzesfad.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Retrieves the current theme from the database.
 * @async
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {string|null} .error - Error message if any
 * @returns {string|null} .data - Theme name if found
 */
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

/**
 * Replaces the existing theme with a new one.
 * @async
 * @param {string} theme - The new theme name to be set
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Inserted theme data if successful
 * @returns {string|null} .error - Error message if any
 */
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

/**
 * Retrieves questions for a specific conversation.
 * @async
 * @param {string|number} conversationId - The ID of the conversation
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Array|null} .data - Array of question objects if found
 * @returns {string|null} .error - Error message if any
 */
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

/**
 * Retrieves answers for a specific conversation.
 * @async
 * @param {string|number} conversationId - The ID of the conversation
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Array|null} .data - Array of answer objects if found
 * @returns {string|null} .error - Error message if any
 */
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

/**
 * Adds a new question to the database.
 * @async
 * @param {string} content - The content of the question
 * @param {string|number} conversationId - The ID of the conversation
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Inserted question data if successful
 * @returns {string|null} .error - Error message if any
 */
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

/**
 * Adds a new answer to the database.
 * @async
 * @param {string} content - The content of the answer
 * @param {Array} filesUsedAsContext - Array of files used as context
 * @param {string|number} questionId - The ID of the related question
 * @param {string|number} conversationId - The ID of the conversation
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Inserted answer data if successful
 * @returns {string|null} .error - Error message if any
 */
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

/**
 * Deletes a specific question from the database.
 * @async
 * @param {string|number} questionId - The ID of the question to delete
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Deleted question data if successful
 * @returns {string|null} .error - Error message if any
 */
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

/**
 * Retrieves all conversations from the database.
 * @async
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Array|null} .data - Array of conversation objects if found
 * @returns {string|null} .error - Error message if any
 */
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

/**
 * Creates a new conversation in the database.
 * @async
 * @param {string} title - The title of the conversation
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Inserted conversation data if successful
 * @returns {string|null} .error - Error message if any
 */
export async function addConversation(title, user_id) {
  try {
    // Insert the conversation into the "conversations" table with user_id
    const { data, error } = await supabase
      .from("conversations")
      .insert([{ title, user_id }])
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

/**
 * Updates the title of an existing conversation.
 * @async
 * @param {string|number} conversationId - The ID of the conversation
 * @param {string} newTitle - The new title for the conversation
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Updated conversation data if successful
 * @returns {string|null} .error - Error message if any
 */
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

/**
 * Deletes a specific conversation from the database.
 * @async
 * @param {string|number} conversationId - The ID of the conversation to delete
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Deleted conversation data if successful
 * @returns {string|null} .error - Error message if any
 */
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

/**
 * Delete multiple files from Supabase storage.
 * @param {string[]} fileNames - Array of file names to delete.
 * @param {string} bucketName - The Supabase storage bucket name.
 * @returns {object} - Object containing success status and message.
 */
export async function deleteFilesFromSupabase(
  fileNames,
  bucketName = "documents",
) {
  try {
    const filePaths = fileNames.map((fileName) => `uploads/${fileName}`);
    const { error } = await supabase.storage.from(bucketName).remove(filePaths);

    if (error) {
      console.error("Error deleting files from Supabase:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, message: "Files deleted successfully" };
  } catch (err) {
    console.error("Unexpected error during files deletion:", err);
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
 * Stores document chunks in Supabase database in batches.
 *
 * @async
 * @param {Array<Object>} chunks - Array of chunk objects to store
 * @param {string} chunks[].content - Content of the chunk
 * @param {string} chunks[].id - Pinecone ID of the chunk
 * @param {string} chunks[].documentId - Document ID the chunk belongs to
 * @param {number} [batchSize=10] - Number of chunks to insert per batch
 *
 * @returns {Promise<Object>} Result object
 * @returns {boolean} result.success - Whether the operation was successful
 * @returns {string} result.message - Status message
 * @returns {Array<Error>} [result.errors] - Array of errors if any batches failed
 * @returns {string} [result.error] - Error message if an unexpected error occurred
 *
 * @throws {Error} When a batch insertion fails
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

/**
 * Retrieves all documents selected for RAG (Retrieval-Augmented Generation).
 * @async
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Array|null} .data - Array of selected document objects if found
 * @returns {string|null} .error - Error message if any
 */
export async function getAllRAGSelectedDocuments() {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("isSelectedForRAG", true);

    if (error) {
      console.error("Error fetching selected documents:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error fetching selected documents:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Deletes multiple documents by their IDs.
 * @async
 * @param {Array<string|number>} documentIds - Array of document IDs to delete
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Deleted documents data if successful
 * @returns {string|null} .error - Error message if any
 */
export async function deleteDocumentsByIds(documentIds) {
  try {
    // Delete the documents from the "documents" table
    const { data, error } = await supabase
      .from("documents")
      .delete()
      .in("id", documentIds);

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error deleting documents:", error.message);
      return { success: false, error: error.message };
    }

    // Return success if the documents were deleted
    if (!data || data.length === 0) {
      console.warn("No documents found with the specified IDs.");
      return {
        success: true,
        message: "No documents found with the specified IDs.",
      };
    }

    return { success: true, data };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while deleting documents:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Marks specified documents as selected for RAG.
 * @async
 * @param {Array<string|number>} documentIds - Array of document IDs to select
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Updated documents data if successful
 * @returns {string|null} .error - Error message if any
 */
export async function selectDocumentsForRAG(documentIds) {
  try {
    // Update the isSelectedForRAG property to true for the specified document IDs
    const { data, error } = await supabase
      .from("documents")
      .update({ isSelectedForRAG: true })
      .in("id", documentIds);

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error updating documents:", error.message);
      return { success: false, error: error.message };
    }

    // Return success if the documents were updated
    return { success: true, data };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while updating documents:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Unmarks specified documents as selected for RAG.
 * @async
 * @param {Array<string|number>} documentIds - Array of document IDs to unselect
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Updated documents data if successful
 * @returns {string|null} .error - Error message if any
 */
export async function unselectDocumentsForRAG(documentIds) {
  try {
    // Update the isSelectedForRAG property to false for the specified document IDs
    const { data, error } = await supabase
      .from("documents")
      .update({ isSelectedForRAG: false })
      .in("id", documentIds);

    // Handle potential errors from Supabase
    if (error) {
      console.error("Error updating documents:", error.message);
      return { success: false, error: error.message };
    }

    // Return success if the documents were updated
    return { success: true, data };
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error while updating documents:", err);
    return { success: false, error: err.message };
  }
}

/* Managing Users */

/**
 * Handles user sign-in using Supabase authentication.
 *
 * @async
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user account.
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the sign-in was successful
 * @returns {Object|null} .data - User session data if successful
 * @returns {string|null} .error - Error message if any
 */
export async function logIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error during sign in:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error during sign in:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Handles user registration using Supabase authentication.
 *
 * @async
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user account.
 * @returns {Promise<Object>} An object containing the result of the signup operation
 * @returns {boolean} .success - Indicates if the signup was successful
 * @returns {string} [.error] - Error message if signup failed
 * @returns {string} [.userId] - The ID of the created user if signup succeeded
 * @throws {Error} If there's an unexpected error during the signup process
 */
export async function signUp(email, password) {
  try {
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return { success: false, error: "Email already exists" };
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Error during signup:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error during signup:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Creates a user profile in the database.
 * @async
 * @param {string} userId - The user's ID
 * @param {string} fullName - The user's full name
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Created profile data if successful
 * @returns {string|null} .error - Error message if any
 */
export async function createUserProfile(id, email, fullName) {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert([{ id, email, fullName }])
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error creating user profile:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Gets the current session.
 * @async
 * @returns {Promise<Object>} Result object containing:
 * @returns {boolean} .success - Whether the operation was successful
 * @returns {Object|null} .data - Session data if found
 * @returns {string|null} .error - Error message if any
 */
export async function getCurrentSession() {
  try {
    const response = await supabase.auth.getSession();

    console.log("From getCurrentSession():", response);

    if (response.error) {
      console.error("Error getting session:", response.error.message);
      return { success: false, error: response.error.message };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error getting session:", error.message);
    return { success: false, error: error.message };
  }
}
export async function getCurrentUser() {
  try {
    // First check if we have a session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return null;
    }

    if (!session) {
      console.log("No active session found");
      return null;
    }

    // Then get user data
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("User error:", userError);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: error.message };
  }
}
