/**
 * FINAL INDUSTRY-STANDARD FOLDER STRUCTURE DOCUMENTATION
 * AgentDine Customer Web Application
 * Restructured: April 19, 2026
 */

/**
 * ====================================================================
 * FOLDER STRUCTURE - ORGANIZED BY FEATURE & RESPONSIBILITY
 * ====================================================================
 * 
 * src/
 * ├── components/                 # React UI Components
 * │   ├── pages/                 # Page-level components (routed)
 * │   │   ├── LandingPage.tsx    # Landing page
 * │   │   ├── HomePage.tsx       # Authenticated home
 * │   │   └── SearchPage.tsx     # Restaurant search
 * │   │
 * │   ├── auth/                  # Authentication components
 * │   │   ├── SignIn.tsx
 * │   │   ├── SignUp.tsx
 * │   │   ├── ForgotPassword.tsx
 * │   │   └── GoogleCallback.tsx
 * │   │
 * │   ├── booking/               # Reservation flow components
 * │   │   ├── BookingStep1.tsx
 * │   │   ├── BookingStep2.tsx
 * │   │   ├── BookingStep3.tsx
 * │   │   └── BookingFlow.css
 * │   │
 * │   ├── chat/                  # Chat widget components
 * │   │   ├── FloatingChatWidget.tsx  # Main global chat widget
 * │   │   └── FloatingChatWidget.css
 * │   │
 * │   ├── common/                # Shared UI components
 * │   │   ├── RestaurantCard.tsx
 * │   │   ├── UserProfile.tsx
 * │   │   ├── UserProfileMenu.tsx
 * │   │   ├── UserSidebar.tsx
 * │   │   ├── UserProfile.css
 * │   │   └── UserProfileMenu.css
 * │   │
 * │   ├── layout/                # Layout wrapper components
 * │   │   ├── Header_new.tsx      # Global header
 * │   │   └── ProtectedRoute.tsx  # Route protection
 * │   │
 * │   ├── profile/               # User profile components
 * │   │   ├── ProfileOverview.tsx
 * │   │   ├── BookingsHistory.tsx
 * │   │   ├── Favorites.tsx
 * │   │   ├── PreferencesSettings.tsx
 * │   │   ├── ProfileOverview.css
 * │   │   ├── BookingsHistory.css
 * │   │   ├── Favorites.css
 * │   │   └── PreferencesSettings.css
 * │   │
 * │   ├── restaurant/            # Restaurant feature components
 * │   │   ├── RestaurantDetails.tsx
 * │   │   └── RestaurantDetails.css
 * │   │
 * │   ├── search/                # Search & filter components
 * │   │   ├── SearchHeader.tsx
 * │   │   ├── FilterPanel.tsx
 * │   │   ├── RestaurantGrid.tsx
 * │   │   └── Pagination.tsx
 * │   │
 * │   └── index.ts               # Component exports
 * │
 * ├── contexts/                  # React Context (Global state)
 * │   └── ChatContext.tsx        # Chat widget state management
 * │
 * ├── hooks/                     # Custom React Hooks
 * │   └── useConversation.ts
 * │
 * ├── services/                  # API & external service calls
 * │   ├── chatService.ts         # Chat API calls
 * │   ├── restaurantService.ts   # Restaurant data
 * │   ├── firebaseService.ts     # Firebase/Auth integration
 * │   ├── guestService.ts        # Guest user management
 * │   └── googleAuthDiagnostics.ts
 * │
 * ├── utils/                     # Utility helper functions
 * │   └── helpers.ts             # Common utilities
 * │
 * ├── constants/                 # Application constants
 * │   └── config.ts              # Routes, API URLs, etc.
 * │
 * ├── types/                     # TypeScript type definitions
 * │   └── index.ts               # Shared interfaces & types
 * │
 * ├── theme/                     # Design theme & colors
 * │   └── colors.ts              # Color palette
 * │
 * ├── styles/                    # Global CSS styles
 * │   └── auth.css               # Auth component styles
 * │
 * ├── tests/                     # Unit & integration tests
 * │   ├── AuthContext.test.tsx
 * │   ├── SignIn.test.tsx
 * │   ├── SignUp.test.tsx
 * │   ├── UserProfile.test.tsx
 * │   └── setup.ts
 * │
 * ├── App.tsx                    # Root component with routing
 * ├── main.tsx                   # React entry point
 * ├── index.css                  # Global styles (imports auth.css)
 * ├── epic2-styles.css           # Epic 2 theme styles
 * └── vite-env.d.ts              # Vite environment types
 */

/**
 * ====================================================================
 * IMPROVEMENTS MADE
 * ====================================================================
 * 
 * ✅ DELETED (Removed unused/duplicate files):
 *    - components/auth/SignUp_temp.tsx (temp file)
 *    - components/layout/Header.css (orphaned CSS)
 *    - Removed deprecated contexts/AuthContext.tsx (shim)
 * 
 * ✅ RENAMED (Standardized naming):
 *    - context/ → contexts/ (consistency with shared package)
 * 
 * ✅ ADDED (Industry-standard folders):
 *    - utils/ (helper functions)
 *    - constants/ (app configuration)
 *    - types/ (TypeScript interfaces)
 * 
 * ✅ UPDATED (Fixed imports):
 *    - All ChatContext imports: context/ → contexts/
 *    - Created new utility files with best practices
 */

