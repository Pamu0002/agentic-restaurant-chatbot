# Vertex AI + LangChain Integration Guide

## 🚀 Quick Start

You now have Vertex AI (Gemini 1.5) integrated with your chatbot! Here's what was added:

### ✅ Backend Services Created

1. **VertexAIService.ts** (`services/api/src/services/VertexAIService.ts`)
   - Connects to Google Vertex AI
   - Processes chat messages with semantic understanding
   - Generates recommendations
   - Analyzes user intent

2. **AI Routes** (`services/api/src/routes/aiRoutes.ts`)
   - `/api/ai/chat` - Send messages to Vertex AI
   - `/api/ai/analyze-intent` - Extract preferences
   - `/api/ai/recommendations` - Get personalized recommendations
   - `/api/ai/clear-history` - Clear conversation history

### ✅ Frontend Services Created

1. **AIChatService.ts** (`packages/@restaurant/web/src/services/AIChatService.ts`)
   - Frontend client for AI endpoints
   - Response caching
   - Error handling
   - Fallback responses

### ✅ Updated Components

1. **FloatingChatWidget.tsx**
   - Now uses Vertex AI for intelligent responses
   - Falls back to basic responses if AI unavailable
   - Maintains all guest/auth features
   - Real-time semantic chat

---

## 🔧 Setup Steps

### Step 1: Google Cloud Project Setup

Follow the detailed guide in **VERTEX_AI_SETUP.md**:

```bash
cd c:\Users\Pamudi\Desktop\fyp\agentic-restaurant-chatbot
cat VERTEX_AI_SETUP.md
```

Key points:
1. Create Google Cloud project
2. Enable Vertex AI API
3. Create service account
4. Download JSON key

### Step 2: Configure Environment Variables

Create `.env.local` in project root:

```env
# Required
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./config/gcp/service-account-key.json
VERTEX_AI_LOCATION=us-central1

# Optional
VERTEX_AI_TEMPERATURE=0.7
VERTEX_AI_MAX_TOKENS=1024
```

### Step 3: Place Service Account Key

1. Save your downloaded JSON key to:
```
config/gcp/service-account-key.json
```

2. Verify file exists:
```bash
ls config/gcp/service-account-key.json
```

### Step 4: Update API Routes

Register the AI routes in your main API file:

```typescript
// services/api/src/index.ts (or main server file)

import aiRoutes from './routes/aiRoutes';

// Mount AI routes
app.use('/api/ai', aiRoutes);
```

### Step 5: Start Services

```bash
# Terminal 1: Start API
pnpm api:dev

# Terminal 2: Start Web
pnpm web:dev
```

### Step 6: Test Integration

