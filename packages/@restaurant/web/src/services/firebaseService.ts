import axios from 'axios';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// Firebase REST API endpoints
const AUTH_API_URL = 'https://identitytoolkit.googleapis.com/v1/accounts';
const FIRESTORE_API_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

export interface User {
    uid: string;
    email: string;
    displayName?: string;
}

interface AuthResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

let currentUser: User | null = null;
let authToken: string | null = localStorage.getItem('firebaseAuthToken') || null;
let refreshToken: string | null = localStorage.getItem('firebaseRefreshToken') || null;
let authUnsubscribers: Array<(user: User | null) => void> = [];

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
    email: string,
    password: string,
    name: string
): Promise<User> => {
    try {
        console.log('Sign up attempt:', email, name);
        // Create user account using Firebase REST API
        const response = await axios.post<AuthResponse>(
            `${AUTH_API_URL}:signUp?key=${firebaseConfig.apiKey}`,
            {
                email,
                password,
                returnSecureToken: true,
            }
        );

        console.log('Sign up successful, saving profile...');
        const { idToken, refreshToken: newRefreshToken, localId } = response.data;
        authToken = idToken;
        refreshToken = newRefreshToken;

        // Store tokens in localStorage
        localStorage.setItem('firebaseAuthToken', idToken);
        localStorage.setItem('firebaseRefreshToken', newRefreshToken);
        localStorage.setItem('firebaseUid', localId);

        // Create user profile in Firestore
        const user: User = {
            uid: localId,
            email,
            displayName: name,
        };

        await saveUserProfile(user);
        currentUser = user;

        // Notify subscribers
        notifyAuthStateChange(user);

        console.log('Sign up complete:', user);
        return user;
    } catch (error: any) {
        console.error('Sign up error:', error);
        const errorMessage = error.response?.data?.error?.message || error.message || 'Sign up failed';
        console.error('Error message:', errorMessage);
        throw new Error(errorMessage);
    }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<User> => {
    try {
        console.log('Sign in attempt:', email);
        // Sign in user using Firebase REST API
        const response = await axios.post<AuthResponse>(
            `${AUTH_API_URL}:signInWithPassword?key=${firebaseConfig.apiKey}`,
            {
                email,
                password,
                returnSecureToken: true,
            }
        );

        console.log('Sign in successful, getting profile...');
        const { idToken, refreshToken: newRefreshToken, localId } = response.data;
        authToken = idToken;
        refreshToken = newRefreshToken;

        // Store tokens in localStorage
        localStorage.setItem('firebaseAuthToken', idToken);
        localStorage.setItem('firebaseRefreshToken', newRefreshToken);
        localStorage.setItem('firebaseUid', localId);

        // Get user profile from Firestore
        const user = await getUserProfile(localId);
        currentUser = user;

        // Notify subscribers
        notifyAuthStateChange(user);

        console.log('Sign in complete:', user);
        return user;
    } catch (error: any) {
        console.error('Sign in error:', error);
        const errorMessage = error.response?.data?.error?.message || error.message || 'Sign in failed';
        console.error('Error message:', errorMessage);
        throw new Error(errorMessage);
    }
};

/**
 * Sign out user
 */
export const signOutUser = async (): Promise<void> => {
    try {
        // Clear local storage
        localStorage.removeItem('firebaseAuthToken');
        localStorage.removeItem('firebaseRefreshToken');
        localStorage.removeItem('firebaseUid');

        authToken = null;
        refreshToken = null;
        currentUser = null;

        // Notify subscribers
        notifyAuthStateChange(null);
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
};

/**
 * Get current auth token
 */
export const getAuthToken = (): string | null => {
    return authToken;
};

/**
 * Save user profile to Firestore
 */
const saveUserProfile = async (user: User): Promise<void> => {
    try {
        const docPath = `users/${user.uid}`;
        const payload = {
            fields: {
                email: { stringValue: user.email },
                displayName: { stringValue: user.displayName || '' },
                createdAt: { timestampValue: new Date().toISOString() },
                updatedAt: { timestampValue: new Date().toISOString() },
            },
        };

        await axios.patch(
            `${FIRESTORE_API_URL}/${docPath}?key=${firebaseConfig.apiKey}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
    } catch (error) {
        console.error('Error saving user profile:', error);
        // Don't throw - this is non-critical
    }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<User> => {
    try {
        const docPath = `users/${uid}`;
        const response = await axios.get(
            `${FIRESTORE_API_URL}/${docPath}?key=${firebaseConfig.apiKey}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken || ''}`,
                },
            }
        );

        const fields = response.data.fields || {};
        console.log('User profile retrieved:', uid);
        return {
            uid,
            email: fields.email?.stringValue || '',
            displayName: fields.displayName?.stringValue || '',
        };
    } catch (error: any) {
        console.warn('Error getting user profile (may not exist yet):', error.message);
        // If profile doesn't exist, return a basic user object
        // The profile will be created when the user completes their setup
        return {
            uid,
            email: '',
            displayName: '',
        };
    }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid: string, updates: Partial<User>): Promise<void> => {
    try {
        const docPath = `users/${uid}`;
        const fields: any = {};

        if (updates.email) {
            fields.email = { stringValue: updates.email };
        }
        if (updates.displayName) {
            fields.displayName = { stringValue: updates.displayName };
        }

        fields.updatedAt = { timestampValue: new Date().toISOString() };

        const payload = { fields };

        await axios.patch(
            `${FIRESTORE_API_URL}/${docPath}?key=${firebaseConfig.apiKey}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (
    uid: string,
    preferences: Record<string, any>
): Promise<void> => {
    try {
        const docPath = `users/${uid}`;
        const fields: any = {
            preferences: {
                mapValue: {
                    fields: Object.entries(preferences).reduce(
                        (acc, [key, value]) => {
                            acc[key] = { stringValue: String(value) };
                            return acc;
                        },
                        {} as Record<string, any>
                    ),
                },
            },
            updatedAt: { timestampValue: new Date().toISOString() },
        };

        const payload = { fields };

        await axios.patch(
            `${FIRESTORE_API_URL}/${docPath}?key=${firebaseConfig.apiKey}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
    } catch (error) {
        console.error('Error updating user preferences:', error);
        throw error;
    }
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
    // Check if user is already logged in
    const uid = localStorage.getItem('firebaseUid');
    if (uid && authToken) {
        getUserProfile(uid)
            .then((user) => {
                currentUser = user;
                callback(user);
            })
            .catch(() => {
                currentUser = null;
                callback(null);
            });
    } else {
        callback(null);
    }

    // Add callback to subscribers
    authUnsubscribers.push(callback);

    // Return unsubscribe function
    return () => {
        authUnsubscribers = authUnsubscribers.filter((cb) => cb !== callback);
    };
};

/**
 * Notify all subscribers of auth state change
 */
const notifyAuthStateChange = (user: User | null): void => {
    authUnsubscribers.forEach((callback) => {
        callback(user);
    });
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
    return currentUser;
};

/**
 * Sign in with Google access token
 * We'll use the id_token (JWT) to get user info without making an API call
 */
export const signInWithGoogle = async (googleIdToken: string): Promise<User> => {
    try {
        console.log('🔐 Google sign-in: Processing Google ID token...');
        
        // Step 1: Decode Google's JWT to get email
        const parts = googleIdToken.split('.');
        if (parts.length !== 3) throw new Error('Invalid JWT format');
        
        const payload = parts[1];
        const padding = 4 - (payload.length % 4);
        const paddedPayload = payload + '='.repeat(padding === 4 ? 0 : padding);
        const decoded = JSON.parse(atob(paddedPayload));
        
        const googleEmail = decoded.email || '';
        const googleName = decoded.name || googleEmail.split('@')[0] || 'User';
        
        if (!googleEmail) throw new Error('No email in Google token');
        
        console.log(`✅ Google user: ${googleEmail}`);
        
        // Step 2: Exchange Google ID token for Firebase token using signInWithIdp
        console.log('🔑 Exchanging Google token for Firebase token...');
        
        const res = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${firebaseConfig.apiKey}`,
            {
                postBody: `id_token=${googleIdToken}&providerId=google.com`,
                returnSecureToken: true,
            }
        );
        
        const { idToken: fbToken, localId } = res.data;
        
        if (!fbToken || !localId) {
            throw new Error('Firebase did not return token');
        }
        
        authToken = fbToken;
        localStorage.setItem('firebaseAuthToken', fbToken);
        localStorage.setItem('firebaseUid', localId);
        
        const user: User = { 
            uid: localId, 
            email: googleEmail, 
            displayName: googleName 
        };
        
        currentUser = user;
        notifyAuthStateChange(user);
        
        console.log('✅ Google sign-in successful!');
        return user;
        
    } catch (error: any) {
        const msg = error.response?.data?.error?.message || error.message || 'Google sign-in failed';
        console.error('❌ Error:', msg);
        throw new Error(msg);
    }
};

/**
 * Initialize Google OAuth
 */
export const initializeGoogleAuth = (): string => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
    
    if (!googleClientId) {
        throw new Error('Google Client ID is not configured. Check VITE_GOOGLE_CLIENT_ID in .env.local');
    }
    
    // IMPORTANT: This must match your Google Cloud Console authorized redirect URIs
    // In Google Cloud Console, you should have registered: http://localhost:3000/auth/google-callback
    const redirectUri = `${window.location.origin}/auth/google-callback`;
    
    console.log(`🔐 Google OAuth URL Generator:
    Client ID: ${googleClientId}
    Redirect URI: ${redirectUri}
    `);
    
    // Use URLSearchParams for proper encoding
    const params = new URLSearchParams({
        client_id: googleClientId,
        redirect_uri: redirectUri,
        response_type: 'id_token token',
        scope: 'openid email profile',
        nonce: generateNonce(),
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    console.log('Generated Auth URL:', authUrl);
    return authUrl;
};

/**
 * Generate nonce for OAuth security
 */
const generateNonce = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Refresh auth token
 */
export const refreshAuthToken = async (): Promise<string | null> => {
    if (!refreshToken) {
        return null;
    }

    try {
        const response = await axios.post(
            `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
            {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }
        );

        authToken = response.data.id_token;
        refreshToken = response.data.refresh_token;

        if (authToken) localStorage.setItem('firebaseAuthToken', authToken);
        if (refreshToken) localStorage.setItem('firebaseRefreshToken', refreshToken);

        return authToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        // If refresh fails, sign out the user
        await signOutUser();
        return null;
    }
};
