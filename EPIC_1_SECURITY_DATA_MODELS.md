# 🔐 EPIC 1: SECURITY & DATA MODELS

## 1. FRONTEND SECURITY MEASURES

### Password Security

```typescript
/**
 * PASSWORD VALIDATION RULES
 * 
 * Requirements:
 * - Minimum length: 8 characters (current: 6, should upgrade)
 * - Must include: uppercase, lowercase, number, special char (future)
 * - Should NOT contain email or username
 * - Should NOT be common passwords
 * 
 * Implementation:
 */

const validatePassword = (password: string): ValidationResult => {
  const errors = [];

  // Length validation
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  // Future: Strength validation
  if (password.length < 8) {
    return { isValid: false, errors, strength: 'weak' };
  }

  return { isValid: true, errors: [], strength: 'medium' };
};

/**
 * PASSWORD STORAGE (Frontend)
 * 
 * DO NOT:
 * ✗ Store plain passwords in state
 * ✗ Log passwords to console
 * ✗ Send passwords through insecure channels
 * ✗ Store passwords in localStorage
 * 
 * DO:
 * ✓ Send over HTTPS only
 * ✓ Use password input type (masked)
 * ✓ Clear password from state after submission
 * ✓ Use secure JWT tokens for session
 */

// Clear password after submission
const handleSignUp = async () => {
  try {
    await signup(name, email, password);
    // Clear password from memory
    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
  } finally {
    // Always clear
  }
};
```

### Session Management

```typescript
/**
 * JWT TOKEN HANDLING
 * 
 * Storage Strategy:
 * - Store JWT in localStorage for persistence
 * - Store in memory for current session
 * - Include in Authorization header for API calls
 * 
 * Implementation:
 */

interface AuthToken {
  accessToken: string;    // JWT (expires in 24h)
  refreshToken: string;   // Long-lived refresh token (7 days)
  expiresAt: number;      // Unix timestamp
  tokenType: 'Bearer';
}

const setAuthToken = (token: AuthToken) => {
  // Store in localStorage
  localStorage.setItem('authToken', JSON.stringify(token));
  
  // Set Authorization header
  axios.defaults.headers.common['Authorization'] = `Bearer ${token.accessToken}`;
};

const getAuthToken = (): AuthToken | null => {
  const stored = localStorage.getItem('authToken');
  if (!stored) return null;
  
  const token = JSON.parse(stored);
  
  // Check expiry
  if (token.expiresAt < Date.now()) {
    // Token expired, attempt refresh
    return null;
  }
  
  return token;
};

const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  delete axios.defaults.headers.common['Authorization'];
};

/**
 * TOKEN REFRESH MECHANISM
 * 
 * When access token expires:
 * 1. Frontend detects 401 response
 * 2. Sends refresh token to backend
 * 3. Backend validates & issues new access token
 * 4. Frontend retries original request
 * 5. User remains logged in seamlessly
 */

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token?: string) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  response => response,
  error => {
    const { config } = error;
    
    // Token expired
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;
      
      if (!isRefreshing) {
        isRefreshing = true;
        
        // Attempt refresh
        refreshToken()
          .then(({ accessToken }) => {
            setAuthToken({ accessToken, ...authToken });
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            processQueue(null, accessToken);
          })
          .catch(err => {
            processQueue(err, null);
            logout(); // Force logout
          })
          .finally(() => {
            isRefreshing = false;
          });
      }
      
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        config.headers['Authorization'] = `Bearer ${token}`;
        return axios(config);
      });
    }
    
    return Promise.reject(error);
  }
);
```

### Input Validation & Sanitization

```typescript
/**
 * EMAIL VALIDATION
 * 
 * Pattern: Standard RFC 5322 simplified regex
 */
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * PREVENT XSS ATTACKS
 * 
 * - Never use dangerouslySetInnerHTML
 * - Always escape user input
 * - Use libraries like DOMPurify for rich content
 * - React escapes by default in JSX
 */

// Safe: React escapes by default
<div>{userInput}</div>  ✓

// Unsafe: Never do this
<div dangerouslySetInnerHTML={{ __html: userInput }} />  ✗

/**
 * PREVENT SQL INJECTION
 * 
 * Frontend can't prevent (backend responsibility)
 * But: Never build SQL strings with user input
 * Use parameterized queries on backend
 */

/**
 * PREVENT CSRF
 * 
 * - Include CSRF token in state-changing requests
 * - Backend validates token
 * - Token tied to session
 * - Expires after use
 */

const setupCSRFToken = (token: string) => {
  axios.defaults.headers.common['X-CSRF-Token'] = token;
};
```

### Data Protection in Transit

