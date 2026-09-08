# 🧪 Running Authentication End-to-End Tests

Complete guide to running, validating, and troubleshooting authentication tests.

## 📌 Quick Commands

### Run All Auth Tests
```bash
# From root directory
pnpm test:auth
```

### Run Specific Tests
```bash
# E2E scenarios
pnpm test:auth:e2e

# Routes integration tests
pnpm test:auth:routes

# Frontend API integration
pnpm test:api:integration

# All backend auth tests
cd services/api && pnpm test -- tests/auth.*.test.ts
```

## 🚀 Full Setup & Execution

### Step 1: Install All Dependencies

```bash
# Install root dependencies
pnpm install

# Install API dependencies
cd services/api
npm install

# Install frontend dependencies
cd ../../packages/@restaurant/web
npm install
```

**Expected Output:**
```
✓ Added 250+ packages to node_modules
✓ Workspace configured correctly
```

### Step 2: Configure Test Environment

Verify `.env.test.local` exists in `services/api/`:

```bash
cat services/api/.env.test.local
```

Expected content:
```
NODE_ENV=test
PORT=5001
JWT_ACCESS_SECRET=test-access-secret-key
JWT_REFRESH_SECRET=test-refresh-secret-key
GOOGLE_CLIENT_ID=test-google-client-id-12345
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 3: Run Backend Tests

#### Unit Tests (AuthService)

```bash
cd services/api
pnpm test -- src/services/authService.test.ts
```

Expected output:
```
PASS  src/services/authService.test.ts
  AuthenticationService
    Password Validation
      ✓ should validate strong password (5ms)
      ✓ should reject password without uppercase (3ms)
      ✓ should reject password without lowercase (2ms)
      ✓ should reject password without number (2ms)
      ✓ should reject password without special character (2ms)
      ✓ should reject password too short (2ms)
      ✓ should accept all valid strong passwords (4ms)
    Email Validation
      ✓ should validate correct email format (2ms)
      ✓ should reject invalid email format (3ms)
    Sign Up
      ✓ should successfully register new user (15ms)
      ✓ should reject signup with invalid email (3ms)
      ✓ should reject signup with weak password (3ms)
      ...

Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Time:        2.341 s
```

#### Routes Integration Tests

```bash
cd services/api
pnpm test -- tests/auth.routes.integration.test.ts
```

Expected output:
```
PASS  tests/auth.routes.integration.test.ts
  Auth Routes Integration Tests
    POST /api/auth/signup
      ✓ should successfully register new user (45ms)
      ✓ should reject signup with missing email (12ms)
      ✓ should reject signup with missing password (11ms)
      ✓ should reject signup with missing displayName (10ms)
      ✓ should reject signup with invalid email format (14ms)
      ✓ should reject signup with weak password (13ms)
      ✓ should reject signup with duplicate email (25ms)
      ✓ should apply rate limiting to signup (120ms)
    POST /api/auth/login
      ✓ should successfully login with valid credentials (38ms)
      ✓ should reject login with missing email (8ms)
      ✓ should reject login with missing password (7ms)
      ✓ should reject login with invalid credentials (15ms)
    POST /api/auth/google
      ✓ should verify Google token and create user (35ms)
      ✓ should reject invalid Google token (12ms)
    POST /api/auth/refresh
      ✓ should refresh access token (30ms)
      ✓ should reject invalid refresh token (15ms)
    Protected Routes
      ✓ should reject request without authorization (8ms)
      ✓ should reject invalid authorization header (7ms)
      ✓ should reject invalid token (9ms)

Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total
Time:        4.156 s
```

#### E2E Scenario Tests

```bash
cd services/api
pnpm test -- tests/auth.e2e.test.ts
```

Expected output:
```
PASS  tests/auth.e2e.test.ts
  E2E: Complete Authentication Flow
    Scenario 1: New User Registration → Login → Profile Access
      ✓ Step 1: Register new user (50ms)
      ✓ Step 2: Verify user can access profile (30ms)
      ✓ Step 3: User can update profile (35ms)
    Scenario 2: Existing User Login → Token Refresh → Logout
      ✓ Step 1: Login established user (45ms)
      ✓ Step 2: Refresh token before expiration (28ms)
      ✓ Step 3: Logout invalidates token (22ms)
      ✓ Step 4: Verify old token rejected (15ms)
    Scenario 3: Security - Unauthorized Access
      ✓ Should reject access without token (8ms)
      ✓ Should reject malformed token (9ms)
      ✓ Should reject expired token (7ms)
      ✓ Should prevent unauthorized password change (10ms)
    Scenario 4: Google OAuth Integration
      ✓ Step 1: First-time Google login (40ms)
      ✓ Step 2: Repeat Google login (35ms)
    Scenario 5: Error Recovery
      ✓ Should allow retry after failed attempt (50ms)

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Time:        3.892 s
```

### Step 4: Run Frontend Tests

```bash
cd packages/@restaurant/web
pnpm test:api
```

Expected output:
```
PASS  tests/api.integration.test.ts
  Frontend-Backend Integration
    Signup Request
      ✓ should send POST to /auth/signup (12ms)
      ✓ should handle signup validation errors (8ms)
      ✓ should store tokens in localStorage (10ms)
    Login Request
      ✓ should send POST to /auth/login (10ms)
      ✓ should include credentials in headers (9ms)
      ✓ should handle authentication error (8ms)
    Google OAuth Request
      ✓ should send POST to /auth/google (11ms)
      ✓ should handle Google OAuth errors (9ms)
    Token Refresh
      ✓ should refresh access token (13ms)
      ✓ should retry request after token refresh on 401 (18ms)
      ✓ should logout on invalid refresh token (11ms)
    Protected Route Access
      ✓ should include Authorization header (9ms)
      ✓ should not include header in public endpoints (8ms)
    CORS Handling
      ✓ should include credentials in requests (7ms)
      ✓ should handle CORS errors (10ms)

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Time:        2.341 s
```

### Step 5: Full Coverage Report

```bash
cd services/api
pnpm test -- --coverage
```

Example coverage output:
```
------------|---------|----------|---------|---------|
File       | % Stmts | % Branch | % Funcs | % Lines |
------------|---------|----------|---------|---------|
All files  |    81.2 |     78.5 |    82.3 |    81.2 |
 auth      |    88.5 |     85.2 |    89.1 |    88.5 |
 models    |    75.3 |     72.1 |    76.5 |    75.3 |
 routes    |    82.1 |     79.8 |    83.2 |    82.1 |
