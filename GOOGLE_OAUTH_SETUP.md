# Google OAuth Integration Guide

## Overview
This guide explains how to set up Google OAuth 2.0 authentication for DineBot.

## Architecture
DineBot uses the OAuth 2.0 Authorization Code Flow with Firebase:
1. User clicks "Sign in with Google" button
2. Redirects to Google's consent screen
3. User authorizes the app
4. Google redirects back with authorization code + ID token
5. Frontend extracts ID token from URL
6. Frontend sends ID token to Firebase Authentication REST API
7. Firebase exchanges it for a session token
8. User is logged in

## Step 1: Set Up Google Cloud Project

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" at the top
3. Click "NEW PROJECT"
4. Enter project name: `DineBot` (or your preference)
5. Click "CREATE"
6. Wait for project creation (may take a few minutes)

### 1.2 Enable Google+ API
1. In the Google Cloud Console, search for "Google+ API"
2. Click on it and select "Enable"
3. Wait for the API to be enabled

### 1.3 Create OAuth 2.0 Client ID
1. In the left sidebar, go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. If prompted, first configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields:
     - **App name**: DineBot
     - **User support email**: your-email@gmail.com
     - **Developer contact info**: your-email@gmail.com
   - Click "Save and Continue"
   - Add scopes: openid, email, profile
   - Click "Save and Continue"
   - Add test users (your Gmail account)
   - Click "Save and Continue"

4. Now create OAuth 2.0 Client ID:
   - **Application type**: Web application
   - **Name**: DineBot Web
   - **Authorized JavaScript origins** (add all):
     - http://localhost:3000
     - http://localhost:3001
     - http://127.0.0.1:3000
     - Your production domain (e.g., https://dinebot.com)
   - **Authorized redirect URIs** (add all):
     - http://localhost:3000/auth/google-callback
     - http://localhost:3001/auth/google-callback
     - http://127.0.0.1:3000/auth/google-callback
     - https://yourproduction.com/auth/google-callback

5. Click "Create"
6. Copy the **Client ID** from the popup (you'll need this)

## Step 2: Configure Environment Variables

### 2.1 Update .env.local
Add your Google Client ID to `apps/web-pwa/.env.local`:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

Replace `your-client-id-here` with the Client ID you copied from Google Cloud.

### Example:
```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

## Step 3: Update Firebase Console Settings

### 3.1 Enable Google Authentication in Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `agentic-restaurant-chatbot`
3. In the left sidebar, go to **Authentication**
4. Click on "Sign-in method" tab
5. Click "Google" and enable it
6. Select your project from the "Web SDK configuration"
7. Click "Save"

## Step 4: Verify Implementation

### 4.1 Code Changes Made
The following changes have been made to enable Google OAuth:

**firebaseService.ts:**
- Added `signInWithGoogle(idToken)` function
- Added `initializeGoogleAuth()` function to generate OAuth URL
- Handles token exchange with Firebase

**AuthContext.tsx:**
- Added `loginWithGoogle(idToken)` method
- Integrated in context provider

**SignIn.tsx:**
- Updated `handleGoogleSignIn()` to redirect to Google OAuth
- Added proper error handling

**GoogleCallback.tsx (NEW):**
- Handles Google OAuth redirect
- Extracts ID token from URL
- Calls `loginWithGoogle()` to complete signin

**Environment:**
- Added `VITE_GOOGLE_CLIENT_ID` to .env.local
- Added TypeScript definitions in vite-env.d.ts

### 4.2 Test the Flow
1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000
3. Click "Sign In" or "Get Started"
4. Click "Sign in with Google" button
5. You'll be redirected to Google's login/consent screen
6. After authorization, you'll be redirected back to the app
7. Check browser console for any errors

## Step 5: Troubleshooting

### Issue: "Redirect URI mismatch"
**Solution:** Add the exact redirect URI to Google Cloud Console credentials:
- Your app redirects to: `http://localhost:3000/auth/google-callback`
- Must be added in Google Console under "Authorized redirect URIs"

### Issue: "Client ID not found"
**Solution:** 
1. Verify `VITE_GOOGLE_CLIENT_ID` is in `.env.local`
2. Restart the dev server after adding the variable
3. Check that the Client ID format is correct: `xxx-yyy.apps.googleusercontent.com`

### Issue: "Google button doesn't redirect"
**Solution:**
1. Check browser console for errors (F12 → Console tab)
2. Verify Google Cloud OAuth 2.0 Client ID is created
3. Ensure JavaScript origins are configured in Google Cloud

### Issue: "Can't get ID token"
**Solution:**
1. Check Google OAuth response type includes `id_token`
2. Verify `scope=openid email profile` is in the OAuth URL
3. Ensure user is logged into Google account

## Step 6: Database Setup (Automatic)

When a user signs in with Google, the system automatically:
1. Creates a user profile in Firestore
2. Stores their Google account info (email, display name)
3. Creates a session token for the app
4. Logs them in to DineBot

No additional database setup needed - it's all automatic!

## Step 7: Production Deployment

When deploying to production:

1. **Update Google Cloud Console:**
   - Add your production domain to "Authorized JavaScript origins"
   - Add `https://yourdomain.com/auth/google-callback` to "Authorized redirect URIs"

2. **Update .env.production:**
   ```env
   VITE_GOOGLE_CLIENT_ID=your-same-client-id
   ```

3. **Create separate Client ID (Optional but recommended):**
   - For better security, create a separate OAuth 2.0 Client ID for production
   - Use different Client IDs for dev and production

## Security Notes

✅ **What's secure:**
- ID tokens are short-lived and JWT-signed by Google
- Token exchange happens server-side (Firebase)
- No Client Secret needed for Web auth (implicit flow)
- Tokens stored in localStorage (production should use secure cookies)

⚠️ **Recommended for production:**
- Use HTTPS only
- Implement refresh token rotation
- Store tokens in secure, HttpOnly cookies
- Implement token expiration handling
- Add CSRF protection
- Validate ID token signature server-side

## Files Modified

| File | Changes |
|------|---------|
| `firebaseService.ts` | Added `signInWithGoogle()`, `initializeGoogleAuth()` |
| `AuthContext.tsx` | Added `loginWithGoogle()` method |
| `SignIn.tsx` | Updated `handleGoogleSignIn()` |
| `GoogleCallback.tsx` | NEW - Handles OAuth redirect |
| `.env.local` | Added `VITE_GOOGLE_CLIENT_ID` |
| `vite-env.d.ts` | Added environment variable types |

## Next Steps

1. ✅ Complete Steps 1-3 above
2. Restart dev server
3. Test Google sign-in on http://localhost:3000
4. Once working, implement profile picture upload from Google
5. Add "Link Google Account" feature to UserProfile page

## Support

If you encounter issues:
1. Check browser console (F12 → Console)
2. Check terminal for errors
3. Verify all Google Cloud settings are correct
4. Ensure Client ID is in .env.local
5. Restart dev server after env changes
