/**
 * GOOGLE OAUTH CALLBACK
 * 
 * Handles the redirect from Google OAuth
 * Extracts the ID token and sends to backend for verification
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithGoogle } from '../../services/firebaseService';

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
        // Get token from URL hash
        const hash = window.location.hash.substring(1);
        console.log('📍 GoogleCallback: Processing URL hash');
        console.log('Hash length:', hash.length, 'chars');
        
        if (!hash) {
          throw new Error('No authentication token in URL. Did you authorize the app?');
        }

        // Parse the hash - Google sends: id_token=...&access_token=...&stuff=...
        const params = new URLSearchParams(hash);
        const idToken = params.get('id_token');
        const accessToken = params.get('access_token');
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        
        // Check for Google OAuth errors
        if (error) {
          throw new Error(`Google OAuth denied: ${error}${errorDescription ? ' - ' + errorDescription : ''}`);
        }
        
        console.log('📦 Parsed from hash:', { 
          hasIdToken: !!idToken, 
          hasAccessToken: !!accessToken,
        });

        if (!idToken && !accessToken) {
          throw new Error('No authentication token found in redirect');
        }

        if (!idToken) {
          throw new Error('No ID token found in redirect. Make sure you authorized the app.');
        }

        // Decode the JWT id_token to get user info
        // JWT structure: header.payload.signature
        const parts = idToken.split('.');
        if (parts.length !== 3) {
          throw new Error(`Invalid JWT token format: expected 3 parts, got ${parts.length}`);
        }

        // Decode the payload (base64)
        const payload = parts[1];
        let decoded;
        try {
          // Add padding if needed
          const padding = 4 - (payload.length % 4);
          const paddedPayload = payload + '='.repeat(padding === 4 ? 0 : padding);
          decoded = JSON.parse(atob(paddedPayload));
        } catch (decodeError) {
          throw new Error(`Failed to decode JWT payload: ${decodeError instanceof Error ? decodeError.message : 'Unknown error'}`);
        }
        
        console.log('✅ Decoded JWT:', { email: decoded.email, name: decoded.name });
        
        if (!decoded.email) {
          throw new Error('No email found in Google ID token');
        }
        
        console.log('🔐 Sending token to backend for verification...');
        
        // Send the idToken to our backend which will verify it with Google
        const user = await signInWithGoogle(idToken);
        
        console.log('✅ Backend verified token and created session!');
        
        // Update AuthContext with the user
        if (loginWithGoogle) {
          try {
            await loginWithGoogle(idToken);
          } catch (e) {
            // The authContext might not need explicit login call
            // since firebaseService.ts now notifies of auth state
          }
        }
        
        // Clean up URL hash - remove the token from URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        setStatus('success');
        
        // Notify success after a brief delay to let auth state update
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 1000);
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Google callback error';
        console.error('❌ GoogleCallback Error:', errorMsg, error);
        setErrorMsg(errorMsg);
        setStatus('error');
        
        if (onError) {
          onError(errorMsg);
        }
        
        // Offer to go back after error
        setTimeout(() => {
          const goBack = window.confirm(`Error: ${errorMsg}\n\nGo back and try again?`);
          if (goBack) {
            window.location.href = window.location.origin;
          }
        }, 2000);
      }
    };

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