/**
 * ====================================================================
 * KEY FILES & RESPONSIBILITIES
 * ====================================================================
 * 
 * ENTRY POINTS:
 *   - main.tsx: React app mount point
 *   - App.tsx: Root component with routing
 * 
 * GLOBAL STATE:
 *   - contexts/ChatContext.tsx: Chat widget state (open/close)
 *   - styles/index.css: Global styles
 * 
 * SHARED UTILITIES:
 *   - utils/helpers.ts: Common utility functions
 *   - constants/config.ts: Routes, API URLs, constants
 *   - types/index.ts: TypeScript interfaces
 *   - theme/colors.ts: Design system colors
 * 
 * MAIN FEATURES:
 *   - components/pages: Routed pages
 *   - components/auth: Authentication flows
 *   - components/chat: Global chat widget
 *   - components/booking: Multi-step reservations
 * 
 * SERVICES:
 *   - services/chatService.ts: Chat API integration
 *   - services/restaurantService.ts: Restaurant data
 *   - services/firebaseService.ts: Auth & user data
 * 
 * TESTING:
 *   - tests/: Unit tests for key components
 */

/**
 * ====================================================================
 * COMPONENT ORGANIZATION PRINCIPLES
 * ====================================================================
 * 
 * 1. COLOCATION: Related files (component + styles) in same folder
 * 2. NAMING: Clear, descriptive names (PascalCase for components)
 * 3. IMPORTS: From highest level (src/) to local (relative paths)
 * 4. SEPARATION: One folder per feature/domain
 * 5. REUSABILITY: Common components in components/common
 * 6. TYPES: Centralized in types/ folder, exported from types/index.ts
 * 7. CONSTANTS: Centralized in constants/ folder for easy updates
 */

/**
 * ====================================================================
 * FEATURE BREAKDOWN
 * ====================================================================
 * 
 * PAGES (Entry points):
 *   - LandingPage: Public landing page with hero + chat widget
 *   - HomePage: Authenticated user dashboard
 *   - SearchPage: Restaurant discovery with filters
 * 
 * AUTH FLOW:
 *   - SignIn: Email/password login
 *   - SignUp: User registration
 *   - GoogleCallback: OAuth callback
 *   - ForgotPassword: Password reset
 * 
 * BOOKING FLOW (Multi-step):
 *   - Step 1: Date, time, party size
 *   - Step 2: Guest details & special requests
 *   - Step 3: Confirmation
 * 
 * USER PROFILE:
 *   - ProfileOverview: User information
 *   - BookingsHistory: Past & upcoming reservations
 *   - Favorites: Saved restaurants
 *   - PreferencesSettings: User preferences
 * 
 * CHAT SYSTEM:
 *   - FloatingChatWidget: Global AI chat widget (on all pages)
 *   - Context: Chat state management (open/close)
 *   - Service: Chat API integration
 * 
 * SEARCH & DISCOVERY:
 *   - SearchHeader: Search bar
 *   - FilterPanel: Advanced filters
 *   - RestaurantGrid: Results display
 *   - Pagination: Page navigation
 */

/**
 * ====================================================================
 * USAGE GUIDE
 * ====================================================================
 * 
 * ADDING NEW COMPONENTS:
 *   1. Create folder in appropriate category
 *   2. Create Component.tsx (component code)
 *   3. Create Component.css (styles if needed)
 *   4. Export from components/index.ts
 * 
 * ADDING NEW UTILITIES:
 *   1. Add to utils/helpers.ts or create utils/newUtil.ts
 *   2. Export from utils/index.ts
 *   3. Import in files: import { func } from '@/utils'
 * 
 * ADDING NEW CONSTANTS:
 *   1. Add to constants/config.ts
 *   2. Import where needed: import { CONSTANT } from '@/constants'
 * 
 * ADDING NEW TYPES:
 *   1. Add to types/index.ts
 *   2. Import in files: import { MyType } from '@/types'
 * 
 * ADDING NEW SERVICES:
 *   1. Create services/newService.ts
 *   2. Export functions
 *   3. Import in components: import { function } from '@/services'
 */

/**
 * ====================================================================
 * BEST PRACTICES FOLLOWED
 * ====================================================================
 * 
 * ✅ Single Responsibility: Each folder has one domain
 * ✅ DRY (Don't Repeat Yourself): Utilities, constants, types centralized
 * ✅ Scalability: Easy to add new features/components
 * ✅ Maintainability: Clear structure, easy to find files
 * ✅ Type Safety: TypeScript interfaces for all data types
 * ✅ Consistency: Naming conventions, folder organization
 * ✅ No Duplication: Removed unused files, consolidated contexts
 * ✅ Global State: Minimal, using Context API for chat
 * ✅ Services Layer: Separation of API calls from components
 */
