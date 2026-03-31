# 🔐 Google Sign-In Without Firebase - Architecture Recommendation

## Firebase Limitations You're Hitting ❌

1. **Rate Limiting** - `TOO_MANY_ATTEMPTS_TRY_LATER` errors
2. **Quota Issues** - Free tier very restrictive
3. **Complex API** - Multiple endpoints for different auth types
4. **No Direct JWT Validation** - Have to use their REST APIs
5. **Expensive at Scale** - Pay per authentication after free tier
6. **Vendor Lock-in** - Hard to migrate away
7. **Limited Control** - Can't customize auth flow easily

---

## ✅ Recommended Solutions

### **Option 1: Direct Google OAuth 2.0 + Custom Backend (RECOMMENDED)**

**Best for:** Your stack (React + React Native + Node.js API)

#### Architecture
```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│  Web/Mobile     │         │  Google OAuth    │         │  Your API    │
│  (Client)       │────────▶│  (Server)        │────────▶│  (Node.js)   │
└─────────────────┘         └──────────────────┘         └──────────────┘
                                    │
                                    ▼
                            ┌──────────────────┐
                            │  Database        │
                            │  (User + Sessions)
                            └──────────────────┘
```

#### Flow
```
1. User clicks "Sign in with Google"
2. Google returns: id_token (JWT) + access_token
3. Client sends id_token to YOUR API
4. API validates JWT with Google's public keys (NO Firebase!)
5. API creates user in your database
6. API returns custom JWT or session token
7. Client stores token, uses for future requests
```

#### Pros
- ✅ No Firebase rate limiting
- ✅ Full control over auth logic
- ✅ Can customize user data
- ✅ No vendor lock-in
- ✅ Scales infinitely
- ✅ Works for web + mobile + backend
- ✅ Cost: just database + server

#### Cons
- ⚠️ More code to write (but doable)
- ⚠️ You manage user sessions
- ⚠️ You handle security

---

### **Option 2: Supabase (Firebase Alternative)**

**Best for:** Quick implementation, needs database

#### What is Supabase?
- Open-source Firebase alternative
- PostgreSQL database included
- Built-in auth with Google integration
- Real-time capabilities
- Much better Google auth handling than Firebase

#### Architecture
```
Web/Mobile ──▶ Supabase Auth ──▶ Supabase PostgreSQL
                 (Google OAuth)
```

#### Pros
- ✅ Drop-in Firebase replacement
- ✅ Better Google OAuth handling
- ✅ Very generous free tier
- ✅ Open source (self-hostable)
- ✅ Includes database
- ✅ JWT-based (easy to validate)

#### Cons
- ⚠️ Another third-party (but easier to migrate from)
- ⚠️ Different API than Firebase

---

### **Option 3: Auth0**

**Best for:** Enterprise-grade auth

#### Pros
- ✅ Professional auth platform
- ✅ Handles all complexity
- ✅ Mobile SDKs included
- ✅ No rate limiting issues
- ✅ Better support

#### Cons
- ❌ Most expensive option
- ❌ Overkill for startup
- ❌ Vendor lock-in

---

## 🚀 My Recommendation: **Option 1 (Direct Google OAuth)**

### Why?
1. **Complete Control** - You own the auth logic
2. **No Surprises** - No rate limits, no quota issues
3. **Cost** - Only pay for database + server (which you have)
4. **Learning** - Understand how auth works
5. **Scalability** - Works from day 1 to enterprise

---

## 🛠️ Implementation Plan: Direct Google OAuth

### Step 1: Update Google Cloud Console
```
No changes needed - you already have:
- Google OAuth Client ID
- Authorized redirect URIs configured
```

### Step 2: Web App Changes
```typescript
// packages/@restaurant/web/src/services/googleAuthService.ts

export async function initiateGoogleSignIn() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const redirectUri = `${window.location.origin}/auth/callback`
  
  // Redirect to Google
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'id_token token',
    scope: 'openid email profile',
    nonce: generateNonce(),
  })}`
}

export async function handleGoogleCallback(idToken: string) {
  // Send to YOUR API (not Firebase!)
  const response = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  })
  
  const { sessionToken, user } = await response.json()
  
  // Store session
  localStorage.setItem('sessionToken', sessionToken)
  return user
}
```

### Step 3: Backend API Changes
```typescript
// services/api/src/controllers/authController.ts

import jwt from 'jsonwebtoken'
import axios from 'axios'

export async function googleSignIn(idToken: string) {
  // 1. Verify Google's JWT
  const decoded = await verifyGoogleToken(idToken)
  const { email, name, picture, sub: googleId } = decoded
  
  // 2. Check if user exists in YOUR database
  let user = await User.findOne({ email })
  
  if (!user) {
    // 3. Create new user
    user = await User.create({
      googleId,
      email,
      name,
      picture,
    })
  }
  
  // 4. Create YOUR session token
  const sessionToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  
  // 5. Return token + user info
  return { sessionToken, user }
}

