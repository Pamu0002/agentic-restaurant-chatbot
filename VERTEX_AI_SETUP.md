# Vertex AI Integration Setup Guide

This guide will help you set up Google Vertex AI (Gemini 1.5) integration with your restaurant chatbot.

## Prerequisites

- Google Cloud account with billing enabled (pamukavinshaa@gmail.com)
- Active Google Cloud project
- gcloud CLI installed locally

---

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click on project dropdown at the top
   - Click "NEW PROJECT"
   - Name: `agentic-restaurant-chatbot`
   - Click "CREATE"

3. Wait for project creation (1-2 minutes)
4. Select the newly created project

---

## Step 2: Enable Required APIs

1. In Cloud Console, go to **APIs & Services** → **Library**
2. Search and enable these APIs:
   - **Vertex AI API**
   - **Cloud Resource Manager API**
   - **Service Usage API**

For each API:
- Click on it
- Click "ENABLE"
- Wait for activation (takes 1-2 minutes)

---

## Step 3: Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click "CREATE CREDENTIALS" → "Service Account"
3. Fill in:
   - Service account name: `agentic-chatbot-sa`
   - Description: "Service account for Vertex AI access"
   - Click "CREATE AND CONTINUE"

4. Grant roles:
   - Click "CONTINUE" (skip optional steps)
   - Click "DONE"

5. Now create a key for this service account:
   - In Credentials page, find the service account you just created
   - Click on it
   - Go to "KEYS" tab
   - Click "ADD KEY" → "Create new key"
   - Choose "JSON"
   - Click "CREATE"
   - A JSON file will download automatically

---

## Step 4: Set Up Local Environment

1. Save the downloaded JSON key to your project:

```bash
# Create credentials directory
mkdir -p c:\Users\Pamudi\Desktop\fyp\agentic-restaurant-chatbot\config\gcp

# Copy the downloaded JSON file here and rename it
# (You'll need to manually copy the file or use the terminal)
```

2. Create `.env` file in project root:

```bash
cd c:\Users\Pamudi\Desktop\fyp\agentic-restaurant-chatbot
```

3. Create/update `.env.local` with:

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
VERTEX_AI_LOCATION=us-central1

# Google Application Credentials
GOOGLE_APPLICATION_CREDENTIALS=./config/gcp/service-account-key.json

# Vertex AI Configuration
VERTEX_AI_MODEL=gemini-1.5-pro
VERTEX_AI_TEMPERATURE=0.7
VERTEX_AI_MAX_TOKENS=1024
```

4. Replace `your-project-id-here` with your actual Google Cloud Project ID

---

## Step 5: Find Your Project ID

1. In Google Cloud Console, go to **Home**
2. Look for "Project ID" on the dashboard
3. Copy it and paste into `.env.local`

Example Project ID: `agentic-restaurant-chatbot-123456`

---

## Step 6: Verify Service Account Permissions

1. Go to **IAM & Admin** → **IAM**
2. Find your service account (`agentic-chatbot-sa@project-id.iam.gserviceaccount.com`)
3. Ensure it has these roles:
   - ✅ Vertex AI Service Agent
   - ✅ Vertex AI User
   - ✅ Editor (for testing, can be restricted later)

If not, click "EDIT" and add these roles.

---

## Step 7: Test the Integration

1. Install gcloud CLI (if not already installed):
```bash
# Download from: https://cloud.google.com/sdk/docs/install
```

2. Authenticate locally:
```bash
gcloud auth application-default login
```

3. Set your project:
```bash
gcloud config set project your-project-id-here
```

4. Test API availability:
```bash
gcloud services list --enabled | find "vertexai"
```

---

## Step 8: Start API Server

```bash
cd c:\Users\Pamudi\Desktop\fyp\agentic-restaurant-chatbot

# Start the API
pnpm api:dev
```

---

## Step 9: Test Chat Endpoint

Make a POST request to test the integration:

```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Find me a good Italian restaurant in Colombo with budget-friendly options"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Here are some great Italian restaurants in Colombo...",
  "metadata": {
    "model": "gemini-1.5-pro"
  }
}
```

---

## Available Endpoints

### 1. Chat with AI
```
POST /api/ai/chat
Body: { "message": "Your message here" }
```

### 2. Analyze Intent
```
POST /api/ai/analyze-intent
Body: { "message": "Find Italian restaurants near me" }
```

### 3. Get Recommendations
```
POST /api/ai/recommendations
Body: {
  "preferences": {
    "cuisine": "Italian",
    "budget": "medium",
    "location": "Colombo",
    "occasion": "dinner"
  }
}
```

### 4. Clear Conversation History
```
POST /api/ai/clear-history
```

---

## Troubleshooting

### Error: "GOOGLE_CLOUD_PROJECT_ID not found"
- ✅ Check `.env.local` has correct PROJECT_ID
- ✅ Verify `.env.local` is in project root

### Error: "Permission denied - Vertex AI"
- ✅ Ensure service account has "Vertex AI User" role
- ✅ Check API is enabled in Google Cloud Console
- ✅ Wait 5 minutes after enabling APIs (propagation delay)

### Error: "Service account key not found"
- ✅ Verify JSON key is in `config/gcp/` directory
- ✅ Check `GOOGLE_APPLICATION_CREDENTIALS` path is correct

### Error: "Unable to authenticate"
- ✅ Run `gcloud auth application-default login`
- ✅ Set project: `gcloud config set project your-project-id`

---

## Billing Alert

⚠️ **Important:** Vertex AI calls cost money (~$0.0015 per request for Gemini 1.5)

To prevent unexpected charges:
1. Set up billing alerts in Google Cloud Console
2. Enable API usage quotas/limits
3. Monitor usage in **Billing** → **Reports**

---

## Next Steps

After setup is complete:
1. ✅ Update FloatingChatWidget to call new endpoints
2. ✅ Integrate intent analysis for better recommendations
3. ✅ Add conversation context tracking
4. ✅ Implement response caching to reduce costs

---

## Support

If you encounter issues:
1. Check Google Cloud Console for errors
2. Review service account permissions
3. Verify `.env.local` configuration
4. Check API logs in Cloud Console → **Logs**

