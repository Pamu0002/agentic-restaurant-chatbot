# Google OAuth 2.0 Backend Implementation

## Overview

This project now uses **Direct Google OAuth 2.0 with a custom Node.js backend** instead of Firebase. This eliminates rate limiting issues and gives us full control over the authentication flow.

### Architecture

```
Google OAuth Flow:
┌────────────────┐      ┌──────────────┐      ┌─────────────────┐      ┌──────────┐
│   Web/Mobile   │ ───> │   Google     │ ───> │   Frontend      │ ───> │ Backend  │
│   App          │      │   OAuth      │      │   (Extract ID   │      │ (Verify  │
└────────────────┘      │   Server     │      │   Token)        │      │ & Create │
                        └──────────────┘      └─────────────────┘      │ Session) │
                                                                         └──────────┘
                                                                              │
                                                                              ↓
                                                                         (Return Session Token)
```

## Setup Instructions

### 1. Backend Environment Variables

Create a `.env.local` file in `services/api/`:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com

# JWT Configuration (for session tokens)
JWT_SECRET=your_random_secret_key_here_min_32_chars

# Optional: Backend Port
PORT=5000

# Optional: CORS
VITE_FRONTEND_URL=http://localhost:3000
```

### 2. Frontend Environment Variables

Ensure `packages/@restaurant/web/.env.local` has:

```bash
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com

# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

Backend (`services/api/`):
```bash
npm install
# Already includes: cookie-parser, jsonwebtoken, axios
```

Frontend (`packages/@restaurant/web/`):
```bash
npm install
# Already includes: axios
```

## Authentication Flow

### Step 1: User Initiates Google Sign-In

User clicks "Sign in with Google" button, which triggers Google's OAuth consent screen.

### Step 2: Google Returns ID Token

Google redirects to `http://localhost:3000/auth/google-callback` with:
- `id_token`: JWT signed by Google
- `access_token`: Optional access token

### Step 3: Frontend Extracts Token

The GoogleCallback component (`packages/@restaurant/web/src/components/auth/GoogleCallback.tsx`):
1. Extracts the `id_token` from URL hash
2. Decodes it to get user email/name for display
3. Sends `id_token` to backend

### Step 4: Backend Verifies with Google

Backend endpoint: `POST /api/auth/google`

```typescript
// Request
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE..."
}

// Response
{
  "success": true,
  "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user@example.com",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://..."
  }
}
```

**Backend verification process:**
1. Sends `id_token` to Google's tokeninfo endpoint
2. Google verifies the signature and returns claims
3. Checks that `aud` (audience) matches `GOOGLE_CLIENT_ID`
4. Extracts user email, name, picture
5. Creates or updates user in database
6. Generates 7-day session JWT token
7. Stores updated lastLogin timestamp

### Step 5: Frontend Stores Session Token

The `signInWithGoogle()` function in `firebaseService.ts`:
1. Receives `sessionToken` from backend
2. Stores in `localStorage` as `sessionToken`
3. Stores in HTTP-only cookie (via server response)
4. Updates AuthContext with user data
5. Notifies all subscribers via `onAuthStateChange`

### Step 6: Authenticated Requests

For protected endpoints, send session token:

```javascript
// Bearer token in Authorization header
fetch(`${API_URL}/protected-endpoint`, {
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`
  }
})

// OR in cookies (automatic with withCredentials)
fetch(`${API_URL}/protected-endpoint`, {
  credentials: 'include'
})
```

## API Endpoints

### 1. POST `/api/auth/google`
**Verify Google ID Token and Create Session**

```
Request:
{
  "idToken": "eyJhbGciOiJSUzI1NiIs..."
}

Response (200):
{
  "success": true,
  "sessionToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user@example.com",
    "email": "user@example.com", 
    "name": "John Doe",
    "picture": "https://..."
  }
}

