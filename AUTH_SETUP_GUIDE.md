# 🚀 Sustainable Auth Implementation - Setup Guide

## Overview

Your authentication system is now built with:
- ✅ **PostgreSQL** - Real database (not in-memory)
- ✅ **Bcryptjs** - Secure password hashing
- ✅ **JWT** - Access tokens (15 min) + Refresh tokens (7 days)
- ✅ **Rate Limiting** - Protection against brute force
- ✅ **Audit Logging** - Track all auth events
- ✅ **Session Management** - Revoke tokens anytime

---

## Part 1: Setup PostgreSQL Database

### Option A: Using Docker (Recommended)

```bash
# From project root
docker-compose -f docker-compose.db.yml up -d

# Verify PostgreSQL is running
docker-compose -f docker-compose.db.yml ps

# Access PgAdmin (optional)
# URL: http://localhost:5050
# Email: admin@example.com
# Password: admin
```

### Option B: Local PostgreSQL Installation

```bash
# macOS
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Windows
# Download and install from: https://www.postgresql.org/download/windows/
```

### Verify Connection

```bash
# Connect to database
psql -U postgres -d restaurant_auth -h localhost

# List tables (should be empty, migrations will create them)
\dt

# Exit
\q
```

---

## Part 2: Configure Backend Environment

### 1. Create `.env.local` in `services/api/`

```bash
cd services/api
cp .env.example .env.local
```

### 2. Edit `.env.local`

```env
# ============================================
# DATABASE
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_auth
DB_USER=postgres
DB_PASSWORD=postgres

# ============================================
# JWT SECRETS (Generate random strings!)
# ============================================
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# ============================================
# GOOGLE OAUTH
# ============================================
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com

# ============================================
# CORS
# ============================================
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# ============================================
# SERVER
# ============================================  
PORT=5000
NODE_ENV=development
```

### Generate Random Secrets

```bash
# Run this command to generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online: https://randomkeygen.com/
```

---

## Part 3: Install Dependencies & Run Backend

```bash
# Install dependencies
cd services/api
pnpm install

# or npm install (if preferred)
npm install

# Start development server (will auto-create tables)
pnpm dev

# You should see:
# ✅ Database connected
# ✅ All migrations completed successfully
# 🚀 Express API Server Started
# 📡 Listening on http://localhost:5000
```

---

## Part 4: Test Auth Endpoints

### Using cURL or Postman

#### 1. **Signup (Email/Password)**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "displayName": "John Doe",
    "phone": "1234567890"
  }'

# Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "displayName": "John Doe",
      "role": "customer"
    }
  }
}
```

#### 2. **Login**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

#### 3. **Get Profile (Protected)**

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <accessToken>"
```

#### 4. **Refresh Token**

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refreshToken>"
  }'
```

#### 5. **Logout**

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refreshToken>"
  }'
```

---

## Part 5: Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `DineBot`
3. Enable Google+ API
4. Create OAuth 2.0 Web Application
5. Add authorized origins:
   - `http://localhost:5173`
   - `http://localhost:3000`
6. Add authorized redirect URIs:
   - `http://localhost:5173/auth/google-callback`
   - `http://localhost:3000/auth/google-callback`
7. Copy Client ID and add to `.env.local`:

```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

### 2. Test Google OAuth

```bash
# Frontend will handle Google OAuth flow
# Backend will verify token at:
POST /api/auth/google
Body: { "idToken": "..." }
```

---

## Part 6: Database Inspection

### View audit logs

```bash
psql -U postgres -d restaurant_auth

# List all login attempts
SELECT user_id, action, ip_address, created_at 
FROM audit_logs 
WHERE action = 'LOGIN' 
ORDER BY created_at DESC;

# List failed logins
SELECT user_id, action, created_at 
FROM audit_logs 
WHERE action = 'LOGIN_FAILED' 
ORDER BY created_at DESC;

# View active sessions
SELECT user_id, device_info, created_at, expires_at
FROM sessions
WHERE revoked_at IS NULL
ORDER BY created_at DESC;
```

---

## Key Endpoints Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/signup` | POST | ❌ | Register new user |
| `/api/auth/login` | POST | ❌ | Login with email/password |
| `/api/auth/google` | POST | ❌ | Login with Google |
| `/api/auth/refresh` | POST | ❌ | Get new access token |
| `/api/auth/logout` | POST | ✅ | Logout (revoke token) |
| `/api/auth/logout-all` | POST | ✅ | Logout all devices |
| `/api/auth/profile` | GET | ✅ | Get user profile |
| `/api/auth/profile` | PUT | ✅ | Update profile |
| `/api/auth/change-password` | POST | ✅ | Change password |
| `/api/auth/status` | GET | ✅ | Check auth status |

---

## Security Features

✅ Rate limiting (5 login attempts per 15 min)  
✅ Password hashing (bcryptjs, 12 rounds)  
✅ JWT with expiry (access: 15 min, refresh: 7 days)  
✅ Refresh token rotation and revocation  
✅ Secure HttpOnly cookies  
✅ Audit logging for all actions  
✅ IP address & user agent tracking  
✅ Email/password validation  

---

## Troubleshooting

### "Database connection refused"
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.db.yml ps

# Start if not running
docker-compose -f docker-compose.db.yml up -d
```

### "Port 5432 already in use"
```bash
# Use different port in .env.local
DB_PORT=5433

# Or kill existing process
lsof -ti:5432 | xargs kill -9
```

### "GOOGLE_CLIENT_ID not configured"
```bash
# Add to .env.local
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

### "Invalid refresh token"
```bash
# Refresh tokens are stored hashed in DB
# They can't be reused after logout (revoked)
# User needs to login again
```

---

## Next Steps

1. ✅ Test all endpoints with Postman collection
2. ✅ Integrate frontend with AuthContext
3. ✅ Set up email verification
4. ✅ Add password reset flow
5. ✅ Create comprehensive tests
6. ✅ Deploy to production

---

## Support

For issues or questions:
1. Check error logs: `docker-compose -f docker-compose.db.yml logs postgres`
2. Test database connection: `psql -U postgres -d restaurant_auth`
3. Review audit logs: `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;`
