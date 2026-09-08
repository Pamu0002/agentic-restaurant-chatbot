# 🎨 Restaurant Agentic Chatbot - Customer Web App
## Complete Wireframe & UI/UX Design Specifications

---

## 📌 Document Overview

**Project:** Restaurant Agentic Chatbot - Customer Web Application  
**Scope:** Complete customer-facing web app (NOT admin dashboard)  
**Platform:** Responsive Web App (Mobile-First, PWA-enabled)  
**Tech Stack:** React, Firebase, Google Vertex AI (Gemini)  
**Status:** Design specifications ready for Figma implementation

---

## 📋 Quick Navigation

**Part 1: Foundation**
- [Design System](#design-system)
- [Navigation Structure](#navigation-structure)
- [Responsive Breakpoints](#responsive-breakpoints)

**Part 2: Core Screens (16 total)**
- [Epic 1: Authentication (5 screens)](#epic-1-authentication)
- [Epic 2: Chat Interface (4 screens)](#epic-2-chat-interface)
- [Epic 3: Restaurant Discovery (4 screens)](#epic-3-restaurant-discovery)
- [Epic 4: Reservation Management (3 screens)](#epic-4-reservation-management)

**Part 3: Implementation Guide**
- [Component Library](#component-library)
- [Interaction Patterns](#interaction-patterns)
- [Validation Checklist](#validation-checklist)

---

---

# PART 1: FOUNDATION

## Design System

### Color Palette

```
PRIMARY COLORS:
├─ Primary Orange:      #FF6B35 (Main CTAs, highlights, primary brand color)
├─ Primary Orange Dark: #E55A24 (Hover state for primary buttons)
└─ Primary Orange Light: #FFB347 (Disabled/secondary use)

SECONDARY COLORS:
├─ Deep Blue:           #004E89 (Secondary actions, headers)
├─ Blue Light:          #0066CC (Links, secondary elements)
└─ Blue Dark:           #003366 (Active states)

SEMANTIC COLORS:
├─ Success Green:       #28A745 (Confirmations, success states)
├─ Warning Yellow:      #FFC107 (Alerts, warnings)
├─ Error Red:           #DC3545 (Errors, cancellations)
└─ Info Blue:           #0099CC (Information messages)

NEUTRAL COLORS:
├─ Background White:    #FFFFFF (Primary background)
├─ Light Gray:          #F7F7F7 (Secondary background, cards)
├─ Medium Gray:         #CCCCCC (Dividers, borders)
├─ Dark Gray:           #666666 (Secondary text)
├─ Text Dark:           #333333 (Primary text)
└─ Text Darkest:        #1A1A1A (Headers, emphasis)

SHADOWS:
├─ Shadow Small:        0px 1px 3px rgba(0,0,0,0.12)
├─ Shadow Medium:       0px 4px 6px rgba(0,0,0,0.15)
└─ Shadow Large:        0px 8px 16px rgba(0,0,0,0.18)
```

### Typography System

```
FONT FAMILY: Inter or similar sans-serif (system fonts for performance)

HEADING STYLES:
├─ H1 - Page Title:        28px | Bold (700) | Line-height: 1.2 | Color: #1A1A1A
├─ H2 - Section Title:     24px | Bold (700) | Line-height: 1.2 | Color: #1A1A1A
├─ H3 - Subsection:        20px | Semi-bold (600) | Line-height: 1.3 | Color: #333333
├─ H4 - Card Title:        18px | Semi-bold (600) | Line-height: 1.3 | Color: #333333
└─ H5 - Label:             16px | Bold (700) | Line-height: 1.4 | Color: #333333

BODY TEXT:
├─ Body Large:             16px | Regular (400) | Line-height: 1.5 | Color: #333333
├─ Body Regular:           14px | Regular (400) | Line-height: 1.6 | Color: #333333
├─ Body Small:             12px | Regular (400) | Line-height: 1.6 | Color: #666666
└─ Body Tiny:              11px | Regular (400) | Line-height: 1.5 | Color: #999999

SPECIAL:
├─ Button Text:            14px | Semi-bold (600) | Color: varies by button type
├─ Link:                   14px | Regular (400) | Color: #0066CC | Underline on hover
├─ Caption:                12px | Regular (400) | Color: #999999
└─ Monospace (for codes):  13px | Regular (400) | Font: 'Courier New' or monospace
```

### Spacing System

```
BASE UNIT: 8px (All spacing values are multiples of 8)

MARGINS & PADDING:
├─ XS:  4px   (minimal spacing, tight layouts)
├─ S:   8px   (small gaps, icon spacing)
├─ M:   16px  (standard padding, comfortable spacing)
├─ L:   24px  (section spacing, generous margins)
├─ XL:  32px  (large section breaks)
└─ XXL: 48px  (full page sections)

COMPONENT SPACING:
├─ Button height (mobile):        48px
├─ Button height (desktop):       40px
├─ Input height (mobile):         48px
├─ Input height (desktop):        40px
├─ Card padding:                  16px
├─ Card border radius:            12px
├─ Button border radius:          8px
├─ Input border radius:           8px
└─ Avatar size:                   40px (small), 64px (medium), 96px (large)

PAGE SPACING:
├─ Horizontal padding (mobile):   16px
├─ Horizontal padding (tablet):   24px
├─ Horizontal padding (desktop):  32px
├─ Section gap:                   24px
└─ Top/bottom safe area (PWA):    24px
```

### Component Sizing Standards

```
BUTTONS:
├─ Small button:           32px height | 12px font | 8px padding horizontal
├─ Medium button:          40px height | 14px font | 12px padding horizontal
├─ Large button (mobile):  48px height | 14px font | 16px padding horizontal
├─ Icon button:            40px × 40px (square)
└─ Floating Action Button: 56px diameter

INPUT FIELDS:
├─ Mobile height:          48px | 14px font | 12px padding
├─ Desktop height:         40px | 14px font | 10px padding
├─ Width:                  Full width (responsive)
└─ Border:                 1px solid #E0E0E0 | Focus: 2px solid #FF6B35

CARDS:
├─ Minimum width:          280px (mobile) | 300px (tablet/desktop)
├─ Content padding:        16px all sides
├─ Image height:           160px (mobile) | 200px (desktop)
├─ Border radius:          12px
└─ Shadow:                 0px 2px 4px rgba(0,0,0,0.1)

ICONS:
├─ Small:                  16px
├─ Medium:                 24px
├─ Large:                  32px
├─ Extra Large:            48px
└─ Always use consistent icon set (Material Design / Feather)

AVATARS:
├─ Extra small:            32px
├─ Small:                  40px
├─ Medium:                 64px
├─ Large:                  96px
└─ Border radius:          50% (perfectly circular)
```

---

## Navigation Structure

### App Navigation Hierarchy

```
BOTTOM TAB NAVIGATION (Mobile Primary)
├─ Home (Dashboard/Explore)
├─ Search (Restaurant Discovery)
├─ Messages (Chat/AI Agent)
├─ Bookings (My Reservations)
└─ Account (Profile & Settings)

SIDEBAR NAVIGATION (Desktop Primary)
├─ Logo + Branding (top)
├─ Navigation items (same as tabs)
└─ User profile (bottom)

HEADER:
├─ Title / Screen name (mobile)
├─ Search bar (if applicable)
├─ Notifications icon
├─ User menu (desktop)
└─ Back arrow (mobile, for nested screens)
```

### Screen Hierarchy Map

```
AUTHENTICATION FLOW:
├─ Welcome Screen
├─ Login Screen
├─ Registration Screen
├─ Password Reset Flow (3 screens)
└─ Onboarding (Preferences)

MAIN APP (Post-Login):
├─ Home/Dashboard
│  ├─ Quick actions
│  ├─ Recent restaurants
│  └─ Quick searches
│
├─ Chat/Messages Tab
│  ├─ Main chat screen
│  ├─ Conversation history
│  └─ Chat details
│
├─ Discovery Tab
│  ├─ Search & filters
│  ├─ Restaurant listing
│  ├─ Restaurant detail
│  └─ Restaurant menu
│
├─ Bookings Tab
│  ├─ Upcoming reservations
│  ├─ Past reservations
│  ├─ Booking detail
│  └─ Booking confirmation
│
└─ Account Tab
   ├─ Profile
   ├─ Settings
   ├─ Payment methods
   ├─ Favorites
   └─ Help & Support
```

---

## Responsive Breakpoints

```
MOBILE FIRST DESIGN:

Mobile Portrait (375px - 480px):
├─ Single column layout
├─ Full-width buttons (48px height)
├─ Stack all components vertically
├─ Bottom tab navigation
├─ 16px horizontal padding
├─ Touch-friendly (48px min height)
└─ No sidebars

Mobile Landscape (480px - 767px):
├─ Still mobile layout
├─ Consider 2-column in specific sections
├─ Adjust padding to 12px
└─ Bottom tab nav remains

Tablet (768px - 1023px):
├─ 2-column layout where applicable
├─ Left sidebar (200px) or top nav
├─ Buttons 40px height
├─ 24px horizontal padding
├─ Grid layouts possible
└─ 2-2 or 3-2 arrangements

Desktop (1024px+):
├─ Left sidebar (220px) + main content
├─ Multi-column grid layouts
├─ Buttons 40px height
├─ 32px horizontal padding
├─ Max content width: 1200px
├─ Sidebar remains visible
└─ Desktop-optimized interactions

SAFE AREAS (PWA):
├─ Top safe area:    24px (for notch/status bar)
├─ Bottom safe area: 24px (for home indicator)
├─ Side safe area:   16px (for curved screens)
└─ Apply consistently across all screens
```

---

---

# PART 2: CORE SCREENS (16 Screens Total)

---

## EPIC 1: Authentication

### Overview
Complete user authentication flow including login, registration, password reset, and onboarding.

**Screens in this epic:** 5
- 1.1: Welcome Screen
- 1.2: Login Screen
- 1.3: Registration Screen
- 1.4: Password Reset (3-step flow)
- 1.5: Onboarding / Preferences

---

### Screen 1.1: Welcome Screen

**Purpose:** First impression, guide new/returning users to login or signup

**Layout:** Full-screen vertical stack, centered content

**Components:**

```
TOP SECTION (40% height):
├─ Logo: 64×64px | centered | top margin 48px
├─ App name: "FoodFinder" | 32px bold | centered
└─ Tagline: "Discover Your Perfect Restaurant" | 16px | centered

MIDDLE SECTION (Illustration/Image):
├─ Hero image: 280×240px (mobile) or 400×300px (desktop)
├─ Restaurant-themed illustration or photo
├─ Gradient overlay (optional): 60% opacity, dark blue to transparent
└─ Bottom positioning

BOTTOM SECTION (Actions):
├─ Headline: "Discover restaurants powered by AI" | H3 | 24px
├─ Subheading: "Personalized recommendations, instant bookings, amazing dining" | Body | 14px | gray
├─ Spacer: 24px
├─ Primary button: "Sign Up" | 48px height | Full width | #FF6B35
├─ Secondary button: "Log In" | 48px height | Full width | Border style | dark text
├─ Social proof: "Join 50,000+ happy diners" | 12px | centered | gray
└─ Bottom safe area padding: 24px
```

**Interactions:**
- Sign Up button → Registration Screen (1.3)
- Log In button → Login Screen (1.2)
- Tap on social proof → Shows testimonials (optional)

**Responsive:**
- Mobile: Full height screen, buttons full width
- Desktop: Image moves to right side (60/40 split), buttons narrow (300px max)

**States:**
- Default (shown above)
- Hover: Buttons highlight in darker shade
- Active: Button shows pressed state

---

### Screen 1.2: Login Screen

**Purpose:** Existing users sign in to their account

**Layout:** Centered form, mobile-first (max-width 400px on desktop)

**Components:**

```
HEADER:
├─ Back arrow (mobile only) | 24px icon | top-left
├─ Title: "Welcome Back" | H2 | 24px
└─ Subtitle: "Sign in to your account" | Body small | gray

FORM SECTION:
├─ Email/Username input:
│  ├─ Label: "Email or Username"
│  ├─ Field: 48px height (mobile) | Full width | 14px font
│  ├─ Placeholder: "you@example.com"
│  ├─ Icon: Email icon (left) | 20px
│  ├─ Validation: Show checkmark (green) when valid
│  └─ Error: Red border + error message below
│
├─ Password input:
│  ├─ Label: "Password"
│  ├─ Field: 48px height | Full width | 14px font
│  ├─ Placeholder: "••••••••"
│  ├─ Icon: Lock icon (left) | 20px
│  ├─ Show/hide toggle: Eye icon (right) | 20px
│  ├─ Validation: Green checkmark when valid
│  └─ Error: Red border + error message below
│
├─ Remember me:
│  ├─ Checkbox (16×16px) + Label text | 14px | Left-aligned
│  └─ Color: #333333
│
└─ Forgot password:
   ├─ Link text: "Forgot password?" | 12px | Right-aligned | #0066CC
   └─ Click → Password Reset Screen (1.4)

SPACER: 24px

ACTION BUTTONS:
├─ Primary button: "Sign In" | 48px | Full width | #FF6B35
├─ Disabled state: Gray, non-interactive when form incomplete
└─ Loading state: Spinner inside button when signing in

DIVIDER: "OR" | 12px | centered | 16px margin vertical

SOCIAL LOGIN:
├─ Google button: 48px height | Full width | Google colors
│  └─ Icon (left) + "Sign in with Google" text
├─ Apple button: 48px height | Full width | Apple colors
│  └─ Icon (left) + "Sign in with Apple" text
└─ Space between: 12px

FOOTER:
├─ "Don't have an account?" text | 14px
├─ Link: "Sign Up" | 14px | #0066CC | bold
└─ Bottom safe area: 24px padding

FIELD SPACING:
├─ Between label and input: 4px
├─ Between input and next field: 16px
├─ Between form and buttons: 24px
└─ Error message: 4px below field | 12px font | #DC3545
```

**Form Validation:**
```
Email:
├─ Empty: Show placeholder, allow input
├─ Typing: Show red border if invalid format
├─ Valid: Show green checkmark
└─ Error: "Please enter a valid email address"

Password:
├─ Empty: Show placeholder
├─ Typing: Characters hidden by default, show toggle
├─ Valid: Green checkmark
└─ Error: "Password required" or "Incorrect password"

Login attempt:
├─ All fields filled: Button enabled (blue)
├─ Missing any field: Button disabled (gray)
├─ Submitting: Show spinner, button disabled
├─ Success: Navigate to home
└─ Error: Show error message, keep form filled
```

**Error States:**
```
Wrong credentials:
├─ Position: Full-width alert box above form | Padding: 12px
├─ Color: #FFF3CD (light yellow) background | #856404 (dark yellow) text
├─ Icon: Warning icon (left) | 20px
├─ Message: "Email or password is incorrect. Please try again."
├─ Close button: X icon (right) | clickable
└─ Auto-dismiss: 5 seconds

Account locked:
├─ Message: "Too many login attempts. Please reset your password or try again later."
├─ Show "Reset Password" link

Network error:
├─ Message: "Connection failed. Please check your internet and try again."
└─ Retry button
```

**Interactions:**
- Email field focus → Show cursor, highlight border in #FF6B35
- Email field blur → Validate format
- Show/hide password → Toggle eye icon, reveal/hide text
- Sign in button → Validate, submit, show loading
- Success → Navigate to home/dashboard
- Remember me checkbox → Save selection (local storage)

**Responsive:**
- Mobile: Full width form, full-width buttons
- Tablet: Form max-width 400px, centered
- Desktop: Form max-width 400px, centered, larger text

---

### Screen 1.3: Registration Screen

**Purpose:** New users create account

**Layout:** Multi-field form, scrollable if needed

**Components:**

```
HEADER:
├─ Back arrow (mobile) | top-left
├─ Title: "Create Account" | H2 | 24px
└─ Subtitle: "Join thousands of food lovers" | Body small | gray

FORM SECTION:

Full Name:
├─ Label: "Full Name"
├─ Input: 48px height | Full width
├─ Placeholder: "John Doe"
├─ Icon: Person icon (left) | 20px
└─ Validation: Letters, hyphens, spaces only

Email:
├─ Label: "Email Address"
├─ Input: 48px height | Full width
├─ Placeholder: "you@example.com"
├─ Icon: Email icon (left) | 20px
└─ Validation: Check format, availability (after blur)

Password:
├─ Label: "Password"
├─ Input: 48px height | Full width
├─ Placeholder: "At least 8 characters"
├─ Icon: Lock icon (left) | 20px
├─ Show/hide toggle: Eye icon (right)
├─ Requirements hint: "Must contain uppercase, number, special character"
└─ Strength indicator:
   ├─ Visual bar: 100% width below input | 4px height
   ├─ States:
   │  ├─ Weak (0-30 chars): Red bar | "Weak"
   │  ├─ Medium (30-60): Orange bar | "Medium"
   │  └─ Strong (60+): Green bar | "Strong"
   └─ Hide after field blur

Confirm Password:
├─ Label: "Confirm Password"
├─ Input: 48px height | Full width
├─ Placeholder: "••••••••"
├─ Icon: Lock icon (left) | 20px
├─ Show/hide toggle: Eye icon (right)
└─ Validation: Must match password field

SPACER: 16px

TERMS:
├─ Checkbox: 16×16px | Left-aligned
├─ Label text: "I agree to" | 14px
├─ Link: "Terms of Service" | 14px | #0066CC
├─ Text: "and" | 14px
├─ Link: "Privacy Policy" | 14px | #0066CC
└─ Error (if unchecked): Red border around checkbox + "Required to continue" message

Newsletter (Optional):
├─ Checkbox: 16×16px
├─ Label: "Send me special offers and updates" | 14px
└─ Default: Checked

SPACER: 24px

BUTTONS:
├─ Primary: "Create Account" | 48px | Full width | #FF6B35
└─ Loading state: Spinner + "Creating account..."

SPACER: 16px

FOOTER:
├─ "Already have an account?" | 14px
├─ Link: "Log In" | 14px | #0066CC | bold
└─ Bottom safe area: 24px

FIELD SPACING:
├─ Between label and input: 4px
├─ Between input fields: 16px
├─ Between form and agreement: 24px
└─ Between form and buttons: 24px
```

**Validation Rules:**
```
Full Name:
├─ Min 2 characters
├─ Max 50 characters
├─ Only letters, spaces, hyphens allowed
└─ Real-time validation (as user types)

Email:
├─ Valid email format (RFC 5322 simplified)
├─ Check availability after blur (no duplicate accounts)
├─ Show: "Email already registered" if taken
└─ Suggestion: "Did you mean xyz@gmail.com?"

Password:
├─ Minimum 8 characters
├─ At least 1 uppercase letter (A-Z)
├─ At least 1 number (0-9)
├─ At least 1 special character (!@#$%^&*)
├─ Show requirements as checklist:
│  ├─ ☐ At least 8 characters (gray if not met)
│  ├─ ☐ One uppercase letter
│  ├─ ☐ One number
│  └─ ☐ One special character
└─ All must be checked (✓ green) to proceed

Confirm Password:
├─ Must exactly match password field
├─ Show error if doesn't match: "Passwords don't match"
└─ Real-time validation

Terms:
├─ Must be checked to enable signup button
└─ If unchecked, button shows "Check terms to continue"
```

**Error States:**
```
Duplicate email:
├─ Show under email field: "This email is already registered"
├─ Suggest: "Log in instead" (link to login)
└─ Color: #DC3545

Weak password:
├─ Show requirements not met (red X marks)
├─ Message: "Password must meet all requirements above"
└─ Color: #DC3545

Network error:
├─ Show alert: "Could not create account. Please try again."
├─ Allow retry
└─ Keep form data (don't clear)

Field errors:
├─ Show below each field
├─ Red text | 12px
├─ Examples:
│  ├─ "Name too short (min 2 characters)"
│  ├─ "Invalid email address"
│  └─ "Passwords don't match"
```

**Interactions:**
- Focus any field → Border highlights in #FF6B35
- Type in fields → Real-time validation
- Password field → Show strength bar
- Show/hide toggle → Toggle password visibility
- Terms link → Open modal/new tab
- Sign up button → Validate all fields
- Success → Navigate to onboarding (1.5)

**Responsive:**
- Mobile: Full-width form, scrollable
- Tablet: Form max-width 450px, centered
- Desktop: Form max-width 450px, centered

---

### Screen 1.4: Password Reset Flow (3 Steps)

**Purpose:** Allow users to recover forgotten passwords

**Step 1: Email Verification**

**Components:**
```
HEADER:
├─ Back arrow | top-left
├─ Title: "Reset Password" | H2 | 24px
└─ Progress: "Step 1 of 3" | 12px | gray

ICON:
├─ Lock with arrow icon | 64px | centered | #FF6B35

CONTENT:
├─ Heading: "Enter Your Email" | H3 | 20px
├─ Description: "We'll send a password reset link to your email" | Body | 14px | gray
├─ Spacer: 24px

FORM:
├─ Email input: 48px height | Full width
│  ├─ Label: "Email Address"
│  ├─ Placeholder: "you@example.com"
│  ├─ Icon: Email icon (left)
│  └─ Validation: Real-time format check
└─ Field spacing: 16px below label

BUTTONS:
├─ Primary: "Send Reset Link" | 48px | Full width | #FF6B35
├─ Secondary: "Back to Login" | 40px | Full width | transparent | border style
└─ Button spacing: 12px between

FOOTER:
├─ "Don't see the email?" | 14px | gray
├─ Link: "Try another email" | 14px | #0066CC
└─ Bottom safe area: 24px
```

**Step 2: Email Sent Confirmation**

**Components:**
```
HEADER:
├─ Title: "Check Your Email" | H2 | 24px
└─ Progress: "Step 2 of 3" | 12px | gray

ICON:
├─ Checkmark in circle | 80px | centered | #28A745

CONTENT:
├─ Heading: "Email Sent!" | H3 | 20px
├─ Message: "We sent a password reset link to user@example.com" | Body | 14px
├─ Highlight email: Bold in message
├─ Spacer: 24px

TIMER SECTION:
├─ "Resend link in 59 seconds" | 14px | centered | gray
├─ Countdown timer: Updates every second
├─ When timer expires:
│  └─ Show "Resend email?" link | 14px | #0066CC | clickable
└─ Spacer: 24px

INSTRUCTIONS:
├─ "What to do next:" | 12px | bold
├─ Steps (ordered list):
│  ├─ "Open the email from support@foodfinder.com"
│  ├─ "Click the reset link (valid for 24 hours)"
│  ├─ "Create your new password"
│  └─ "Log in with your new password"
└─ Each step: 12px | line-height 1.6

BUTTONS:
├─ Primary: "I've Reset My Password" | 48px | Full width | #FF6B35
├─ Secondary: "Didn't receive email?" | transparent
└─ Button spacing: 12px

FOOTER:
├─ Resend link option: "Resend Email" (appears after timer)
├─ Color: #0066CC | clickable | shows new timer
└─ Bottom safe area: 24px
```

**Step 3: New Password**

**Components:**
```
HEADER:
├─ Title: "Create New Password" | H2 | 24px
└─ Progress: "Step 3 of 3" | 12px | gray

FORM:
├─ New Password:
│  ├─ Label: "New Password"
│  ├─ Input: 48px | Full width
│  ├─ Placeholder: "At least 8 characters"
│  ├─ Show/hide toggle: Eye icon (right)
│  └─ Strength bar: Below input
│
├─ Confirm Password:
│  ├─ Label: "Confirm Password"
│  ├─ Input: 48px | Full width
│  ├─ Show/hide toggle: Eye icon (right)
│  └─ Validation: Match check
│
├─ Field spacing: 16px

PASSWORD REQUIREMENTS:
├─ Checklist (same as registration):
│  ├─ ☐ At least 8 characters
│  ├─ ☐ One uppercase letter
│  ├─ ☐ One number
│  └─ ☐ One special character
└─ Show real-time (green checkmarks when met)

BUTTONS:
├─ Primary: "Reset Password" | 48px | Full width | #FF6B35
├─ Disabled until all requirements met
└─ Loading state: Spinner when submitting

FOOTER:
├─ "Back to Login" link | 14px | #0066CC
└─ Bottom safe area: 24px
```

**Interactions:**
- Step 1: Enter email → button enables when valid → submit → Step 2
- Step 2: Timer counts down → After expiry, show "Resend email" link
- Step 2: "I've reset password" → Skip to Step 3 OR go to Step 3 automatically
- Step 3: Fill both passwords → Validate → Submit → Success screen

**Success States:**
```
After Step 3 completion:
├─ Show confirmation screen:
│  ├─ Checkmark icon | large | green
│  ├─ "Password Reset Successfully!" | H2
│  ├─ Message: "Your password has been updated. Log in with your new password."
│  └─ Button: "Go to Login" → Navigate to login screen
└─ Auto-redirect after 3 seconds (optional)
```

**Error Handling:**
```
Email not found:
├─ Show: "No account found with this email"
├─ Suggest: "Create account" link
└─ Color: #FFC107 (warning)

Link expired:
├─ Show: "Reset link expired. Please start over."
├─ Button: "Request new link" → Back to Step 1
└─ Message format: Alert box | red

Password mismatch:
├─ Show: "Passwords don't match"
├─ Below confirm field
└─ Color: #DC3545 (error)
```

---

### Screen 1.5: Onboarding / Preferences

**Purpose:** New users set preferences for personalized experience

**Layout:** Multi-step form, progressively request preferences

**Components:**

```
HEADER:
├─ Back arrow (optional) | top-left
├─ Title: "Personalize Your Experience" | H2 | 24px
├─ Subtitle: "Help us get to know your preferences" | 14px | gray
└─ Progress indicator: "Step X of 4" | 12px

STEP 1: CUISINE PREFERENCES

Question: "What cuisines do you love?"
Subtitle: "Select at least one (you can change this later)"

Multi-select chips layout:
├─ Chips arranged in rows (2-3 per row on mobile)
├─ Each chip: 80-100px width
├─ Chips list (scrollable horizontally if needed):
│  ├─ 🍝 Italian
│  ├─ 🍜 Asian
│  ├─ 🌮 Mexican
│  ├─ 🍱 Japanese
│  ├─ 🥘 Mediterranean
│  ├─ 🇮🇳 Indian
│  ├─ 🍔 American
│  ├─ 🥩 BBQ/Grill
│  ├─ 🌱 Vegetarian
│  └─ "See more" button for additional cuisines
│
├─ Selected chips:
│  ├─ Background: #FF6B35
│  ├─ Text: White
│  ├─ Icon: Checkmark (right side)
│  └─ Chip styling: 12px bold, 8px padding, border-radius 20px
│
├─ Unselected chips:
│  ├─ Background: #F7F7F7
│  ├─ Border: 1px solid #E0E0E0
│  ├─ Text: #333333
│  └─ Hover: Light shadow, slightly raised

Spacing:
├─ Between rows: 12px
├─ Between chips: 8px
└─ Around entire section: 16px

Navigation:
├─ "Skip" link (bottom left) | 12px | #999999 | optional
├─ "Next" button (bottom right) | 48px | Full width
└─ Disabled until at least 1 selected
```

**STEP 2: DIETARY RESTRICTIONS**

Question: "Any dietary restrictions?"
Subtitle: "We'll filter options for you (optional)"

Checkboxes layout:
├─ Each checkbox: 16×16px | Left-aligned
├─ List items (vertical):
│  ├─ ☐ Vegetarian
│  ├─ ☐ Vegan
│  ├─ ☐ Gluten-Free
│  ├─ ☐ Dairy-Free
│  ├─ ☐ Nut Allergy
│  ├─ ☐ Shellfish Allergy
│  ├─ ☐ Kosher
│  └─ ☐ Halal
│
├─ Checked state:
│  ├─ Checkbox: Checked | #FF6B35 color
│  ├─ Text: #333333 | bold
│  └─ Whole row: Light background highlight
│
├─ Line height: 1.8 (spacious)
├─ Spacing between items: 12px

Optional textarea:
├─ Label: "Other restrictions (optional)"
├─ Textarea: 80px height | Full width | 14px font
├─ Placeholder: "e.g., no mushrooms, low spice..."
├─ Border: 1px #E0E0E0 | border-radius 8px
└─ Character count: "0/100" | 10px | gray | bottom-right

Navigation:
├─ "Back" button | transparent style
├─ "Next" button | 48px | Full width
└─ No minimum required
```

**STEP 3: BUDGET PREFERENCE**

Question: "What's your typical budget?"
Subtitle: "This helps us recommend restaurants in your range"

Budget selector (visual slider or buttons):
├─ 4 options displayed as buttons or slider:
│
│ Option 1: "$"
│ ├─ Display: "$ • Budget-Friendly (Under $20)"
│ ├─ Description: "Street food, casual dining"
│ └─ Size: Full width | 56px height | Option 2-4 similar
│
│ Option 2: "$$"
│ ├─ Display: "$$ • Moderate ($20-50)"
│ ├─ Description: "Mid-range restaurants"
│ └─ Size: Full width | 56px height
│
│ Option 3: "$$$"
│ ├─ Display: "$$$ • Upscale ($50-100)"
│ ├─ Description: "Fine dining, special occasions"
│ └─ Size: Full width | 56px height
│
│ Option 4: "$$$$"
│ ├─ Display: "$$$$ • Luxury ($100+)"
│ ├─ Description: "Premium dining experiences"
│ └─ Size: Full width | 56px height

Button styling:
├─ Border: 2px solid #E0E0E0
├─ Unselected: White background | #333333 text
├─ Selected: #FF6B35 background | White text | checkmark
├─ Spacing: 12px between buttons
└─ Border-radius: 8px

Navigation:
├─ "Back" button | transparent
├─ "Next" button | 48px | Full width
└─ Enabled after selection
```

**STEP 4: LOCATION**

Question: "Where do you usually dine?"
Subtitle: "We'll show you nearby restaurants first"

Location input:
├─ Label: "City / Area"
├─ Input field: 48px | Full width
├─ Placeholder: "Enter city or neighborhood"
├─ Icon: Location pin (left) | 20px
├─ Search functionality:
│  ├─ Show dropdown with suggestions as user types
│  ├─ Top suggestions: Cities, popular areas
│  └─ Click to select
└─ Current location button (optional):
   ├─ Icon: GPS icon | 20px
   ├─ Text: "Use Current Location" (on button)
   └─ Requires location permission (handle gracefully)

Radius preference:
├─ Label: "Search Radius"
├─ Slider: Min 1km, Max 50km, Default 5km
├─ Display: "Show me restaurants within [X] km"
├─ Value display: "5 km" (updates as slider moves)
└─ Visual representation:
   ├─ Filled portion: #FF6B35
   ├─ Unfilled: #E0E0E0
   └─ Track height: 4px

Save location:
├─ Checkbox: "Save this as my primary location"
├─ Text: "You can add more locations in settings"
└─ Default: Checked

Navigation:
├─ "Back" button | transparent
├─ "Complete Setup" button | 48px | Full width | Primary color
└─ Enabled after location selected
```

**SUCCESS SCREEN (After Step 4)**

```
CELEBRATION:
├─ Checkmark icon | 96px | centered | #28A745
├─ Animation: Slight bounce/pop effect

CONTENT:
├─ Heading: "You're All Set!" | H2 | 24px | centered
├─ Message: "Your profile is ready. Start exploring amazing restaurants!" | 14px | centered | gray
├─ Spacer: 32px

CALL-TO-ACTION:
├─ Primary button: "Start Exploring" | 48px | Full width | #FF6B35
└─ On click: Navigate to home/dashboard

FEATURES HIGHLIGHT (Optional):
├─ 3-column grid (mobile: stacked):
│  ├─ Column 1:
│  │  ├─ Icon: AI/robot | 32px
│  │  ├─ Title: "AI Recommendations" | 14px bold
│  │  └─ Text: "Get personalized suggestions" | 12px
│  ├─ Column 2:
│  │  ├─ Icon: Calendar | 32px
│  │  ├─ Title: "Easy Bookings" | 14px bold
│  │  └─ Text: "Reserve tables instantly" | 12px
│  └─ Column 3:
│     ├─ Icon: Chat | 32px
│     ├─ Title: "AI Assistant" | 14px bold
│     └─ Text: "Ask anything about food" | 12px
└─ Spacing: 16px between columns, 24px margin vertical
```

**Interactions:**
- Step 1: Select at least 1 cuisine → Enable "Next"
- Step 2: Optional (no minimum) → "Next" always enabled
- Step 3: Select 1 budget → Enable "Next"
- Step 4: Enter location → Enable "Complete Setup"
- "Back" button → Go to previous step (keep selections)
- "Skip" link (Step 1) → Skip to success screen
- Success → Auto-navigate to home after 2 seconds or on button click

**Data Handling:**
- Save all preferences to Firebase user profile
- Allow editing in Account settings later
- Use for personalization algorithm

---

---

## EPIC 2: Chat Interface

### Overview
AI-powered chat for restaurant discovery, bookings, and recommendations.

**Screens in this epic:** 4
- 2.1: Main Chat Screen
- 2.2: Chat Empty State
- 2.3: Chat History
- 2.4: Quick Reply Suggestions

---

### Screen 2.1: Main Chat Screen

[Detailed specifications continue...]

---

*[Document continues with remaining screens: EPIC 2 (Chat) - 4 screens, EPIC 3 (Discovery) - 4 screens, EPIC 4 (Reservations) - 3 screens]*

---

# PART 3: IMPLEMENTATION GUIDE

## Component Library

**Buttons:**
- Primary Button
- Secondary Button
- Tertiary Button (text only)
- Button Loading States
- Button Disabled States
- Floating Action Button

**Inputs:**
- Text Input
- Email Input
- Password Input
- Search Input
- Select Dropdown
- Checkbox
- Radio Button
- Toggle Switch

**Navigation:**
- Bottom Tab Navigation
- Top Header
- Breadcrumb Navigation
- Sidebar (Desktop)

**Cards:**
- Restaurant Card
- Reservation Card
- Review Card
- Empty State Card

**Feedback:**
- Success Alert
- Error Alert
- Warning Alert
- Loading Indicator
- Skeleton Screen

---

## Validation Checklist

Before considering a screen complete:

- [ ] All text content finalized and reviewed
- [ ] All interactions documented
- [ ] All states (default, hover, active, disabled, loading, error) created
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Color contrast meets WCAG standards
- [ ] All buttons minimum 48px height (mobile)
- [ ] All touch targets minimum 48×48px
- [ ] Safe areas applied (PWA)
- [ ] Animations/transitions defined
- [ ] Error messages written
- [ ] Accessibility reviewed (keyboard navigation, screen readers)
- [ ] Performance considered (lazy loading, optimization)

---

## Next Steps

1. **Customize colors** if needed (update design system)
2. **Create Figma file** with these specifications
3. **Build component library** first (reusable elements)
4. **Implement screens** in order (foundation → authentication → main app)
5. **Test responsiveness** across breakpoints
6. **Get stakeholder feedback** before high-fidelity design
7. **Iterate** based on feedback

---

**Document Status:** Complete | Ready for Figma Implementation  
**Last Updated:** April 2026  
**Screens Specified:** 16 screens (5+4+4+3)  
**Components:** 50+ reusable components  
**Breakpoints:** 4 (mobile portrait, mobile landscape, tablet, desktop)