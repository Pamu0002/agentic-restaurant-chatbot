# Authentication Setup Guide - Firestore

> **Database**: Firestore (Firebase Cloud Firestore)  
> **Architecture**: Production-grade JWT + Bcryptjs + Google OAuth  
> **Framework**: Express.js + TypeScript

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Firebase Setup](#firebase-setup)
- [Environment Configuration](#environment-configuration)
- [Database Collections](#database-collections)
- [Running the Service](#running-the-service)
- [Testing Endpoints](#testing-endpoints)
- [Architecture Overview](#architecture-overview)
- [Security Features](#security-features)

---

## Prerequisites

- Node.js 18+ and npm/pnpm
- Firebase project created (Google Cloud Platform)
- Google OAuth credentials (for OAuth endpoints)
- Postman or cURL for testing endpoints

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create a new project**
3. Enter project name: `restaurant-chatbot` (or your preferred name)
4. Follow the setup wizard
5. Enable Firestore Database (NoSQL choice)

### Step 2: Create Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click **Create database**
3. Select region (closest to your users)
4. Choose **Start in Production mode** (we'll add security rules)
5. Database will be created (collections auto-create on first write)

### Step 3: Generate Service Account Key

1. Go to **Project Settings** (gear icon)
2. Click **Service Accounts** tab
3. Click **Generate New Private Key**
4. Save the JSON file as `serviceAccountKey.json` in your project root

### Step 4: Add Google OAuth Credentials

1. In Firebase Console, go to **Build → Authentication**
2. Click **Set up sign-in method**
3. Enable **Google** provider
4. Add your app's OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth consent screen
   - Create OAuth 2.0 credentials (Web application)
   - Copy **Client ID** and **Client Secret**
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (dev)
   - `http://localhost:3000` (frontend)
   - Your production URLs

---

## Environment Configuration

### Step 1: Copy Environment Variables

```bash
cd services/api
cp .env.example .env.local
```

### Step 2: Fill in .env.local

**Option 1: Using Service Account File Path (Recommended)**

```env
# Server
NODE_ENV=development
PORT=5000

# Firebase (using file path)
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

# JWT Secrets (Generate 32+ character random strings)
JWT_ACCESS_SECRET=your_random_64_char_access_secret_here_change_in_prod
JWT_REFRESH_SECRET=your_random_64_char_refresh_secret_here_change_in_prod

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET

# CORS & Frontend
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
FRONTEND_URL=http://localhost:3000
VITE_API_URL=http://localhost:5000/api
```

**Option 2: Using Individual Environment Variables**

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEv...==\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-@appspot.gserviceaccount.com
```

### Step 3: Place Service Account Key

```bash
# Copy your downloaded serviceAccountKey.json
cp /path/to/serviceAccountKey.json ./serviceAccountKey.json

# Add to .gitignore (already done)
echo "serviceAccountKey.json" >> .gitignore
```

---

## Database Collections

The authentication system uses three Firestore collections:

### 1. `users` Collection

Stores user accounts and authentication info.

```typescript
// Document ID: UUID
{
  email: "user@example.com",                    // Indexed, unique per app
  passwordHash: "$2b$12/...",                   // bcryptjs hash (email auth only)
  displayName: "John Doe",
  phone: "+1234567890" | null,
  authProvider: "email" | "google",             // Auth method used
  googleId: "google_user_id" | null,            // For Google OAuth
  role: "customer" | "owner" | "admin",         // Default: "customer"
  isEmailVerified: false,                       // Email verification status
  isActive: true,                               // Soft delete flag
  preferences: { cuisine: [], priceRange: "" }, // User preferences
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLoginAt: Timestamp | null
}
```

**Indexes needed:**
- `email` (ascending, unique)
- `googleId` (ascending, unique)
- `createdAt` (descending)

### 2. `sessions` Collection

Stores active refresh tokens for session management.

```typescript
// Document ID: UUID
{
  userId: "user_uuid",                          // FK to users, indexed
  refreshTokenHash: "sha256_hash_of_token",     // Indexed
  deviceInfo: "Chrome/Windows 10" | null,       // Device information
  ipAddress: "192.168.1.1" | null,              // IP for security
  expiresAt: Timestamp,                         // Indexed for cleanup
  createdAt: Timestamp,
  revokedAt: Timestamp | null                   // Null = active, set = revoked
}
```

**Indexes needed:**
- `userId, expiresAt` (compound)
- `refreshTokenHash` (ascending)
- `expiresAt` (ascending) - for cleanup queries

### 3. `audit_logs` Collection

Tracks all authentication actions for security & debugging.

```typescript
// Document ID: UUID
{
  userId: "user_uuid" | null,                   // FK to users, indexed
  action: "SIGNUP" | "LOGIN" | "LOGOUT" | ...,  // Action type
  resource: "users" | "sessions" | null,        // Resource affected
  changes: { displayName: "Old → New", ... },   // What changed
  ipAddress: "192.168.1.1" | null,              // Requester IP
  userAgent: "Mozilla/5.0 ...",                 // Browser info
  createdAt: Timestamp                          // Indexed
}
```

**Indexes needed:**
- `userId, createdAt` (compound)
- `action` (ascending)
- `createdAt` (descending)

### Setting Up Firestore Indexes

In Firebase Console → Firestore Database → Indexes:

1. Click **Composite indexes**
2. Follow UI prompts to create the indexes above, or
3. Firestore will auto-create indexes as needed

> **Note**: Firestore collections auto-create on first write. You don't need to manually create collections.

---

## Running the Service

### Step 1: Install Dependencies

```bash
cd services/api
pnpm install
# or
npm install
```

### Step 2: Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Expected output:
```
✅ Firestore initialized
📋 Collections ready (auto-created on first write):
   - users: User profiles & auth
   - sessions: Refresh tokens & device tracking
   - audit_logs: Login/signup/profile actions
🚀 Server running on http://localhost:5000
```

### Step 3: Build for Production

```bash
pnpm build
pnpm start
```

---

## Testing Endpoints

### 1. Sign Up (Email/Password)

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!@",
    "displayName": "John Doe",
    "phone": "+1234567890"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "customer"
  }
}
```

### 2. Login (Email/Password)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!@"
  }'
```

### 3. Google OAuth

```bash
# Get Google ID Token from your frontend, then:
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "eyJhbGciOiJSUzI1NiIs..."
  }'
```

### 4. Refresh Access Token

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

### 5. Get User Profile

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### 6. Update Profile

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "John Smith",
    "phone": "+9876543210"
  }'
```

### 7. Change Password

```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "SecurePass123!@",
    "newPassword": "NewPass456!@#"
  }'
```

### 8. Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

### 9. Logout All Sessions

```bash
curl -X POST http://localhost:5000/api/auth/logout-all \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### 10. Check Auth Status

```bash
curl -X GET http://localhost:5000/api/auth/status \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

---

## Architecture Overview

### Token Strategy

- **Access Token** (15 minutes)
  - Short-lived, contains user info
  - Used for protecting API routes
  - Stored in memory (frontend)
  - Expires after 15 minutes

- **Refresh Token** (7 days)
  - Long-lived, stored hashed in `sessions` collection
  - Used to issue new access tokens
  - Can be revoked individually or all at once
  - Includes device info for security

### Authentication Flow

```
User Registration
├─ Email validation
├─ Password strength check (8+ chars, uppercase, lowercase, number, special)
├─ Bcryptjs hashing (12 rounds)
├─ Firestore user creation
└─ Token generation (access + refresh)

User Login
├─ Email lookup in users collection
├─ Bcryptjs password verification
├─ Session creation (refresh token stored)
├─ Audit log entry
└─ Token generation

Google OAuth
├─ Verify Google ID token with Google
├─ Check if user exists
├─ Create or link user account
├─ Session creation
└─ Token generation
```

### Rate Limiting

```
Login Attempts:     5 attempts per 15 minutes
Password Reset:     3 attempts per hour
General API:        100 requests per 15 minutes
```

---

## Security Features

✅ **Password Security**
- Bcryptjs with 12 salt rounds
- Password strength validation
- Never stored in plain text
- Salted before hashing

✅ **Token Security**
- JWT signed with secrets (change in production!)
- Refresh tokens hashed before storage
- Token rotation on refresh
- Expiration: 15 min (access) / 7 days (refresh)

✅ **Session Management**
- Track refresh token hash in Firestore
- Revoke individual or all sessions
- Detect expired sessions
- Auto-cleanup of expired tokens

✅ **OAuth Security**
- Google token verification
- Nonce validation (optional)
- PKCE flow support (recommended)

✅ **Audit Logging**
- All auth actions logged
- IP address tracking
- User agent capture
- Changes recorded

✅ **Rate Limiting**
- Protect against brute force
- Configurable per endpoint
- Whitelist trusted IPs support

---

## Environment Variables Checklist

- [ ] `FIREBASE_PROJECT_ID` - Set
- [ ] `GOOGLE_APPLICATION_CREDENTIALS` - Set (or inline vars)
- [ ] `JWT_ACCESS_SECRET` - 32+ random characters
- [ ] `JWT_REFRESH_SECRET` - 32+ random characters
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `CORS_ORIGINS` - Frontend URL added
- [ ] `NODE_ENV` - Set to "development" or "production"
- [ ] `PORT` - 5000 (or your preferred port)

---

## Troubleshooting

### "Firestore not initialized"
- Check `GOOGLE_APPLICATION_CREDENTIALS` path
- Verify Firebase project ID is correct
- Test with: `gcloud auth application-default login`

### "Invalid Google token"
- Verify `GOOGLE_CLIENT_ID` matches
- Check token expiration (usually 1 hour)
- Confirm OAuth consent screen is published

### "Collections not found"
- Create first document to auto-create collection
- This is normal Firestore behavior
- Indexes auto-create as needed

### "Rate limit exceeded"
- Adjust `express-rate-limit` config
- Check for distributed IP addresses
- Implement whitelist for trusted IPs

### "Token verification failed"
- Verify JWT secrets match between signup/verify
- Check token expiration
- Ensure token format is `Bearer TOKEN`

---

## Production Deployment

### Before Going Live

1. **Change JWT Secrets**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Generate new 64-char secrets and update `.env.production`

2. **Enable Firestore Security Rules**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{document=**} {
         allow read: if request.auth != null && request.auth.uid == resource.data.userId;
         allow write: if false;
       }
       match /sessions/{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Set Environment to Production**
   ```env
   NODE_ENV=production
   ```

4. **Enable HTTPS**
   - Use SSL/TLS certificates
   - Update `CORS_ORIGINS` to production URLs

5. **Configure Rate Limiting**
   - Adjust limits for production load
   - Whitelist health check endpoints

6. **Setup Monitoring**
   - Enable Cloud Logging
   - Setup Firestore backups
   - Monitor error rates & latency

---

## Next Steps

1. **Frontend Integration** - Connect [AuthContext](packages/@restaurant/shared/src/contexts/AuthContext.tsx)
2. **Testing** - Run unit & integration tests
3. **Documentation** - Update API docs with new structure
4. **Monitoring** - Setup error tracking & analytics

---

**Last Updated**: 2024  
**Database**: Firestore (Firebase Cloud Firestore)  
**Framework**: Express.js + TypeScript  
