/**
 * GOOGLE OAUTH CALLBACK
 * 
 * Handles the redirect from Google OAuth
 * Extracts the ID token and sends to backend for verification
 */

import { signInWithGoogle, useAuth } from '@restaurant/shared';
import { useEffect, useState } from 'react';

interface GoogleCallbackProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GoogleCallback({ onSuccess, onError }: GoogleCallbackProps) {
  const { loginWithGoogle } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('========== GOOGLE CALLBACK STARTED ==========');
        
        // Get token from URL hash
        const hash = window.location.hash.substring(1);
        console.log('📍 Hash from URL:', hash.substring(0, 100) + (hash.length > 100 ? '...' : ''));
        
        if (!hash) {
          throw new Error('No token in URL. Did you authorize the app?');
        }

        // Parse the hash - Google sends: id_token=...&access_token=...&stuff=...
        const params = new URLSearchParams(hash);
        const idToken = params.get('id_token');
        const accessToken = params.get('access_token');
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        
        console.log('📦 Parsed hash params:', { 
          hasIdToken: !!idToken, 
          hasAccessToken: !!accessToken,
          error: error || 'none',
          errorDescription: errorDescription || 'none',
        });
        
        // Check for Google OAuth errors
        if (error) {
          throw new Error(`Google OAuth error: ${error}${errorDescription ? ' - ' + errorDescription : ''}`);
        }

        if (!idToken && !accessToken) {
          throw new Error('No authentication token found in URL');
        }

        if (!idToken) {
          throw new Error('No ID token found. Authorization may have been incomplete.');
        }

        console.log('✅ ID token extracted from URL');
        console.log('Token length:', idToken.length, 'chars');
        
        // Decode the JWT id_token to get user info (for debugging)
        const parts = idToken.split('.');
        if (parts.length !== 3) {
          throw new Error(`Invalid JWT format: expected 3 parts, got ${parts.length}`);
        }

        // Decode the payload for logging
        const payload = parts[1];
        try {
          const padding = 4 - (payload.length % 4);
          const paddedPayload = payload + '='.repeat(padding === 4 ? 0 : padding);
          const decoded = JSON.parse(atob(paddedPayload));
          console.log('✅ JWT Decoded:', { email: decoded.email, name: decoded.name, aud: decoded.aud });
        } catch (e) {
          console.warn('⚠️  Could not decode JWT for logging:', e);
        }
        
        console.log('🔐 Sending token to backend...');
        
        // Send the idToken to our backend which will verify it with Google
        const user = await signInWithGoogle(idToken);
        
        console.log('✅ Backend verified and user created:', user.email);
        console.log('User object:', user);
        
        // Update AuthContext with the user
        if (loginWithGoogle) {
          try {
            console.log('📝 Updating AuthContext...');
            await loginWithGoogle(idToken);
            console.log('✅ AuthContext updated');
          } catch (e) {
            console.warn('⚠️  AuthContext update failed (this may be OK):', e);
            // The authContext might not need explicit login call
            // since firebaseService.ts now notifies of auth state
          }
        }
        
        // Clean up URL hash - remove the token from URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        console.log('✅ URL cleaned');
        console.log('=== WAITING 2 SECONDS FOR AUTH STATE UPDATE ===');
        
        // Wait 2 seconds for auth state to propagate through the context
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('✅ Setting success status');
        setStatus('success');
        
        // Notify success 
        console.log('📍 Calling onSuccess callback');
        if (onSuccess) {
          onSuccess();
        }
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error during Google callback';
        console.error('❌ GoogleCallback Error:', errorMsg);
        console.error('Full error:', error);
        
        setErrorMsg(errorMsg);
        setStatus('error');
        
        if (onError) {
          onError(errorMsg);
        }
        
        // Offer to go back after error
        setTimeout(() => {
          const goBack = window.confirm(`Error: ${errorMsg}\n\nClick OK to go back and try again`);
          if (goBack) {
            window.location.href = window.location.origin;
          }
        }, 2000);
      }
    };

    console.log('🚀 GoogleCallback useEffect triggered');
    handleCallback();
  }, [loginWithGoogle, onSuccess, onError]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'processing' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
            <p style={{ color: '#666' }}>Processing your login...</p>
            <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Please wait while we verify your Google account
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <p style={{ color: '#16A34A' }}>Login successful!</p>
            <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Redirecting to DineBot...
            </p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <p style={{ color: '#DC2626', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Authentication failed</p>
            <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {errorMsg}
            </p>
            <button 
              onClick={() => window.location.href = window.location.origin}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
