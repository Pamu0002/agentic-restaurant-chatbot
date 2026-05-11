/**
 * AI CHAT SERVICE
 * Frontend service to communicate with Vertex AI backend
 */

export interface ChatResponse {
  success: boolean;
  message: string;
  metadata?: {
    model: string;
    tokens?: number;
  };
}

export interface AnalysisResponse {
  success: boolean;
  analysis: string;
  metadata?: {
    model: string;
  };
}

export interface RecommendationsResponse {
  success: boolean;
  recommendations: string;
  metadata?: {
    model: string;
  };
}

class AIChatService {
  private apiBaseUrl: string;
  private requestCache: Map<string, ChatResponse> = new Map();

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  }

  /**
   * Send chat message to Vertex AI backend
   */
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      // Check cache first
      if (this.requestCache.has(message)) {
        console.log("📦 Using cached response for:", message);
        return this.requestCache.get(message)!;
      }

      console.log("📤 Sending message to Vertex AI:", message);

      const response = await fetch(`${this.apiBaseUrl}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = (await response.json()) as ChatResponse;

      // Cache successful response
      this.requestCache.set(message, data);

      console.log("✅ Vertex AI Response:", data.message);
      return data;
    } catch (error) {
      console.error("❌ AI Chat Error:", error);
      throw new Error(
        `Failed to get AI response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Analyze user intent for cuisine, budget, location preferences
   */
  async analyzeIntent(message: string): Promise<AnalysisResponse> {
    try {
      console.log("🔍 Analyzing intent:", message);

      const response = await fetch(`${this.apiBaseUrl}/api/ai/analyze-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = (await response.json()) as AnalysisResponse;
      console.log("✅ Intent Analysis:", data.analysis);
      return data;
    } catch (error) {
      console.error("❌ Intent Analysis Error:", error);
      throw new Error(
        `Failed to analyze intent: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get personalized recommendations based on preferences
   */
  async getRecommendations(preferences: {
    cuisine?: string;
    budget?: string;
    location?: string;
    occasion?: string;
  }): Promise<RecommendationsResponse> {
    try {
      console.log("🍽️ Fetching recommendations for:", preferences);

      const response = await fetch(
        `${this.apiBaseUrl}/api/ai/recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ preferences }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = (await response.json()) as RecommendationsResponse;
      console.log("✅ Recommendations:", data.recommendations);
      return data;
    } catch (error) {
      console.error("❌ Recommendations Error:", error);
      throw new Error(
        `Failed to get recommendations: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Clear conversation history on backend
   */
  async clearHistory(): Promise<{ success: boolean }> {
    try {
      console.log("🗑️ Clearing conversation history");

      const response = await fetch(`${this.apiBaseUrl}/api/ai/clear-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      this.requestCache.clear();
      console.log("✅ History cleared");
      return await response.json();
    } catch (error) {
      console.error("❌ Clear History Error:", error);
      throw new Error(
        `Failed to clear history: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Extract preferences from message using simple pattern matching
   * (falls back to Vertex AI analysis if complex)
   */
  extractPreferencesFromMessage(message: string): {
    cuisine?: string;
    budget?: string;
    location?: string;
    occasion?: string;
  } {
    const preferences: {
      cuisine?: string;
      budget?: string;
      location?: string;
      occasion?: string;
    } = {};

    const messageLower = message.toLowerCase();

    // Cuisine detection
    if (
      messageLower.includes("italian") ||
      messageLower.includes("pizza") ||
      messageLower.includes("pasta")
    ) {
      preferences.cuisine = "Italian";
    } else if (
      messageLower.includes("sri lankan") ||
      messageLower.includes("curry")
    ) {
      preferences.cuisine = "Sri Lankan";
    } else if (messageLower.includes("seafood")) {
      preferences.cuisine = "Seafood";
    }

    // Budget detection
    if (
      messageLower.includes("expensive") ||
      messageLower.includes("luxury") ||
      messageLower.includes("high-end")
    ) {
      preferences.budget = "high";
    } else if (
      messageLower.includes("budget") ||
      messageLower.includes("cheap") ||
      messageLower.includes("affordable")
    ) {
      preferences.budget = "low";
    } else if (messageLower.includes("medium")) {
      preferences.budget = "medium";
    }

    // Location detection
    if (messageLower.includes("colombo")) {
      preferences.location = "Colombo";
    } else if (messageLower.includes("galle")) {
      preferences.location = "Galle";
    } else if (messageLower.includes("kandy")) {
      preferences.location = "Kandy";
    }

    // Occasion detection
    if (messageLower.includes("date")) {
      preferences.occasion = "date";
    } else if (messageLower.includes("business")) {
      preferences.occasion = "business";
    } else if (messageLower.includes("family")) {
      preferences.occasion = "family";
    }

    return preferences;
  }
}

// Export singleton instance
export const aiChatService = new AIChatService();
export default AIChatService;
