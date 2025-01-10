import { Pinecone } from "@pinecone-database/pinecone";

class PineconeController {
  constructor() {
    this.pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }

  getIndex(indexName) {
    return this.pc.Index(indexName);
  }

  async createIndex(indexName) {
    if (!indexName) {
      console.log("Index name has not been defined. Returning null.");
      return null;
    }
    // Check if the index already exists
    const existingIndexes = (await this.pc.listIndexes()).indexes;
    const indexAlreadyExists =
      existingIndexes.find((index) => index.name == indexName) !== undefined;
    if (!indexAlreadyExists) {
      console.log(`Index "${indexName}" does not exist. Creating it now...`);

      // Create the index
      await this.pc.createIndex({
        name: indexName,
        dimension: 384,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });

      console.log(`Index "${indexName}" created successfully.`);
    } else {
      console.log(`Index "${indexName}" already exists.`);
    }

    // Return the index object for further use
    const index = this.pc.Index(indexName);
    return index;
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

  async storeEmbeddings(indexName, namespace, embeddings) {
    try {
      const index = this.getIndex(indexName);
      await index.namespace(namespace).upsert(embeddings);
      console.log(`Embeddings successfully upserted into Pinecone.`);
    } catch (error) {
      console.log(`Error storing embeddings: ${error.message}`);
      console.log(error.stack); // Log the full stack trace
    }
  }

  async queryForEmbedding(indexName, namespaces, embedding, topK = 5) {
    const index = this.getIndex(indexName);
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
          namespace: namespace,
          text: match.metadata.text,
          score: match.score,
        }))
      );
    }

    // Sort the combined results by score in descending order
    results.sort((a, b) => b.score - a.score);

    // Extract the top K text chunks with the highest scores
    return results.slice(0, topK).map((result) => {
      return { fromFile: result.namespace, textChunk: result.text };
    });
  }
}

export default PineconeController;