```typescript
/**
 * HTTPS ENFORCEMENT
 * 
 * - All API calls must use HTTPS
 * - Disable HTTP in production
 * - Use secure cookies (httpOnly, secure flags)
 * - Implement HSTS headers (backend)
 */

// Development: Allow HTTP
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.restaurantchatbot.com'
  : 'http://localhost:5000';

// Production: Always HTTPS only
if (process.env.NODE_ENV === 'production') {
  if (window.location.protocol !== 'https:') {
    window.location.href = 'https:' + window.location.href.substring(5);
  }
}

/**
 * SECURE COOKIE SETTINGS
 * 
 * HttpOnly: true (prevent XSS access)
 * Secure: true (HTTPS only)
 * SameSite: Strict (prevent CSRF)
 * Max-Age: 24h (access token), 7d (refresh token)
 * 
 * Backend sets, not frontend
 */
```

---

## 2. BACKEND INTEGRATION POINTS

### User Registration Endpoint

```typescript
/**
 * POST /api/v1/auth/signup
 * 
 * Request:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "hashedPassword"
 * }
 * 
 * Response (201):
 * {
 *   "success": true,
 *   "user": {
 *     "id": "uuid",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "preferences": {
 *       "cuisines": [],
 *       "priceRange": "moderate",
 *       "location": ""
 *     }
 *   },
 *   "tokens": {
 *     "accessToken": "jwt...",
 *     "refreshToken": "jwt...",
 *     "expiresIn": 86400
 *   }
 * }
 * 
 * Error (400):
 * {
 *   "success": false,
 *   "error": "Email already registered",
 *   "code": "EMAIL_EXISTS"
 * }
 */
```

### User Login Endpoint

```typescript
/**
 * POST /api/v1/auth/signin
 * 
 * Request:
 * {
 *   "email": "john@example.com",
 *   "password": "hashedPassword",
 *   "rememberMe": true
 * }
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "user": {
 *     "id": "uuid",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "preferences": { ... }
 *   },
 *   "tokens": {
 *     "accessToken": "jwt...",
 *     "refreshToken": "jwt...",
 *     "expiresIn": 86400
 *   }
 * }
 * 
 * Remember me expiry:
 * - If rememberMe: true → refreshToken expires in 30 days
 * - If rememberMe: false → refreshToken expires in 7 days
 */
```

### User Profile Endpoint

```typescript
/**
 * GET /api/v1/users/me
 * Auth: Required (Bearer token)
 * 
 * Response (200):
 * {
 *   "id": "uuid",
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "createdAt": "2024-01-15T10:30:00Z",
 *   "preferences": {
 *     "cuisines": ["Italian", "Thai"],
 *     "priceRange": "moderate",
 *     "location": "New York"
 *   },
 *   "stats": {
 *     "totalBookings": 5,
 *     "totalReviews": 3,
 *     "favoriteCount": 12
 *   }
 * }
 */

/**
 * PUT /api/v1/users/me
 * Auth: Required
 * 
 * Request:
 * {
 *   "name": "John Updated",
 *   "preferences": {
 *     "cuisines": ["Italian", "Thai", "Japanese"],
 *     "priceRange": "expensive",
 *     "location": "Los Angeles"
 *   }
 * }
 * 
 * Response (200): Updated user object
 */
```

### Logout Endpoint

```typescript
/**
 * POST /api/v1/auth/logout
 * Auth: Required
 * 
 * Does:
 * - Invalidates refresh token in DB
 * - Clears user session
 * - Logs logout event
 * 
 * Response (200):
 * { "success": true }
 */
```

### Token Refresh Endpoint

```typescript
/**
 * POST /api/v1/auth/refresh
 * 
 * Request:
 * {
 *   "refreshToken": "jwt..."
 * }
 * 
 * Response (200):
 * {
 *   "accessToken": "new_jwt...",
 *   "expiresIn": 86400
 * }
 * 
 * Error (401):
 * { "error": "Refresh token expired" }
 */
```

---

## 3. USER PROFILE SCHEMA

### Database Schema (Supabase/PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_picture_url VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_number VARCHAR(20),
  
  -- Metadata
  signup_method ENUM('email', 'google', 'facebook') DEFAULT 'email',
  device_info JSONB, -- For multi-device tracking
  
  -- Indexing for performance
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- User Preferences Table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Dining preferences
  cuisine_preferences TEXT[] DEFAULT ARRAY[]::TEXT[],
  price_range ENUM('budget', 'moderate', 'expensive') DEFAULT 'moderate',
  preferred_location VARCHAR(255),
  preferred_neighborhood VARCHAR(255),
  
  -- Dietary restrictions
  dietary_restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
  allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Availability
  preferred_dining_times TEXT[] DEFAULT ARRAY[]::TEXT[],
  party_size_preference INT DEFAULT 2,
  
  -- Communication
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  
  -- Accessibility
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50),
  
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id)
);