------------|---------|----------|---------|---------|
```

## ✅ Validation Checklist

After running tests, verify:

- [ ] All tests pass (green checkmarks)
- [ ] No skipped tests (all tests run)
- [ ] No timeout errors (tests complete quickly)
- [ ] Coverage above 70% for core files
- [ ] No unhandled promise rejections
- [ ] All mocks cleaned up between tests

## 🔍 Test Execution Details

### What Each Test Suite Validates

| Suite | Location | Tests | Coverage |
|-------|----------|-------|----------|
| Unit Tests | `src/services/authService.test.ts` | 28 | Password validation, email validation, signup/login logic |
| Routes | `tests/auth.routes.integration.test.ts` | 21 | HTTP endpoints, request/response handling, auth flows |
| E2E Scenarios | `tests/auth.e2e.test.ts` | 16 | Complete user journeys, security, error recovery |
| Frontend API | `packages/@restaurant/web/tests/api.integration.test.ts` | 15 | Axios calls, token management, CORS |
| **TOTAL** | | **80** | |

### Test Categories

```
Authentication Tests (80 total)
├── Signup & Registration (15 tests)
│   ├── Valid registration
│   ├── Input validation
│   ├── Duplicate detection
│   └── Rate limiting
├── Login & Sessions (12 tests)
│   ├── Credential verification
│   ├── Token generation
│   ├── Session management
│   └── Error handling
├── OAuth 2.0 (8 tests)
│   ├── Google token verification
│   ├── User creation/update
│   └── Error scenarios
├── Token Management (15 tests)
│   ├── Token refresh
│   ├── Token expiration
│   ├── Token validation
│   └── Logout/invalidation
├── Security (18 tests)
│   ├── Unauthorized access
│   ├── Token tampering
│   ├── Rate limiting
│   └── Password protection
├── Error Recovery (6 tests)
│   ├── Failed attempts
│   ├── Recovery flows
│   └── User guidance
└── Frontend Integration (6 tests)
    ├── API calls
    ├── Credential storage
    └── Error handling
