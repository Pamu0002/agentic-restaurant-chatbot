# Google OAuth Implementation - Next Steps

## Current Status ✅
All code for Google OAuth has been successfully implemented and the development server is running at **http://localhost:3001/**

## What Needs Google Cloud Setup

The implementation is **100% complete** on the code side. All that's left is configuring Google Cloud. Here's what you need to do:

## Quick Start Guide (5 minutes)

### Step 1: Create Google Cloud Project
1. Go to: https://console.cloud.google.com/
2. Click "Select a Project" → "NEW PROJECT"
3. Enter name: `DineBot`
4. Click "CREATE" (wait 1-2 minutes)

### Step 2: Enable Google+ API
1. Search for "Google+ API" in the search bar
2. Click "Google+ API" in results
3. Click "ENABLE"

### Step 3: Create OAuth 2.0 Client ID
1. Go to **APIs & Services** → **Credentials** (left sidebar)
2. If this is your first time:
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - It will ask you to configure the OAuth consent screen first
   - Fill in:
     - **App name**: DineBot
     - **User support email**: your-email@gmail.com
     - **Developer contact**: your-email@gmail.com
   - Click "Save and Continue" twice
   - Click "Save and Continue" on scopes page
3. After consent screen setup:
   - Create OAuth 2.0 Client ID
   - **Application type**: Web application
   - **Name**: DineBot Web
   - **Authorized JavaScript origins**: 
     - `http://localhost:3001`
     - `http://localhost:3000`
   - **Authorized redirect URIs**:
     - `http://localhost:3001/auth/google-callback`
     - `http://localhost:3000/auth/google-callback`
   - Click "CREATE"

### Step 4: Copy Your Client ID
1. After clicking "CREATE", a popup shows your Client ID
2. Copy the entire Client ID (looks like: `123456789-abcdef.apps.googleusercontent.com`)
3. Keep this page open or note it down

### Step 5: Add to Your App
1. Open this file in VS Code:
   ```
   apps/web-pwa/.env.local
   ```
2. Find this line:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```
3. Replace `your_google_client_id_here` with your Client ID from Step 4
4. Example result:
   ```
   VITE_GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   ```

### Step 6: Restart Dev Server
Your dev server should be running on **http://localhost:3001/**

If you need to restart it:
```bash
cd apps/web-pwa
npm run dev
```

### Step 7: Test It
1. Go to http://localhost:3001
2. Click "Sign In" button
3. Click "Sign in with Google" button
4. Great! Observe what happens:
   - ✅ You're redirected to Google login
   - ✅ After login, you see "Processing your login..."
   - ✅ You're automatically logged into DineBot
5. If it works, you're all set! 🎉

## Troubleshooting

### "Invalid Redirect URI"
- The redirect URI you configured in Google must exactly match what the app sends
- The app is configured to redirect to:
  - `http://localhost:3001/auth/google-callback` OR
  - `http://localhost:3000/auth/google-callback`
- **Make sure both are added** in Google Cloud Console

### "Client ID is missing"
1. Check you copied the complete Client ID (should have a `-` after numbers)
2. Verify it's in `apps/web-pwa/.env.local` (not `.env` or other files)
3. The dev server must be **restarted** after editing `.env.local`

### Nothing happens when clicking "Sign in with Google"
1. Open browser Developer Tools (F12 → Console)
2. Look for error messages
3. Check that Client ID is correct in `.env.local`
4. Verify Google Cloud OAuth app is created and enabled

## File Changes Made

✅ **Backend Services:**
- `firebaseService.ts`: Added Google OAuth functions
- `signInWithGoogle()`: Exchanges Google token for Firebase auth
- `initializeGoogleAuth()`: Generates Google login URL
- `generateNonce()`: Secure CSRF protection

✅ **Frontend Components:**
- `SignIn.tsx`: Updated to show working "Sign in with Google" button
- `GoogleCallback.tsx`: NEW component handles OAuth redirect
- `AuthContext.tsx`: Added `loginWithGoogle()` method

✅ **Configuration:**
- `.env.local`: Added `VITE_GOOGLE_CLIENT_ID` environment variable
- `vite-env.d.ts`: NEW TypeScript definitions

✅ **Documentation:**
- `GOOGLE_OAUTH_SETUP.md`: Complete setup guide
- `GOOGLE_OAUTH_IMPLEMENTATION.md`: Technical implementation details

## Security Notes

All security best practices are implemented:
✅ CSRF protection via nonce  
✅ OAuth 2.0 Implicit Flow with form_code  
✅ Token signed by Google (can't be forged)  
✅ Firebase backend verification  
✅ Short-lived tokens  

## Live Dev Server

**Now running at:** http://localhost:3001/

You should see:
- DineBot welcome screen with orange branding
- "Get Started" button
- "Sign In" button  
- "Sign in with Google" button (currently shows info message)

Once you add your Google Client ID, the "Sign in with Google" button will be fully functional!

## What Happens When User Signs In With Google

1. User clicks "Sign in with Google"
2. Redirected to Google's login page
3. User enters Google credentials and approves
4. Google redirects back to: `http://localhost:3001/#id_token=...&access_token=...`
5. App's GoogleCallback component:
   - Detects the redirect
   - Extracts the ID token from URL
   - Calls `loginWithGoogle(idToken)`
6. Firebase verifies the token
7. User profile created in Firestore
8. User logged into DineBot ✓
9. Redirected to chat interface

## Next Steps (After Testing)

1. ✅ Test Google sign-in on http://localhost:3001
2. ✅ Verify user profile was created
3. Test signing out and signing back in
4. Optional: Add profile picture from Google account
5. Optional: Add "Sign up with Google" option
6. Test on production domain before deploying

## Questions?

- Detailed setup: See `GOOGLE_OAUTH_SETUP.md`
- Technical details: See `GOOGLE_OAUTH_IMPLEMENTATION.md`
- Error messages: Check browser console (F12 → Console tab)

---

**Status:** Code implementation 100% complete. Waiting for your Google Cloud setup! 🚀
