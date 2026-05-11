/**
 * VERTEX AI CHAT ENDPOINT
 * Integrates Vertex AI into the chat API
 */

import { Request, Response, Router } from "express";
import { vertexAIService } from "../services/VertexAIService";

const router = Router();

interface ChatRequest {
  message: string;
  preferences?: {
    cuisine?: string;
    budget?: string;
    location?: string;
    occasion?: string;
  };
}

/**
 * POST /api/ai/chat
 * Send user message to Vertex AI for semantic understanding
 */
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, preferences } = req.body as ChatRequest;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log(`📨 Chat Request: ${message}`);

    // Get response from Vertex AI
    const response = await vertexAIService.processConversation(message);

    res.json({
      success: true,
      message: response.content,
      metadata: response.metadata,
    });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to process chat message",
    });
  }
});

/**
 * POST /api/ai/analyze-intent
 * Analyze user intent for cuisine, budget, location preferences
 */
router.post("/analyze-intent", async (req: Request, res: Response) => {
  try {
    const { message } = req.body as { message: string };

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log(`🔍 Analyzing intent: ${message}`);

    // Get intent analysis from Vertex AI
    const response = await vertexAIService.analyzeUserIntent(message);

    res.json({
      success: true,
      analysis: response.content,
      metadata: response.metadata,
    });
  } catch (error) {
    console.error("Intent analysis error:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to analyze intent",
    });
  }
});

/**
 * POST /api/ai/recommendations
 * Generate personalized restaurant recommendations
 */
router.post("/recommendations", async (req: Request, res: Response) => {
  try {
    const { preferences } = req.body as {
      preferences: {
        cuisine?: string;
        budget?: string;
        location?: string;
        occasion?: string;
      };
    };

    if (!preferences) {
      return res.status(400).json({ error: "Preferences are required" });
    }

    console.log(`🍽️ Generating recommendations for:`, preferences);

    // Generate recommendations from Vertex AI
    const response = await vertexAIService.generateRecommendations(preferences);

    res.json({
      success: true,
      recommendations: response.content,
      metadata: response.metadata,
    });
  } catch (error) {
    console.error("Recommendations error:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to generate recommendations",
    });
  }
});

/**
 * POST /api/ai/clear-history
 * Clear conversation history
 */
router.post("/clear-history", (req: Request, res: Response) => {
  try {
    vertexAIService.clearHistory();
    res.json({ success: true, message: "Conversation history cleared" });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to clear history",
    });
  }
});

export default router;