```

## 🐛 Troubleshooting

### Issue 1: Tests Timeout

**Error**: `Jest did not exit one second after the test run has completed`

**Solution**:
```bash
# Kill any hanging processes
lsof -ti:5001 | xargs kill -9

# Clear jest cache
pnpm test -- --clearCache

# Rerun tests
pnpm test:auth
```

### Issue 2: Module Not Found

**Error**: `Cannot find module '@/services/AuthService'`

**Solution**:
```bash
# Rebuild TypeScript
cd services/api && npm run build

# Verify tsconfig paths
cat tsconfig.json | grep -A2 '"paths"'

# Reinstall dependencies
npm install
```

### Issue 3: Mock Data Issues

**Error**: `TypeError: Cannot read property 'create' of undefined`

**Solution**:
```bash
# Verify mocks are set up
cat tests/setup.ts

# Ensure repositories are mocked
# Check that all jest.mock() calls are before test imports

# Restart jest
pnpm test -- --forceExit
```

### Issue 4: Token Verification Fails

**Error**: `TokenExpiredError: jwt expired`

**Solution**:
```bash
# Verify JWT secrets are set in .env.test.local
cat services/api/.env.test.local | grep JWT

# Ensure test environment is used
NODE_ENV=test pnpm test

# Check token expiry times in AuthService
grep -n "EXPIRY\|_MINUTE\|_HOUR" src/services/AuthService.ts
```

### Issue 5: Database Connection Issues

**Error**: `ECONNREFUSED: Connection refused 127.0.0.1:5432`

**Solution**:
```bash
# Tests use mocked repositories, no real DB needed
# Verify jest.mock() is loaded in setup.ts

# If you see DB errors, mock is not working
# Check that mocks are before any service imports

# Force node environment
NODE_OPTIONS=--no-warnings pnpm test
```

## 📊 Test Results Summary

### Before Changes
- ❌ No tests configured
- ❌ No E2E test coverage
- ❌ No validation of frontend-backend integration

### After Changes
- ✅ 80+ test cases covering all auth flows
- ✅ Jest setup with TypeScript support
- ✅ Integration tests with supertest & axios-mock-adapter
- ✅ E2E scenario testing
- ✅ Security validation tests
- ✅ Error recovery tests
- ✅ Frontend-backend integration tests

## 🎯 Next Steps

After successful test execution:

1. **Continuous Integration Setup**
   - Configure GitHub Actions to run tests on push
   - Set minimum coverage thresholds

2. **Test Coverage Improvement**
   - Add React component tests for auth UI
   - Add error boundary tests
   - Add accessibility tests

3. **Performance Testing**
   - Add load tests for auth endpoints
   - Profile token verification performance

4. **Database Integration**
   - Replace mocks with real Firestore integration tests
   - Test user data persistence

## 📚 Related Documentation

- [Auth E2E Testing Guide](AUTH_E2E_TESTING_GUIDE.md)
- [Auth API Guide](docs/AUTH_API_GUIDE.md)
- [Security Guidelines](EPIC_1_SECURITY_DATA_MODELS.md)
