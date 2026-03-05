# 🎯 EPIC 1: USER JOURNEY FLOWS & NAVIGATION ARCHITECTURE

## 1. NEW USER ONBOARDING PATH

### Complete User Journey Map

```
┌─────────────────────────────────────────────────────────────┐
│ NEW USER VISITS APP → WELCOME SCREEN                        │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    ▼               ▼
        ┌─────────────────┐  ┌─────────────────┐
        │ [Sign In] Button│  │ [Create Account]│
        │   Returning     │  │     New User    │
        │   Users → ✓     │  │     User → ✓    │
        └─────────────────┘  └─────────────────┘
                    │               │
                    │       ┌───────▼──────────┐
                    │       │  SIGN UP SCREEN  │
                    │       ├──────────────────┤
                    │       │ [Back] ← →       │
                    │       │ Create Account   │
                    │       ├──────────────────┤
                    │       │ [Name Input]     │
                    │       │ [Email Input]    │
                    │       │ [Password Input] │
                    │       │ [Confirm Pass]   │
                    │       │ [Terms Checkbox] │
                    │       │                  │
                    │       │ [Create Account] │
                    │       │     Or           │
                    │       │ [Sign up w/Goog]│
                    │       │                  │
                    │       │ Have account?    │
                    │       │ → Sign In        │
                    │       └───────┬──────────┘
                    │               │
                    │       ┌───────▼──────────┐
                    │       │ VALIDATION       │
                    │       ├──────────────────┤
                    │       │ Name: required   │
                    │       │ Email: valid     │
                    │       │ Password: >= 6   │
                    │       │ Match confirm    │
                    │       │ Terms: checked   │
                    │       └───────┬──────────┘
                    │               │
                    │       ┌───────▼──────────┐
                    │       │ BACKEND          │
                    │       ├──────────────────┤
                    │       │ POST /auth/signup│
                    │       │ Hash password    │
                    │       │ Create user      │
                    │       │ Store prefs      │
                    │       │ Generate JWT     │
                    │       └───────┬──────────┘
                    │               │
        ┌───────────┴───────┬───────▼──────────┐
        │                   │                  │
    [Success]          [Error]          [Google]
        │                   │                  │
        │           ┌───────▼──────────┐      │
        │           │ Show Error Msg   │      │
        │           │ Clear password   │      │
        │           │ Focus field      │      │
        │           └──────────────────┘      │
        │                                     │
        ▼                                     ▼
  ┌──────────────────┐              ┌──────────────────┐
  │ AUTO LOGIN USER  │              │ GOOGLE AUTH      │
  │ Store JWT token  │              │ OAuth flow       │
  │ Redirect chat    │              │ Auto-fill email  │
  └────────┬─────────┘              └────────┬─────────┘
           │                                  │
           └──────────────────┬───────────────┘
                              │
                   ┌──────────▼──────────┐
                   │ CHATBOT INTERFACE   │
                   ├─────────────────────┤
                   │ Welcome message     │
                   │ User name shown     │
                   │ Chat input ready    │
                   │ Profile menu (👤)   │
                   │ Logout option (🚪)  │
                   └─────────────────────┘
```

### Key Interaction Points

| Step | Component | User Action | System Response | Next State |
|------|-----------|------------|-----------------|-----------|
| 1 | Welcome Screen | Click "Create Account" | Route to SignUp | SignUp Form |
| 2 | SignUp Form | Enter name, email, password | Validate inputs | Form Valid/Invalid |
| 3 | SignUp Form | Click "Create Account" | Submit POST request | Loading → Success/Error |
| 4 | SignUp Success | Auto-login + redirect | Generate token, save user | Chatbot Interface |
| 5 | Google SignUp | Click "Sign up with Google" | Open Google popup | OAuth callback → Auto-login |

---

## 2. RETURNING USER LOGIN PATH

