#!/usr/bin/env python3
"""Test chat flow end-to-end"""

import requests
import json
import sys

BASE_URL = 'http://localhost:5000'
AI_URL = 'http://localhost:8000'

def test_signup():
    """Sign up and get auth token"""
    print("\n=== STEP 1: SIGNUP ===")
    url = f'{BASE_URL}/api/auth/signup'
    data = {
        'email': 'chattest@example.com',
        'password': 'Test@1234',
        'fullName': 'Chat Tester',
        'phoneNumber': '+94771234567'
    }
    
    try:
        response = requests.post(url, json=data, timeout=10)
        result = response.json()
        
        print(f"Status: {response.status_code}")
        
        if result.get('success'):
            token = result.get('data', {}).get('accessToken')
            user_id = result.get('data', {}).get('user', {}).get('id')
            print(f"✅ Signed up successfully")
            print(f"   User ID: {user_id}")
            print(f"   Token: {token[:50]}...")
            return token, user_id
        else:
            print(f"❌ Signup failed: {result.get('message')}")
            return None, None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None, None

def test_create_conversation(token):
    """Create a new conversation"""
    print("\n=== STEP 2: CREATE CONVERSATION ===")
    url = f'{BASE_URL}/api/chat/conversations'
    headers = {'Authorization': f'Bearer {token}'}
    
    try:
        response = requests.post(url, headers=headers, timeout=10)
        result = response.json()
        
        print(f"Status: {response.status_code}")
        
        if result.get('success'):
            conv_id = result.get('data', {}).get('id')
            print(f"✅ Conversation created")
            print(f"   Conversation ID: {conv_id}")
            return conv_id
        else:
            print(f"❌ Failed: {result.get('message')}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_send_message(token, conv_id):
    """Send a chat message"""
    print("\n=== STEP 3: SEND MESSAGE ===")
    url = f'{BASE_URL}/api/chat/send'
    headers = {'Authorization': f'Bearer {token}'}
    data = {
        'conversationId': conv_id,
        'message': 'Find me Italian restaurants in Colombo for 4 people'
    }
    
    try:
        response = requests.post(url, json=data, headers=headers, timeout=30)
        result = response.json()
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(result, indent=2)[:500]}")
        
        if result.get('success'):
            msg = result.get('data', {}).get('message', {})
            print(f"✅ Message sent successfully")
            print(f"   Content: {msg.get('content', '')[:100]}...")
            return True
        else:
            print(f"❌ Failed: {result.get('message')}")
            return False
    except requests.exceptions.Timeout:
        print("❌ Request timed out (30s) - AI service might be processing")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_ai_service():
    """Test AI service directly"""
    print("\n=== TESTING AI SERVICE ===")
    url = f'{AI_URL}/api/v1/chat'
    data = {
        'message': 'Find me Italian restaurants',
        'user_id': 'test_user'
    }
    
    try:
        response = requests.post(url, json=data, timeout=30)
        result = response.json()
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(result, indent=2)[:500]}")
        
        if response.status_code == 200:
            print("✅ AI Service responding")
            return True
        else:
            print("❌ AI Service error")
            return False
    except requests.exceptions.Timeout:
        print("❌ AI Service timeout (30s)")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    print("🚀 TESTING CHAT FLOW")
    
    # Test AI service first
    if not test_ai_service():
        print("\n⚠️  AI Service might not be ready, continuing anyway...")
    
    # Test authentication
    token, user_id = test_signup()
    if not token:
        print("❌ Cannot proceed without auth token")
        sys.exit(1)
    
    # Test conversation creation
    conv_id = test_create_conversation(token)
    if not conv_id:
        print("❌ Cannot proceed without conversation")
        sys.exit(1)
    
    # Test message sending
    success = test_send_message(token, conv_id)
    
    if success:
        print("\n✅ CHAT FLOW TEST PASSED")
    else:
        print("\n❌ CHAT FLOW TEST FAILED")
