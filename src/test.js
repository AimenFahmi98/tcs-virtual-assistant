import { pipeline } from "@huggingface/transformers";

(async () => {
  try {
    const embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { dtype: "fp32" }
    );
    console.log("Pipeline initialized successfully");
  } catch (error) {
    console.error("Pipeline initialization failed:", error);
  }
})();