**Test via API:**
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Find me an Italian restaurant in Colombo"}'
```

**Test in Chat Widget:**
1. Open http://localhost:5173
2. Click chat icon (bottom right)
3. Type a message
4. Wait for Vertex AI response

---

## 📊 Available AI Features

### 1. Chat with Semantic Understanding
```typescript
// User types: "Find me a good Italian place near Colombo"
// Vertex AI understands:
// - Cuisine: Italian
// - Location: Colombo
// - Context: Restaurant search
// Response: Intelligent, contextual recommendations
```

### 2. Intent Analysis
```typescript
const analysis = await aiChatService.analyzeIntent(
  "Can you book me a table for 4 at an Italian restaurant tomorrow?"
);
// Returns: Structured intent with cuisine, date, party size, etc.
```

### 3. Personalized Recommendations
```typescript
const recommendations = await aiChatService.getRecommendations({
  cuisine: "Italian",
  budget: "medium",
  location: "Colombo",
  occasion: "dinner"
});
// Returns: AI-generated personalized recommendations
```

### 4. Conversation Context
```typescript
// Maintains conversation history for context-aware responses
// User: "Find me Italian restaurants"
// Assistant: "Here are great Italian options..."
// User: "Can they accommodate 10 people?"
// Assistant: (understands context from previous message)
```

---

## 🛡️ Error Handling

If Vertex AI is unavailable or has issues:

1. **Development**: Check console logs for errors
2. **Production**: Automatically falls back to basic responses
3. **Debugging**: Check `/api/ai/chat` endpoint for 500 errors
4. **Logs**: Check Google Cloud Console → Logs

---

## 💰 Pricing & Billing

**Vertex AI Pricing (Gemini 1.5):**
- ~$0.0015 per request (can vary)
- ~$0.002 per 1K output tokens

**To minimize costs:**
1. Enable caching (`VITE_ENABLE_AI_CACHE=true`)
2. Monitor usage: Cloud Console → Billing
3. Set quotas to prevent runaway costs
4. Use only for authenticated users (optional)

---

## 🔒 Security Best Practices

1. ✅ Never commit `service-account-key.json`
2. ✅ Add to `.gitignore`:
   ```
   config/gcp/
   .env.local
   ```
3. ✅ Use IAM roles with minimal permissions
4. ✅ Rotate service account keys regularly
5. ✅ Monitor API usage in Cloud Console

---

## 📱 Features Now Enabled

### Guest User (3-message limit)
- ✅ Gets AI responses for limited messages
- ✅ After 3 messages: sees "Sign In" warning
- ✅ Messages use Vertex AI for intelligence

### Authenticated User (Unlimited)
- ✅ Unlimited AI-powered chat
- ✅ Full semantic understanding
- ✅ Personalized recommendations
- ✅ Conversation history maintained

### Logout Detection
- ✅ Returns to 3-message limit
- ✅ Messages preserved in localStorage
- ✅ Can resume on next login

---

## 🧪 Testing Scenarios

### Scenario 1: Restaurant Search
```
User: "I want Italian food near Colombo for a date"
Vertex AI: Understands cuisine, location, occasion
Response: Personalized Italian restaurants with romantic ambiance
```

### Scenario 2: Budget-Conscious
```
User: "Cheap places to eat with family?"
Vertex AI: Identifies budget constraint, family occasion
Response: Budget-friendly family restaurants
```

### Scenario 3: Special Occasion
```
User: "Book a table for 6 for my anniversary at a nice place"
Vertex AI: Recognizes party size (6), occasion (anniversary), preference (nice)
Response: Upscale restaurants, offers booking help
```

---

## 🚀 Next Steps

1. ✅ Configure Google Cloud credentials
2. ✅ Test chat functionality
3. ✅ Monitor costs on Google Cloud Console
4. ✅ Gather user feedback
5. ✅ Optimize prompts based on usage
6. ✅ Add analytics for popular queries

---

## 📚 Additional Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [LangChain Google Vertex AI](https://js.langchain.com/docs/modules/model_io/models/llm/integrations/vertex)
- [Gemini Models](https://ai.google.dev/models/gemini)
- [Google Cloud Best Practices](https://cloud.google.com/docs/best-practices)

---

## 🆘 Troubleshooting

### Issue: "GOOGLE_CLOUD_PROJECT_ID not found"
**Solution:** Check `.env.local` has correct value
```bash
cat .env.local | grep PROJECT_ID
```

### Issue: "Permission denied" errors
**Solution:** Verify service account has required roles:
- Vertex AI Service Agent
- Vertex AI User
- Editor (for development)

### Issue: "Model not found"
**Solution:** Ensure Vertex AI API is enabled in Cloud Console

### Issue: Responses are taking too long
**Solution:** Check network connectivity and API rate limits

---

## ✨ What Customers See

**In Chat Widget:**
- Natural, contextual responses instead of keyword matching
- Understanding of preferences, budget, location
- Personalized recommendations
- Smooth, intelligent conversation flow

**In Analytics:**
- User intent tracked
- Popular cuisines identified
- Location-based insights
- Conversion optimization data

---

## 📞 Support

For issues or questions:
1. Check VERTEX_AI_SETUP.md
2. Review Google Cloud Console logs
3. Check API endpoint with curl
4. Review error messages in browser console

Happy chatting! 🎉