-- User Sessions Table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
  access_token_hash VARCHAR(255),
  device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
  browser_info VARCHAR(255),
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token_hash);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

### TypeScript Type Definitions

```typescript
/* ===== USER TYPES ===== */

interface User {
  id: string;                    // UUID
  email: string;                 // Unique, validated
  name: string;                  // Display name
  profilePictureUrl?: string;    // Avatar image
  createdAt: Date;               // Account creation
  updatedAt: Date;               // Last profile update
  lastLoginAt?: Date;            // Last login timestamp
  isActive: boolean;             // Account status
  emailVerified: boolean;        // Email confirmation status
  phoneNumber?: string;          // Optional phone
  signupMethod: 'email' | 'google' | 'facebook';
}

/* ===== USER PREFERENCES ===== */

interface UserPreferences {
  userId: string;
  
  // Dining preferences
  cuisinePreferences: string[];  // ["Italian", "Thai", "Japanese"]
  priceRange: 'budget' | 'moderate' | 'expensive';
  preferredLocation?: string;    // City or neighborhood
  
  // Dietary restrictions
  dietaryRestrictions: string[]; // ["vegetarian", "vegan", "gluten-free"]
  allergies: string[];           // Severe allergies
  
  // Availability
  preferredDiningTimes: string[]; // ["lunch", "dinner"]
  partySizePreference: number;    // Default party size
  
  // Communication
  emailNotifications: boolean;    // Marketing/updates
  smsNotifications: boolean;
  marketingEmails: boolean;
  
  // Accessibility
  language: string;              // 'en', 'es', 'fr', etc
  timezone: string;              // 'America/New_York'
}

/* ===== AUTH CONTEXT ===== */

interface AuthContextType {
  // State
  user: User | null;
  preferences: UserPreferences | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Methods
  login(email: string, password: string): Promise<void>;
  signup(name: string, email: string, password: string): Promise<void>;
  logout(): void;
  refreshToken(): Promise<string>;
  updateProfile(user: Partial<User>): Promise<void>;
  updatePreferences(prefs: Partial<UserPreferences>): Promise<void>;
  resetPassword(email: string): Promise<void>;
}

/* ===== FORM DATA TYPES ===== */

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

/* ===== RESPONSE TYPES ===== */

interface AuthResponse {
  success: boolean;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // seconds
  };
}

interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: Record<string, any>;
}
```

---

## 4. SUPABASE IMPLEMENTATION

### Supabase Authentication Setup

```typescript
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

/**
 * Sign up with email
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  metadata: { name: string }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Sign in with email
 */
export const signInWithEmail = async (
  email: string,
  password: string
) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

/**
 * Get user preferences from database
 */
export const getUserPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (
  userId: string,
  preferences: Partial<UserPreferences>
) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Logout
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
```

---

## 5. PASSWORD RESET FLOW (Secure)

```typescript
/**
 * Step 1: User requests password reset
 * 
 * POST /api/v1/auth/forgot-password
 * {
 *   "email": "user@example.com"
 * }
 * 
 * Backend:
 * - Check if email exists
 * - Generate secure reset token (expires in 1 hour)
 * - Send email with reset link
 * - Store token hash in database
 */

/**
 * Step 2: User clicks link in email
 * 
 * Link: https://app.com/reset-password?token=xyz123
 * 
 * Frontend:
 * - Extract token from URL
 * - Validate token with backend
 * - Show password reset form
 */

/**
 * Step 3: User submits new password
 * 
 * POST /api/v1/auth/reset-password
 * {
 *   "token": "xyz123",
 *   "newPassword": "newPassword123"
 * }
 * 
 * Backend:
 * - Validate token (not expired, not used)
 * - Hash new password
 * - Update user password
 * - Invalidate all existing sessions
 * - Mark token as used
 * - Send confirmation email
 */

// Frontend implementation
const handlePasswordReset = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post('/api/v1/auth/reset-password', {
      token,
      newPassword,
    });

    // Success
    toast.success('Password reset successfully');
    navigate('/auth/signin');
  } catch (error) {
    toast.error('Reset failed: ' + error.message);
  }
};
```

---

## 6. SECURITY CHECKLIST

- ✅ HTTPS enforced in production
- ✅ Password hashed with bcrypt (backend)
- ✅ JWT tokens with expiration
- ✅ Refresh token rotation
- ✅ CSRF protection
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (React escaping)
- ✅ Secure cookie settings
- ✅ Rate limiting on auth endpoints
- ✅ Multi-device session tracking
- ✅ Email verification for new accounts
- ✅ Activity logging & audit trails
- ✅ Encryption of sensitive data in transit
- ✅ Regular security audits

This security implementation ensures user data is protected throughout their journey! 🔒
