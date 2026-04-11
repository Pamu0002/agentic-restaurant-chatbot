/**
 * GUEST SERVICE
 * 
 * Handles guest user creation and session management
 * Guests can browse restaurants without signing up
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface GuestSession {
  sessionId: string;
  guestId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

interface GuestUser {
  id: string;
  isGuest: true;
  sessionId: string;
  email?: string;
  name?: string;
}

/**
 * Create a guest session
 * Returns a temporary guest user that can chat without authentication
 */
export async function createGuestSession(): Promise<GuestSession> {
  try {
    console.log('🟢 Creating guest session...');
    console.log(`📡 API URL: ${API_BASE_URL}/api/guests/create-session`);
    
    const response = await fetch(`${API_BASE_URL}/api/guests/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
      }),
    });

    console.log(`📊 Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.statusText}`, errorText);
      throw new Error(`Failed to create guest session: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Guest session data received:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create guest session');
    }
    
    const session: GuestSession = {
      sessionId: data.data.sessionId,
      guestId: data.data.guestId,
      token: data.data.token,
      createdAt: new Date(data.data.createdAt),
      expiresAt: new Date(data.data.expiresAt),
    };

    // Store in localStorage
    localStorage.setItem('guestSession', JSON.stringify(session));
    localStorage.setItem('sessionToken', session.token);
    localStorage.setItem('guestId', session.guestId);
    localStorage.setItem('isGuest', 'true');

    console.log('✅ Guest session created:', session.sessionId);
    return session;
  } catch (error) {
    console.error('❌ Error creating guest session:', error);
    throw error;
  }
}

/**
 * Get existing guest session from localStorage
 */
export function getGuestSession(): GuestSession | null {
  try {
    const sessionData = localStorage.getItem('guestSession');
    if (!sessionData) return null;

    const session = JSON.parse(sessionData) as GuestSession;
    
    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      clearGuestSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error retrieving guest session:', error);
    return null;
  }
}

/**
 * Clear guest session from localStorage
 */
export function clearGuestSession(): void {
  localStorage.removeItem('guestSession');
  localStorage.removeItem('sessionToken');
  localStorage.removeItem('guestId');
  localStorage.removeItem('isGuest');
  console.log('🗑️  Guest session cleared');
}

/**
 * Get guest user object
 */
export function getGuestUser(): GuestUser | null {
  const session = getGuestSession();
  if (!session) return null;

  return {
    id: session.guestId,
    isGuest: true,
    sessionId: session.sessionId,
    email: `guest-${session.guestId}@agentdine.local`,
    name: 'Guest User',
  };
}

/**
 * Check if current user is a guest
 */
export function isGuestUser(): boolean {
  return localStorage.getItem('isGuest') === 'true' && !!getGuestSession();
}

/**
 * Get session token (works for both auth users and guests)
 */
export function getSessionToken(): string | null {
  return localStorage.getItem('sessionToken');
}
