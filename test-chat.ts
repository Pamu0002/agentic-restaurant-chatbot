/**
 * TEST CHAT BACKEND ENDPOINTS
 * Run: npx ts-node test-chat.ts
 * Or: npm install -g ts-node && ts-node test-chat.ts
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000';

async function main() {
  try {
    console.log('🚀 TESTING CHAT BACKEND ENDPOINTS\n');

    // ============================================
    // Step 1: Authenticate (get token)
    // ============================================
    console.log('🔐 Step 1: Authenticating user...');
    const authResponse = await axios.post(`${API_URL}/api/auth/signin`, {
      email: 'test@example.com',
      password: 'Test@12345',
    });

    const token = authResponse.data.data.accessToken;
    console.log('✅ Got auth token');
    console.log(`   Token: ${token.substring(0, 50)}...\n`);

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // ============================================
    // Step 2: Send first message (new conversation)
    // ============================================
    console.log('💬 Step 2: Sending first message...');
    const msg1Response = await axios.post(
      `${API_URL}/api/chat/send`,
      {
        message: 'Find me pizza restaurants in Colombo',
      },
      { headers }
    );

    const conversationId = msg1Response.data.data.conversationId;
    console.log('✅ Message sent');
    console.log(`   Conversation ID: ${conversationId}`);
    console.log(`   Bot response: ${msg1Response.data.data.message.content.substring(0, 100)}...\n`);

    // ============================================
    // Step 3: Send follow-up message
    // ============================================
    console.log('💬 Step 3: Sending follow-up message...');
    const msg2Response = await axios.post(
      `${API_URL}/api/chat/send`,
      {
        conversationId,
        message: 'What about seafood restaurants near Mount Lavinia?',
      },
      { headers }
    );

    console.log('✅ Follow-up message sent');
    console.log(`   Bot response: ${msg2Response.data.data.message.content.substring(0, 100)}...\n`);

    // ============================================
    // Step 4: Get conversation history
    // ============================================
    console.log('📋 Step 4: Getting conversation history...');
    const historyResponse = await axios.get(
      `${API_URL}/api/chat/conversations/${conversationId}`,
      { headers }
    );

    const messages = historyResponse.data.data.messages;
    console.log(`✅ Retrieved ${messages.length} messages`);
    messages.forEach((msg: any, idx: number) => {
      console.log(`   ${idx + 1}. [${msg.role.toUpperCase()}] ${msg.content.substring(0, 60)}...`);
    });

    console.log('\n✅ ALL TESTS PASSED!');
    console.log('✅ Chat backend is working correctly\n');
  } catch (error: any) {
    console.error('❌ TEST FAILED');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

main();