```
┌─────────────────────────────────┐
│ CACHED USER (localStorage)      │
│ Has JWT token?                  │
└────────────┬──────────────────┬─┘
             │                  │
             │ Yes              │ No
             ▼                  ▼
      ┌──────────────┐  ┌───────────────┐
      │ Validate JWT │  │ WELCOME SCREEN│
      │ Check expiry │  │ [Sign In] btn │
      └────────┬─────┘  └───────┬───────┘
               │                │
        ┌──────▼────┐      ┌────▼────────┐
        │Valid?     │      │  SIGN IN    │
        │           │      │   FORM      │
        │Yes   │No  │      │             │
        └──┬────┴───┘      │ [Email]     │
           │               │ [Password]  │
           │               │             │
           │         Forgot Password?
           │         [Forgot Pass Link]
           │               │
      Skip Auth    ┌───────▼──────────┐
      Show         │ Validation       │
      Chatbot      │ - Email: valid   │
                   │ - Password: req  │
                   └───────┬──────────┘
                           │
                   ┌───────▼──────────┐
                   │ POST /auth/login │
                   │ Compare password │
                   │ If valid:        │
                   │  - Generate JWT  │
                   │  - Return user   │
                   └───────┬──────────┘
                           │
                  ┌────────┴────────┐
                  │                 │
               Success            Error
                  │                 │
                  │        ┌────────▼─────┐
                  │        │ Show Error    │
                  │        │ "Invalid      │
                  │        │ credentials"  │
                  │        │ Clear form    │
                  │        └───────┬───────┘
                  │                │
            ┌─────▼────────────────┘
            │
      ┌─────▼──────────────┐
      │ CHATBOT INTERFACE  │
      │ (Already logged in)│
      │ Remember me setup  │
      │ Resume conversation│
      └────────────────────┘
```

### Sign In Complete Flow

| Step | Component | User Action | System Response | Validation |
|------|-----------|------------|-----------------|-----------|
| 1 | Welcome Screen | Click "Sign In" | Route to SignIn | - |
| 2 | SignIn Form | Enter email + password | Client validation | Email format, pwd length |
| 3 | SignIn Form | Check "Remember me" | Update state | Optional |
| 4 | SignIn Form | Click "Sign In" | POST to backend | Send credentials |
| 5 | Backend | Compare with DB | Verify credentials | Hash match check |
| 6 | Success | Auto-login + redirect | Save JWT + user data | Show Chatbot |
| 7 | Error | Show message | Clear sensitive fields | Retry allowed |

---

## 3. PROFILE MANAGEMENT JOURNEY

```
┌─────────────────────────────┐
│ AUTHENTICATED USER          │
│ In Chatbot Interface        │
└─────────────┬───────────────┘
              │
              │ Click Profile (👤)
              ▼
      ┌──────────────────┐
      │ PROFILE MODAL    │
      │  (Right sidebar) │
      ├──────────────────┤
      │ [✕ Close btn]    │
      │                  │
      │ Avatar section:  │
      │ ┌──────────────┐ │
      │ │  [Avatar]    │ │
      │ │  John Doe    │ │
      │ │  john@ex.com │ │
      │ └──────────────┘ │
      │                  │
      │ Your Preferences │
      │ ─────────────── │
      │ Price: Moderate  │
      │ Location: NYC    │
      │ Cuisines: [5]    │
      │                  │
      │ [Edit Profile]   │
      │ [Logout]         │
      └────────┬─────────┘
               │
        ┌──────┴────────┐
        ▼               ▼
    ┌─────────┐  ┌──────────────────┐
    │ Close   │  │ EDIT MODE        │
    │ Profile │  │  ┌────────────┐  │
    │ Modal   │  │  │ [Name]     │  │
    │ Return  │  │  │ [Email]    │  │
    │ to Chat │  │  │ [Location] │  │
    └─────────┘  │  │ [Price▼]   │  │
                 │  │            │  │
                 │  │ Cuisines   │  │
                 │  │ ☑ Italian  │  │
                 │  │ ☑ Thai     │  │
                 │  │ ☐ Japanese │  │
                 │  │            │  │
                 │  │ [Cancel]   │  │
                 │  │ [Save]     │  │
                 │  └────────────┘  │
                 │                  │
                 │  On Save:        │
                 │  POST /profile   │
                 │  Update user     │
                 │  Store prefs     │
                 └────────┬─────────┘
                          │
                    ┌─────▼─────┐
                    │ Success   │
                    │ Toast msg │
                    │ Update UI │
                    │ Close edit│
                    └───────────┘
```

### Profile Actions Available

1. **View Profile** → Display all user info read-only
2. **Edit Profile** → Modify name, location, preferences
3. **Manage Preferences** → Select cuisines, price range
4. **Logout** → Clear JWT, redirect to Welcome
5. **Close Modal** → Return to chat

---

## 4. NAVIGATION ARCHITECTURE

### URL/Route Structure