// Verify Google's JWT without Firebase
async function verifyGoogleToken(idToken: string) {
  const response = await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  )
  
  if (response.data.aud !== process.env.VITE_GOOGLE_CLIENT_ID) {
    throw new Error('Invalid token audience')
  }
  
  return response.data
}
```

### Step 4: Mobile App (Same Flow)
```typescript
// packages/@restaurant/mobile/src/services/googleAuthService.ts

import * as Google from 'expo-auth-session/providers/google'

export function useGoogleSignIn() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  })
  
  const handleSignIn = async () => {
    const result = await promptAsync()
    
    if (result?.type === 'success') {
      const { id_token } = result.params
      
      // Send to YOUR API (same endpoint!)
      const user = await loginWithGoogle(id_token)
      return user
    }
  }
  
  return { handleSignIn }
}

// Send to same backend endpoint
async function loginWithGoogle(idToken: string) {
  const response = await fetch('https://your-api.com/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  })
  
  return response.json()
}
```

### Step 5: Database Schema
```sql
-- Your database (PostgreSQL recommended)

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  picture VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  token VARCHAR(500),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## 📊 Comparison Table

| Feature | Firebase | Direct OAuth | Supabase | Auth0 |
|---------|----------|--------------|----------|-------|
| **Rate Limiting** | ❌ Issues | ✅ None | ✅ Generous | ✅ None |
| **Cost** | $$$ | $ | $$ | $$$$ |
| **Setup Time** | 1 hour | 3-4 hours | 1.5-2 hours | 2-3 hours |
| **Database** | ❌ Firestore | ✅ Your choice | ✅ PostgreSQL | ❌ No built-in |
| **Control** | Low | ✅ Full | Medium | Low |
| **Mobile Support** | ✅ SDK | ✅ Native | ✅ SDK | ✅ SDK |
| **Scalability** | Quota-based | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| **Vendor Lock-in** | High | ✅ None | Low | High |

---

## 🎯 Migration Steps (From Firebase to Direct OAuth)

### Week 1: Preparation
1. Design new auth database schema
2. Create backend endpoints for Google OAuth
3. Set up JWT signing

### Week 2: Implementation
1. Update web app to use new endpoints
2. Update mobile app
3. Test both flows
4. Keep Firebase running (fallback)

### Week 3: Migration
1. Redirect existing users
2. Convert Firebase users to new database
3. Update AuthContext to use new token

### Week 4: Cleanup
1. Remove Firebase
2. Delete Firebase credentials
3. Close Firebase project

---

## 🔒 Security Checklist

- [ ] Validate Google JWT signature
- [ ] Check token expiration
- [ ] Verify token audience (client ID)
- [ ] HTTPS only for token transmission
- [ ] Rate limit `/api/auth/google` endpoint
- [ ] Secure JWT secret in environment
- [ ] Hash passwords if supporting email/password
- [ ] Use secure HTTP-only cookies for tokens
- [ ] Implement CSRF protection
- [ ] Log auth events

---

## 💻 Code Example (Complete Flow)

### Google Sign-In Endpoint
```typescript
// services/api/src/routes/auth.ts

import express from 'express'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import User from '../models/User'

const router = express.Router()

router.post('/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body
    
    // 1. Verify with Google
    const googleUser = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    )
    
    if (googleUser.data.aud !== process.env.VITE_GOOGLE_CLIENT_ID) {
      return res.status(400).json({ error: 'Invalid token' })
    }
    
    const { email, name, picture, sub: googleId } = googleUser.data
    
    // 2. Find or create user
    let user = await User.findOneAndUpdate(
      { email },
      {
        googleId,
        name,
        picture,
        lastLogin: new Date(),
      },
      { upsert: true, new: true }
    )
    
    // 3. Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // 4. Return
    res.json({
      sessionToken: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
```

---

## 🚀 Final Recommendation

**Use Option 1: Direct Google OAuth**

### Why?
1. ✅ Solves all Firebase rate limiting issues
2. ✅ Full control over your auth
3. ✅ No vendor lock-in
4. ✅ Scales indefinitely
5. ✅ Works for web + mobile + backend
6. ✅ Cost is just your server expense

### Timeline
- **Web app:** 1 day to implement
- **Mobile app:** 0.5 days (reuse backend)
- **Testing:** 1 day
- **Total:** 2-3 days of work

---

## 📚 Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [JWT Verification](https://tools.ietf.org/html/rfc7519)
- [Google Tokeninfo Endpoint](https://developers.google.com/identity/protocols/oauth2/web-server#offline)

---

**Ready to implement this? I can help you migrate away from Firebase!** 🚀
