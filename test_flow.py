import requests
import json

BASE_URL = 'http://localhost:5000'

# Test signup
print("Testing signup...")
resp = requests.post(f'{BASE_URL}/api/auth/signup', json={
    'email': 'chattest1@example.com',
    'password': 'Test@1234',
    'fullName': 'Test',
    'phoneNumber': '+94771234567'
})

data = resp.json()
print(f"Status: {resp.status_code}")

if data.get('success'):
    token = data['data']['accessToken']
    print(f"✅ Got token: {token[:50]}...")
    
    # Test send message
    print("\nTesting send message...")
    msg_resp = requests.post(
        f'{BASE_URL}/api/chat/send',
        headers={'Authorization': f'Bearer {token}'},
        json={'message': 'Find me Italian restaurants in Colombo'}
    )
    
    msg_data = msg_resp.json()
    print(f"Status: {msg_resp.status_code}")
    print(f"Response: {json.dumps(msg_data, indent=2)[:500]}")
else:
    print(f"❌ Signup failed: {data.get('message')}")
