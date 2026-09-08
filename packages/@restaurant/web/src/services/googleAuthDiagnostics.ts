/**
 * Google OAuth Diagnostics
 * 
 * Run this in browser console to debug Google OAuth issues:
 * import { runGoogleAuthDiagnostics } from './googleAuthDiagnostics'
 * runGoogleAuthDiagnostics()
 */

export function runGoogleAuthDiagnostics() {
  console.log('🔍 Google OAuth Diagnostics');
  console.log('============================\n');

  // 1. Check environment variables
  console.log('1️⃣  Environment Variables:');
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  console.log(`   VITE_GOOGLE_CLIENT_ID: ${googleClientId ? '✅ SET' : '❌ MISSING'}`);
  console.log(`   VITE_FIREBASE_API_KEY: ${firebaseApiKey ? '✅ SET' : '❌ MISSING'}`);
  console.log(`   VITE_FIREBASE_PROJECT_ID: ${projectId ? '✅ SET' : '❌ MISSING'}`);

  if (!googleClientId) {
    console.warn('⚠️  Google Client ID is missing! Check your .env.local file.');
  }

  // 2. Check URL configuration
  console.log('\n2️⃣  URL Configuration:');
  const redirectUri = `${window.location.origin}/auth/google-callback`;
  console.log(`   Current origin: ${window.location.origin}`);
  console.log(`   Redirect URI: ${redirectUri}`);
  console.log(`   ⚠️  Make sure this exact URI is registered in Google Cloud Console!`);

  // 3. Generate OAuth URL
  console.log('\n3️⃣  Generated OAuth URL:');
  if (googleClientId) {
    const params = new URLSearchParams();
    params.append('client_id', googleClientId);
    params.append('redirect_uri', redirectUri);
    params.append('response_type', 'id_token token');
    params.append('scope', 'openid email profile');
    params.append('nonce', generateDiagnosticNonce());

    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    console.log(`   ${oauthUrl}`);
    console.log(`   Click to test: ${oauthUrl}`);
  } else {
    console.warn('⚠️  Cannot generate OAuth URL - Client ID missing');
  }

  // 4. Check localStorage
  console.log('\n4️⃣  Local Storage:');
  const authToken = localStorage.getItem('firebaseAuthToken');
  const firebaseUid = localStorage.getItem('firebaseUid');
  console.log(`   firebaseAuthToken: ${authToken ? '✅ SET' : '❌ MISSING'}`);
  console.log(`   firebaseUid: ${firebaseUid ? '✅ SET' : '❌ MISSING'}`);

  // 5. Check session storage for Google callback info
  console.log('\n5️⃣  Session Storage (Google Callback Data):');
  const googleIdToken = sessionStorage.getItem('google_id_token');
  const googleEmail = sessionStorage.getItem('google_email');
  console.log(`   google_id_token: ${googleIdToken ? '✅ SET' : '❌ MISSING'}`);
  console.log(`   google_email: ${googleEmail ? '✅ SET' : '❌ MISSING'}`);
  if (googleEmail) {
    console.log(`   → Email: ${googleEmail}`);
  }

  // 6. Check browser hash for OAuth response
  console.log('\n6️⃣  URL Hash (OAuth Response):');
  const hash = window.location.hash.substring(1);
  if (hash) {
    console.log(`   ✅ Hash detected: ${hash.substring(0, 50)}...`);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    const accessToken = params.get('access_token');
    console.log(`   id_token: ${idToken ? '✅ PRESENT' : '❌ MISSING'}`);
    console.log(`   access_token: ${accessToken ? '✅ PRESENT' : '❌ MISSING'}`);
  } else {
    console.log('   ❌ No hash in URL (expected if not on callback page)');
  }

  console.log('\n✅ Diagnostics Complete!\n');
  console.log('Troubleshooting Tips:');
  console.log('1. Make sure the redirect URI matches in Google Cloud Console');
  console.log('2. Check that Google+ API is enabled in your project');
  console.log('3. Verify the Client ID is correct');
  console.log('4. Try clicking the OAuth URL above to test the flow');
}

/**
 * Generate nonce for diagnostics
 */
function generateDiagnosticNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Test Google OAuth URL directly
 */
export function testGoogleOAuthUrl() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    console.error('❌ Google Client ID not configured!');
    return;
  }

  const redirectUri = `${window.location.origin}/auth/google-callback`;
  const params = new URLSearchParams();
  params.append('client_id', googleClientId);
  params.append('redirect_uri', redirectUri);
  params.append('response_type', 'id_token token');
  params.append('scope', 'openid email profile');
  params.append('nonce', generateDiagnosticNonce());

  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  console.log('🚀 Redirecting to Google OAuth URL...');
  console.log(oauthUrl);
  window.location.href = oauthUrl;
}
