/**
 * VERTEX AI SERVICE
 * Integrates Google Vertex AI using REST API
 * Provides semantic understanding for restaurant chatbot
 */

import { GoogleAuth } from 'google-auth-library';

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface VertexAIResponse {
  content: string;
  metadata?: {
    model: string;
    tokens?: number;
  };
}

class VertexAIService {
  private projectId: string;
  private location: string;
  private conversationHistory: ChatMessage[] = [];
  private auth: GoogleAuth;
  private apiEndpoint: string;

  constructor() {
    console.log(`\n🔧 === Initializing Vertex AI Service ===`);
    
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || "";
    this.location = process.env.VERTEX_AI_LOCATION || "us-central1";

    console.log(`   Project ID: ${this.projectId}`);
    console.log(`   Location: ${this.location}`);
    console.log(`   Credentials: ${process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Set' : '❌ Not set'}`);

    if (!this.projectId) {
      throw new Error(
        "GOOGLE_CLOUD_PROJECT_ID environment variable is required"
      );
    }

    try {
      // Initialize Google Auth
      console.log(`   Initializing Google Auth...`);
      this.auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      
      // Set API endpoint
      this.apiEndpoint = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models`;
      
      console.log(`✅ Vertex AI initialized`);
      console.log(`   API Endpoint: ${this.apiEndpoint}`);
      console.log(`   === Initialization Complete ===\n`);
    } catch (e) {
      console.error(`❌ Failed to initialize Vertex AI:`, e);
      throw e;
    }
  }

  /**
   * Call Vertex AI REST API
   */
  private async callVertexAI(prompt: string, systemInstruction?: string): Promise<string> {
    try {
      const client = await this.auth.getClient();
      const accessToken = await client.getAccessToken();
      
      const modelName = "gemini-1.0-pro";  // Use the standard model
      const url = `${this.apiEndpoint}/${modelName}:generateContent`;
      
      console.log(`   📡 Calling: ${url}`);
      
      const requestBody: any = {
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      };
      
      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }
      
      const response = await axios.post(url, requestBody, {
        headers: {
          'Authorization': `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log(`   ✅ Got response from API`);
      
      // Extract text from response
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text;
      }
      
      throw new Error("No text content in response");
    } catch (error) {
      console.error(`❌ REST API Error:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Get semantic understanding of user message for restaurant recommendations
   */
  async analyzeUserIntent(userMessage: string): Promise<VertexAIResponse> {
    try {
      console.log(`\n🔍 === Analyzing Intent ===`);
      console.log(`   Message: ${userMessage}`);
      
      const systemInstruction = `You are an intelligent restaurant recommendation assistant. Your role is to:
1. Understand user intent about restaurants
2. Identify cuisine preferences, budget, location
3. Detect booking intentions
4. Provide personalized recommendations

Be concise and friendly. Focus on Sri Lankan restaurants and cuisines.`;

      const content = await this.callVertexAI(userMessage, systemInstruction);
      
      console.log(`✅ Intent analysis complete\n`);
      
      // Store in history
      this.conversationHistory.push({
        role: "user",
        content: userMessage,
      });
      
      this.conversationHistory.push({
        role: "assistant",
        content,
      });

      return {
        content,
        metadata: {
          model: "gemini-1.0-pro",
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      console.error("❌ Intent Analysis Error:", errorMessage);
      throw new Error(`Intent analysis failed: ${errorMessage}`);
    }
  }

  /**
   * Generate personalized recommendations based on conversation context
   */
  async generateRecommendations(
    preferences: {
      cuisine?: string;
      budget?: string;
      location?: string;
      occasion?: string;
    }
  ): Promise<VertexAIResponse> {
    try {
      console.log(`\n🍽️ === Generating Recommendations ===`);
      
      const systemInstruction = `You are a restaurant recommendation engine. Generate 3-5 personalized restaurant recommendations based on user preferences.
Format as:
- Restaurant Name (Rating) - Brief description
- Cuisine type, Price range, Location
- Why recommended for this user

Only recommend real or realistic Sri Lankan restaurants.`;

      const preferenceText = `
User Preferences:
- Cuisine: ${preferences.cuisine || "Any"}
- Budget: ${preferences.budget || "Any"}
- Location: ${preferences.location || "Any"}
- Occasion: ${preferences.occasion || "Casual dining"}

Please recommend restaurants that match these preferences.`;

      const content = await this.callVertexAI(preferenceText, systemInstruction);
      
      console.log(`✅ Recommendations generated\n`);

      return {
        content,
        metadata: {
          model: "gemini-1.0-pro",
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      console.error("❌ Recommendation Generation Error:", errorMessage);
      throw new Error(`Recommendation generation failed: ${errorMessage}`);
    }
  }

  /**
   * Process conversation with full context
   */
  async processConversation(userMessage: string): Promise<VertexAIResponse> {
    try {
      console.log(`\n📨 === Processing Conversation ===`);
      console.log(`   User Message: ${userMessage}`);

      const systemInstruction = `You are Chef, a friendly and knowledgeable restaurant assistant. 
You help users find restaurants, make reservations, and explore Sri Lankan cuisines.
Be helpful, concise, and personable in your responses.
If the user mentions specific cuisines, locations, or preferences, use that information.`;

      // Build prompt with conversation history
      let fullPrompt = userMessage;
      
      const recentHistory = this.conversationHistory.slice(-10);
      if (recentHistory.length > 0) {
        let historyText = "Previous conversation:\n";
        for (const msg of recentHistory) {
          historyText += `${msg.role}: ${msg.content}\n`;
        }
        fullPrompt = historyText + `\nUser: ${userMessage}`;
      }
      
      console.log(`✅ Built prompt with ${recentHistory.length} history messages`);

      // Call Vertex AI
      console.log(`🔄 Calling Vertex AI...`);
      const content = await this.callVertexAI(fullPrompt, systemInstruction);
      
      console.log(`✅ Got response from AI`);

      // Update history
      this.conversationHistory.push({
        role: "user",
        content: userMessage,
      });

      this.conversationHistory.push({
        role: "assistant",
        content,
      });
      
      console.log(`✅ === Conversation Processed Successfully ===\n`);

      return {
        content,
        metadata: {
          model: "gemini-1.0-pro",
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      console.error(`❌ === Conversation Processing Failed ===`);
      console.error(`   Error: ${errorMessage}`);
      throw new Error(`Failed to process conversation: ${errorMessage}`);
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }
}

// Export singleton instance
export const vertexAIService = new VertexAIService();
export default VertexAIService;
