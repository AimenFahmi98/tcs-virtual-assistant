import { Pinecone } from "@pinecone-database/pinecone";
import { getChunkByDocumentId } from "./supabase";
/**
 * Controller class for managing Pinecone vector database operations.
 * Handles initialization, storage, and querying of embeddings in namespaced collections.
 *
 * @class PineconeController
 * @classdesc Manages interactions with Pinecone vector database including storing and querying embeddings
 * across different namespaces. Provides methods for checking namespace existence, storing embeddings,
 * and performing similarity searches.
 *
 * @property {Pinecone} pc - Pinecone client instance
 * @property {string} INDEX_NAME - Name of the Pinecone index to use
 *
 * @example
 * const controller = new PineconeController();
 * await controller.storeEmbeddings(embeddings, "my-namespace");
 * const results = await controller.queryForEmbedding(["my-namespace"], queryEmbedding);
 */
class PineconeController {
  constructor() {
    this.pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    this.INDEX_NAME = "tcs-ai-assistant";
  }

  getIndex() {
    return this.pc.Index(this.INDEX_NAME);
  }

  async namespaceAlreadyExists(index, namespace) {
    // Check if the namespace already exists
    const existingNamespaces = await index.describeIndexStats();
    if (
      existingNamespaces.namespaces &&
      existingNamespaces.namespaces[namespace]
    ) {
      return true;
    }
    return false;
  }

  /**
   * Store embeddings in Pinecone under a specific namespace.
   * @param {Array<Object>} embeddingsWithMetadata - Array of objects containing the embedding, ID, and metadata.
   * Format: [{ id: "unique-id", values: [embedding-vector], metadata: { key: value } }]
   * @param {string} namespace - Namespace for storing embeddings (e.g., file-specific namespace).
   * @returns {Promise<void>}
   */
  async storeEmbeddings(embeddings, namespace) {
    try {
      const pcIndex = this.getIndex();

      // Check if the namespace already exists; create it if it doesn't
      const namespaceExists = await this.namespaceAlreadyExists(
        pcIndex,
        namespace,
      );
      if (namespaceExists) {
        return;
      }

      // Prepare data for upserting
      const upserts = embeddings.map((embedding, index) => ({
        id: `${namespace}_chunk_${index}`,
        values: embedding.vector,
      }));

      // Upsert data into Pinecone
      await pcIndex.namespace(namespace).upsert(upserts);
      console.log(
        `Embeddings successfully stored under namespace: ${namespace}`,
      );
    } catch (error) {
      console.error("Error storing embeddings in Pinecone:", error);
      throw error;
    }
  }

  /**
   * Queries multiple namespaces for similar vectors and retrieves corresponding text chunks
   * @param {string[]} namespaces - Array of namespace names to search in
   * @param {number[]} embedding - Vector embedding to search for similar matches
   * @param {number} [topK=5] - Number of top results to return per namespace
   * @returns {Promise<Array<{fromFile: string, textChunk: string}>>} Array of objects containing matched text chunks and their source files
   */
  async queryForEmbedding(namespaces, embedding, topK = 5) {
    const index = this.getIndex();
    let results = [];
    for (const namespace of namespaces) {
      const response = await index.namespace(namespace).query({
        topK: topK,
        vector: embedding,
        includeValues: true,
        includeMetadata: true,
      });
      // Add each match to the results array with relevant info
      results = results.concat(
        response.matches.map((match) => ({
          namespace,
          id: match.id,
          score: match.score,
        })),
      );
    }

    // Sort the combined results by score in descending order
    results.sort((a, b) => b.score - a.score);

    const chunks = await Promise.all(
      results.slice(0, topK).map(async (result) => {
        const { success, chunk } = await getChunkByDocumentId(result.id);
        return { fromFile: result.namespace, textChunk: chunk };
      }),
    );

    return chunks;
  }
}

export default PineconeController;