```
/                           → Welcome Screen
├─ /auth/signin            → Sign In Form
├─ /auth/signup            → Sign Up Form
├─ /dashboard              → Chatbot Interface (Protected)
├─ /profile                → User Profile (Modal in dashboard)
└─ /logout                 → Clear auth + redirect to /
```

### Component Navigation Map

```
AuthProvider
├── AppContent
│   ├── !isAuthenticated
│   │   ├── authScreen = "welcome" → <WelcomeScreen />
│   │   ├── authScreen = "signin" → <SignIn />
│   │   └── authScreen = "signup" → <SignUp />
│   │
│   └── isAuthenticated
│       └── <ChatInterface />
│           ├── <Header />
│           │   ├── [Menu Toggle] → setSidebarOpen(true)
│           │   ├── [Profile] → setProfileOpen(true)
│           │   └── [Logout] → handleLogout()
│           │
│           ├── {sidebarOpen && <UserSidebar />}
│           │   ├── Reservations
│           │   ├── Favorites
│           │   ├── Reviews
│           │   ├── Settings
│           │   └── Support
│           │
│           ├── <MainChat />
│           │   ├── <MessageArea />
│           │   ├── <RestaurantCards />
│           │   └── <ChatInput />
│           │
│           └── {profileOpen && <Modal><UserProfile /></Modal>}
│               ├── View Profile
│               ├── Edit Profile
│               └── Logout
```

### State Management Flow

```
Redux/Context Store:
├── Auth State
│   ├── isAuthenticated: boolean
│   ├── user: User | null
│   ├── isLoading: boolean
│   └── error: string | null
│
├── UI State
│   ├── sidebarOpen: boolean
│   ├── profileOpen: boolean
│   ├── authScreen: "welcome" | "signin" | "signup"
│   └── theme: "light" | "dark"
│
└── User Preferences
    ├── cuisines: string[]
    ├── priceRange: "budget" | "moderate" | "expensive"
    ├── location: string
    └── rememberMe: boolean
```

---

## 5. ERROR HANDLING & EDGE CASES

### Sign Up Error Scenarios

| Error | User Sees | Recovery Action |
|-------|-----------|-----------------|
| Invalid email format | "Invalid email format" | Clear, focus email field |
| Password too short | "Min 6 characters" | Keep input, focus password |
| Passwords don't match | "Passwords do not match" | Clear confirm, focus it |
| Email already exists | "Email already in use" | Clear form, suggest login |
| Network error | "Connection failed" | Retry button |
| Server error (500) | "Sign up failed" | Retry or contact support |

### Sign In Error Scenarios

| Error | User Sees | Recovery Action |
|-------|-----------|-----------------|
| Invalid email | "Email not found" | Clear form, suggest signup |
| Wrong password | "Invalid password" | Clear password only |
| Account locked | "Too many attempts" | Show reset option |
| Network error | "Connection failed" | Retry button |
| JWT expired | Auto-logout | Redirect to signin |

---

## 6. STATE TRANSITIONS & LIFECYCLE

### Authentication Lifecycle

```
Initial State: isAuthenticated = false
                authScreen = "welcome"

Event 1: Click "Sign In"
→ authScreen = "signin"

Event 2: Submit Sign In Form
→ isLoading = true
→ POST /auth/login

Response 1: Success
→ isLoading = false
→ user = userData
→ isAuthenticated = true
→ Save JWT token
→ Redirect to dashboard

Response 2: Error
→ isLoading = false
→ error = errorMessage
→ Stay on signin
→ Show error toast

Event 3: Click "Forgot Password"
→ Route to /forgot-password
→ Enter email
→ Send reset link
→ Confirmation message

Event 4: Logout
→ Clear JWT token
→ Clear user state
→ isAuthenticated = false
→ authScreen = "welcome"
→ Redirect to welcome
```

---

## 7. MOBILE VS DESKTOP NAVIGATION

### Desktop Layout
- Profile modal slides from right (sidebar)
- User menu in header
- Logout button always visible
- Full navigation menu available

### Mobile Layout (480px-768px)
- Profile: Full-screen modal overlay
- Menu toggle button (☰) in header
- Sidebar: Full-width sliding panel
- Touch-friendly spacing (min 44px targets)

### Ultra-Mobile (< 480px)
- Profile: Full-screen modal
- Simplified navigation
- Stack buttons vertically
- Larger touch targets (56px+)

---

This ensures smooth, intuitive navigation for both new and returning users! 🎯