Response (400):
{
  "success": false,
  "error": "Invalid token"
}
```

### 2. POST `/api/auth/verify`
**Verify Session Token**

```
Request:
{
  "sessionToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200):
{
  "valid": true,
  "userId": "user@example.com",
  "email": "user@example.com"
}

Response (200):
{
  "valid": false,
  "error": "Token expired"
}
```

### 3. POST `/api/auth/refresh`
**Refresh Expired Session Token**

```
Request:
{
  "sessionToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200):
{
  "success": true,
  "sessionToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 4. GET `/api/auth/status`
**Get Current Auth Status**

```
Response (200):
{
  "authenticated": true,
  "user": {
    "email": "user@example.com"
  }
}
```

## Files Changed

### Backend
- ✅ **NEW** `services/api/src/models/User.ts` - User data model
- ✅ **NEW** `services/api/src/controllers/authController.ts` - OAuth verification logic
- ✅ **NEW** `services/api/src/routes/auth.ts` - Auth endpoints
- ✅ **MODIFIED** `services/api/src/main.ts` - Integrated auth routes
- ✅ **MODIFIED** `services/api/package.json` - Added cookie-parser dependency

### Frontend Shared
- ✅ **REPLACED** `packages/@restaurant/shared/src/services/firebaseService.ts` - Now uses backend API
- ✅ **UPDATED** `packages/@restaurant/shared/src/types/auth.ts` - Updated types for backend responses

### Frontend Web
- ✅ **UPDATED** `packages/@restaurant/web/src/components/auth/GoogleCallback.tsx` - Now calls backend instead of Firebase

### No Changes Needed
- ✅ `packages/@restaurant/shared/src/contexts/AuthContext.tsx` - Still works with updated firebaseService
- ✅ All other auth components continue to work unchanged

## Running the Application

### Terminal 1: Start Backend API
```bash
cd services/api
npm install
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2: Start Frontend
```bash
cd packages/@restaurant/web
npm install
npm run dev
# Runs on http://localhost:3000
```

### Test the Flow
1. Open `http://localhost:3000`
2. Click "Sign in with Google"
3. Authorize the app in Google's dialog
4. You should be redirected to `/auth/google-callback`
5. The backend verifies your token and returns a session
6. You're logged in!

## Key Implementation Details

### Token Generation
- **Google's ID Token**: RSA-256 signed JWT from Google
- **Our Session Token**: HMAC-256 signed JWT generated by our backend
- **Expiration**: 7 days (configurable in authController.ts)

### Security Measures
1. **Token Verification**: We verify Google's signature using Google's public keys
2. **Audience Check**: We validate that the token was issued for our GOOGLE_CLIENT_ID
3. **HTTP-Only Cookies**: Session tokens stored in secure, HTTP-only cookies
4. **HTTPS in Production**: All auth should use HTTPS in production
5. **CORS**: Backend validates origin for cross-origin requests

### Storage (Development vs Production)

**Current (Development):**
- User data stored in-memory (`Map` in User.ts)
- Data is lost on server restart
- Perfect for development/testing

**For Production:**
- Replace User.ts with MongoDB/PostgreSQL queries
- Store sessions in Redis for performance
- Example: `services/api/src/models/User-mongodb.ts.example` (to be created)

## Troubleshooting

### "Google Client ID is not configured"
- Check `.env.local` has `VITE_GOOGLE_CLIENT_ID`
- Verify Google Cloud Console OAuth 2.0 credentials
- Backend needs `GOOGLE_CLIENT_ID` in its `.env.local`

### "Invalid token audience"
- Ensure token's `aud` claim matches your `GOOGLE_CLIENT_ID`
- Check that callback URL matches Google Console redirect URI

### "CORS error"
- Frontend is trying to call backend on different origin
- Set `VITE_API_URL` correctly in frontend `.env.local`
- Backend should have CORS middleware configured

### Token expired
- Session tokens expire after 7 days
- Call `refreshAuthToken()` to get new token
- If refresh fails, user must sign in again

## Next Steps

### Phase 1: ✅ Complete
- [x] Backend auth controller with Google verification
- [x] Auth endpoints (google, verify, refresh, status)
- [x] Frontend service layer using backend
- [x] GoogleCallback component updated
- [x] AuthContext working with new backend

### Phase 2: In Progress
- [ ] End-to-end testing of auth flow
- [ ] Update mobile app (if using shared auth)
- [ ] Production database setup (MongoDB/PostgreSQL)
- [ ] Redis session caching
- [ ] Refresh token rotation

### Phase 3: Enhancement
- [ ] Social auth providers (GitHub, Facebook)
- [ ] Email/password authentication alongside Google
- [ ] Profile update endpoints
- [ ] Preference storage endpoints
- [ ] Logout tracking (token blacklist)

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/openid-connect)
- [Google tokeninfo API](https://oauth2.googleapis.com/tokeninfo)
- [JWT.io - JWT Debugger](https://jwt.io)
- [Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/OAuth_2_Cheat_Sheet.html)
