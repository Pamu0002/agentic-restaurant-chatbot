#!/bin/bash

# ============================================
# TEST CHAT BACKEND ENDPOINTS
# ============================================

API_URL="http://localhost:5000"

# Step 1: Get user auth token from test user
echo "🔐 Step 1: Getting authentication token..."
AUTH_RESPONSE=$(curl -s -X POST $API_URL/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@12345"
  }')

TOKEN=$(echo $AUTH_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "✅ Token: ${TOKEN:0:50}..."

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token. Make sure test user exists."
  echo "Response: $AUTH_RESPONSE"
  exit 1
fi

# Step 2: Send a chat message (new conversation)
echo ""
echo "💬 Step 2: Sending first chat message..."
CHAT_RESPONSE=$(curl -s -X POST $API_URL/api/chat/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Find me pizza restaurants"
  }')

echo "Response:"
echo $CHAT_RESPONSE | jq '.'

CONV_ID=$(echo $CHAT_RESPONSE | grep -o '"conversationId":"[^"]*' | cut -d'"' -f4)
echo "✅ Conversation ID: $CONV_ID"

# Step 3: Send follow-up message (same conversation)
echo ""
echo "💬 Step 3: Sending follow-up message..."
CHAT_RESPONSE2=$(curl -s -X POST $API_URL/api/chat/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"What about seafood?\",
    \"conversationId\": \"$CONV_ID\"
  }")

echo "Response:"
echo $CHAT_RESPONSE2 | jq '.'

# Step 4: Get conversation history
echo ""
echo "📋 Step 4: Getting conversation history..."
HISTORY_RESPONSE=$(curl -s -X GET "$API_URL/api/chat/conversations/$CONV_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo $HISTORY_RESPONSE | jq '.'

echo ""
echo "✅ All tests completed!"
