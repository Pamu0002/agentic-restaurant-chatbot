# AGENTDINE CUSTOMER WEB APPLICATION - UI DIAGRAM PROMPTS
**For Google Draw / Lucidchart / Figma - Complete Website Structure & Flows**

---

## 📐 HOW TO USE THESE PROMPTS

### **Tool Recommendations:**
1. **Google Draw** (Free) - https://draw.io
2. **Lucidchart** (Free trial) - https://lucidchart.com
3. **Figma** (Free) - https://figma.com
4. **Whimsical** (Free) - https://whimsical.com

### **For Each Diagram:**
1. Copy the prompt below
2. Open your drawing tool
3. Create a new diagram
4. Paste prompt into "AI Description" or "Template" if available
5. Or manually recreate following the detailed specifications

---

## 1️⃣ WIREFRAME: DASHBOARD LAYOUT (Main Page)

**Prompt:**
```
Create a wireframe diagram for the AgentDine customer dashboard layout showing:

LAYOUT STRUCTURE:
- Top: Fixed header bar (height 70px)
  * Left section (150px): Logo icon + "AgentDine" text
  * Center section (flexible): Search bar (min-width 200px, max 500px)
  * Right section (200px): Help button, Settings button, Chat toggle button

- Below header: Main container split into 2 sections
  * LEFT SECTION (70% width):
    - Scrollable content area
    - Welcome section (heading + subtext)
    - Featured restaurants section (3-column grid cards)
    - Filters section (horizontal chips)
    - "How it works" section (4 step cards)
    - Footer
  * RIGHT SECTION (30% width):
    - Fixed chat sidebar (420px)
    - Header: "Chef Assistant 🤖" + close button
    - Messages area (scrollable)
    - Input area (text box + send button)
    - Floating toggle button (when closed, positioned bottom-right)

COLORS:
- Header: Dark #1a1218
- Main content: Dark #0F1419
- Sidebar: Dark #16202f
- Accents: Orange #FF8C42

RESPONSIVE:
- Desktop (1440px): Both columns visible
- Tablet (1024px): Chat sidebar floats/toggles
- Mobile (768px): Single column, chat as overlay

Include annotations for:
- Fixed vs Scrollable sections
- Sidebar toggle behavior
- Close button placement
- Floating chat button position (bottom-right)
```

---

## 2️⃣ SITE MAP: COMPLETE NAVIGATION STRUCTURE

**Prompt:**
```
Create a hierarchical site map diagram for AgentDine customer portal showing:

ROOT: http://localhost:5173 (AgentDine Home)

TIER 1 - Authentication Pages:
├── /signup (Sign Up)
├── /signin (Sign In)
├── /auth/google-callback (OAuth Callback)
└── / (Welcome/Landing Page)

TIER 2 - Main Application Pages (After Authentication):
├── /chat (Chat Dashboard with sidebar)
│   ├── Main content: Welcome + Featured restaurants
│   └── Sidebar: Chat interface
├── /restaurants (Restaurant Discovery)
│   ├── Search & Filter page
│   └── Restaurant Details page
├── /bookings (My Bookings/Reservations)
│   ├── Upcoming bookings
│   └── Booking history
├── /profile (User Profile Settings)
│   ├── Personal Info
│   ├── Preferences
│   └── Account Settings
└── /reviews (Write/Read Reviews)

TIER 3 - Nested/Modal Pages:
├── /restaurants/{id} (Restaurant Details)
│   ├── Tabs: Overview, Menu, Reviews, Photos
│   └── CTA: View Menu, Reserve Table, Save
├── /booking/step1 (Booking - Date & Time)
├── /booking/step2 (Booking - Party Size)
├── /booking/step3 (Booking - Confirmation)
└── /checkout (Payment & Checkout)

CONNECTIONS:
- "/chat" → Click "Explore" → "/restaurants"
- "/restaurants" → Click card → "/restaurants/{id}"
- "/restaurants/{id}" → Click "Reserve" → "/booking/step1"
- "/booking/step*" → Progress through steps → "/checkout"
- "/checkout" → Success → "/bookings"
- All pages: Chat sidebar always accessible
- All pages: Header with search→ "/restaurants"

SHOW:
- Page nesting hierarchy
- Navigation flow arrows
- User journey paths (guest vs authenticated)
- Entry points (Welcome, Landing, Auth)
- Exit points (Sign Out, Browse anonymous)
```

---

## 3️⃣ USER JOURNEY FLOW: Guest to Customer

**Prompt:**
```
Create a user flow diagram showing the complete guest journey on AgentDine:

START: Landing Page (WelcomeScreen)
├── User sees: Welcome heading + 3 buttons (Sign Up, Sign In, Continue as Guest)
│
├─ PATH A: AUTHENTICATED USER
│  ├─ Click "Sign Up" → Sign Up page → Fill form → Dashboard (/chat)
│  └─ Click "Sign In" → Sign In page → Fill form → Dashboard (/chat)
│
└─ PATH B: GUEST USER (Focus on this)
   ├─ Click "Continue as Guest" → /chat dashboard
   │  └─ Shows: Main content + Chat sidebar
   │
   ├─ BROWSING PHASE:
   │  ├─ See featured restaurants
   │  ├─ Click filter chips (cuisine, location)
   │  ├─ Or: Use search bar → Restaurant Discovery page
   │  ├─ Or: Chat with Chef Assistant for recommendations
   │  └─ Click restaurant card → Restaurant Details page
   │
   ├─ DECISION PHASE:
   │  ├─ View restaurant: Details, Menu, Reviews, Photos
   │  ├─ Ask chat for recommendations
   │  └─ Decide to book
   │
   ├─ BOOKING PHASE (Requires Auth):
   │  ├─ Click "Reserve Table" → Redirect to Sign Up/Sign In
   │  ├─ After auth: → /booking/step1 (Date & Time)
   │  ├─ → /booking/step2 (Party Size & Notes)
   │  ├─ → /booking/step3 (Confirmation)
   │  └─ → /checkout (Payment)
   │
   └─ CONFIRMATION PHASE:
      ├─ Payment success → Confirmation page
      ├─ Show: Booking details + Confirmation code
      ├─ Options: Add to calendar, View booking, Explore more
      └─ Booking visible in /bookings page

ANNOTATION:
- Show decision points (diamonds)
- Show page screens (rectangles)
- Add CTA buttons along the flow
- Highlight authentication requirements
- Show chat assistance available at each step
- Color code: Blue (intro) → Orange (active) → Green (success)
```

---

## 4️⃣ PAGE LAYOUT: Landing Page (Welcome)

**Prompt:**
```
Create a detailed wireframe for the AgentDine Landing Page showing:

STRUCTURE (Split Screen):
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER (70px)                            │
│  Logo | Search Bar | Help | Settings | Chat Toggle              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     HERO SECTION (Full Width)                   │
│  ┌──────────────────────────┐  ┌──────────────────────────┐   │
│  │   Left Hero Content      │  │  Right Hero Image        │   │
│  │ • Heading               │  │  (Food Image/Illustration)  │   │
│  │ • Subheading            │  │  (600x500px)             │   │
│  │ • 3 Feature bullets     │  │                          │   │
│  │ • 2 CTA Buttons         │  │                          │   │
│  │ (50% width)             │  │  (50% width)             │   │
│  └──────────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│            TRUST SECTION (Stats Row)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ 1,250+   │  │ 42,000+  │  │ 98%      │                      │
│  │Restaurants   Reviews     │ Satisfied│                       │
│  └──────────┘  └──────────┘  └──────────┘                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│        FEATURED RESTAURANTS SECTION                              │
│  Title: "Trending in Colombo 🔥"                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │   Card 1   │  │   Card 2   │  │   Card 3   │               │
│  │ (Lagoon)   │  │  (Laksha)  │  │(Crab)      │               │
│  │ Image+Info │  │ Image+Info │  │ Image+Info │               │
│  │ Rating/CTA │  │ Rating/CTA │  │ Rating/CTA │               │
│  └────────────┘  └────────────┘  └────────────┘               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│            QUICK FILTERS SECTION                                │
│  Title: "Filter by Cuisine"                                    │
│  Chips: [Sri Lankan] [Seafood] [Italian] [Vegetarian] [Fusion]│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│          HOW IT WORKS SECTION (4 Steps)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Step 1   │  │ Step 2   │  │ Step 3   │  │ Step 4   │      │
│  │ Search   │  │ Details  │  │ Book     │  │ Enjoy    │      │
│  │ & Discover   │ Reviews  │  │ Table    │  │ & Review │      │
│  │ (Text)   │  │ (Text)   │  │ (Text)   │  │ (Text)   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘

COLORS:
- Hero BG: Dark #0F1419
- Text: White #ffffff
- Headings: Orange accents
- Buttons: Orange gradient #FF6B35-#FF8C42
- Card BG: #16202f

RESPONSIVE ANNOTATIONS:
- Desktop: All content visible, 2-column hero
- Tablet: Cards stack to 2 columns, hero stacks
- Mobile: Single column, all sections stack
```

---

## 5️⃣ PAGE LAYOUT: Restaurant Discovery (Search & Filter)

**Prompt:**
```
Create a detailed wireframe for the Restaurant Discovery page showing:

STRUCTURE (2-Column Layout):
┌────────────────────────────────────────────────────────────────┐
│                HEADER (Fixed, 70px)                             │
│ Logo | Search bar (70% width, sticky) | Help | Settings        │
└────────────────────────────────────────────────────────────────┘

┌─────────────────┬──────────────────────────────────────────────┐
│  LEFT SIDEBAR   │         RIGHT MAIN CONTENT AREA              │
│  (25%, fixed)   │         (70%, scrollable)                     │
│                 │                                              │
│ FILTERS:        │  Results Count: "23 restaurants"             │
│ ┌─────────────┐ │  Sort: [Relevance ▼]  [List/Grid toggle]   │
│ │ Location:   │ │                                              │
│ │ ☐Colombo    │ │  ┌──────────────────────────────────────┐ │
│ │ ☐Kandy      │ │  │  Restaurant List Card (full width)   │ │
│ │ ☐Galle      │ │  │  ┌─────┐ ┌──────────────────────┐   │ │
│ │ ☐Negombo    │ │  │  │     │ │ Name: Laksha        │   │ │
│ │ More ▼      │ │  │  │Image│ │ Cuisine: Sri Lankan │   │ │
│ └─────────────┘ │  │  │(160)│ │ Rating: ⭐4.9       │   │ │
│                 │  │  │     │ │ Distance: 2.3km     │   │ │
│ ┌─────────────┐ │  │  │     │ │ Price: $$           │   │ │
│ │ Cuisine:    │ │  │  └─────┘ │ Status: Open now ✓  │   │ │
│ │[Sri Lankan] │ │  │          │ Buttons:[Details][❤] │   │ │
│ │[Seafood]    │ │  └──────────────────────────────────────┘ │
│ │[Italian] +5 │ │                                              │
│ └─────────────┘ │  ┌──────────────────────────────────────┐ │
│                 │  │  Restaurant Card 2 (same layout)    │ │
│ ┌─────────────┐ │  │  ...                                │ │
│ │ Price:      │ │  └──────────────────────────────────────┘ │
│ │ $-$$$$      │ │                                              │
│ │ [────●─────] │ │  ┌──────────────────────────────────────┐ │
│ └─────────────┘ │  │  Restaurant Card 3 (same layout)    │ │
│                 │  │  ...                                │ │
│ ┌─────────────┐ │  └──────────────────────────────────────┘ │
│ │ Rating:     │ │                                              │
│ │ ⭐⭐⭐⭐   │ │  [Load More Restaurants button]            │
│ │ 4.0 & above │ │                                              │
│ └─────────────┘ │                                              │
│                 │                                              │
│ ┌─────────────┐ │                                              │
│ │ Dietary:    │ │                                              │
│ │ ☑Vegetarian │ │                                              │
│ │ ☐Vegan      │ │                                              │
│ │ ☐Gluten-Free│ │                                              │
│ └─────────────┘ │                                              │
│                 │                                              │
│ ┌─────────────┐ │                                              │
│ │[Apply]      │ │                                              │
│ │[Clear All]  │ │                                              │
│ └─────────────┘ │                                              │
└─────────────────┴──────────────────────────────────────────────┘

RIGHT SIDE (STICKY FAB):
- Filter button (toggles sidebar on mobile)
- Floating chat button (if sidebar closed on desktop)

RESPONSIVE:
- Desktop (1440px): 2-column layout fully visible
- Tablet (1024px): Sidebar toggles with button, chat floats
- Mobile (768px): Sidebar overlays, single column results
```

---

## 6️⃣ PAGE LAYOUT: Restaurant Details Page

**Prompt:**
```
Create a detailed wireframe for the Restaurant Details page showing:

STRUCTURE (Full Width):
┌────────────────────────────────────────────────────────────────┐
│              HEADER (Fixed, 70px)                               │
│ ← Back | Restaurant Name (Laksha) | Save ❤ | Share            │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                    HERO IMAGE (Full Width)                      │
│                  (500px height, image fill)                     │
│              Laksha Restaurant (high quality photo)            │
│         ┌─────────────────────────────────────────┐           │
│         │ Laksha                                  │           │
│         │ 🍲 Curry | 🌶️ Spicy | ♨️ Traditional  │           │
│         └─────────────────────────────────────────┘           │
│         (Dark overlay at bottom)                              │
└────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┬─────────────────────────┐
│  LEFT CONTENT AREA (65%)             │  RIGHT SIDEBAR (30%)    │
│  (Scrollable)                        │  (Sticky)               │
│                                      │                         │
│  INFO BAR (Sticky):                  │  BOOKING WIDGET:        │
│  ⭐4.9 (234 reviews) | 📍Colombo 3  │  ┌─────────────────┐  │
│  🕐 Open now | Price: $$ | [Reserve] │  │ Reserve Table   │  │
│                                      │  ├─────────────────┤  │
│  ABOUT SECTION:                      │  │ Date: [cal ▼]   │  │
│  Heading: "About Laksha"             │  │ Time: [11:00▼]  │  │
│  Description text...                 │  │ Guests: 1 2 3.. │  │
│  • Award-winning chef                │  │ Name: [______]  │  │
│  • Wood-fired preparation            │  │ Email:[______]  │  │
│  • Organic ingredients               │  │                 │  │
│                                      │  │ [Check Avail]   │  │
│  HOURS & LOCATION:                   │  │ [Reserve]       │  │
│  Mon-Fri: 11:00-23:00                │  └─────────────────┘  │
│  [See full hours] | 📍[View Map]     │                        │
│  Phone: +94 11 234 5678              │                        │
│                                      │                        │
│  AMENITIES:                          │                        │
│  WiFi ✓ | Parking ✓ | AC ✓          │                        │
│  Reservation ✓ | Rooms ✗             │                        │
│                                      │                        │
│  REVIEWS SECTION:                    │                        │
│  Title: "Reviews"                    │                        │
│  Rating breakdown:                   │                        │
│  5⭐ ▰▰▰▰▰ 200 (75%)                │                        │
│  4⭐ ▰▰▰░░ 100 (25%)                │                        │
│  3⭐ ▰░░░░ 20 (8%)                  │                        │
│                                      │                        │
│  Top reviews (2 shown):              │                        │
│  ┌────────────────────────────────┐ │                        │
│  │ Ahmed B | 2 weeks ago          │ │                        │
│  │ ⭐4.8 "Amazing authentic food!" │ │                        │
│  │ [👍 Helpful]                   │ │                        │
│  └────────────────────────────────┘ │                        │
│                                      │                        │
│  [See All Reviews]                   │                        │
│                                      │                        │
│  MENU PREVIEW:                       │                        │
│  Featured items (3 cards, h-scroll) │                        │
│  ┌───────┐ ┌───────┐ ┌───────┐    │                        │
│  │Lamprais│ │Kottu  │ │String │    │                        │
│  │Rs.850 │ │Rs.750 │ │Rs.600 │    │                        │
│  └───────┘ └───────┘ └───────┘    │                        │
│  [View Full Menu]                   │                        │
│                                      │                        │
└─────────────────────────────────────┴─────────────────────────┘

TAB NAVIGATION (below hero, sticky):
[Overview (active)] | [Menu] | [Reviews] | [Photos]

BOTTOM ACTION BAR:
┌────────────────────────────────────────────────────────────────┐
│         [Reserve a Table]            |  [View Full Menu]       │
└────────────────────────────────────────────────────────────────┘

RESPONSIVE:
- Desktop: 2-column layout
- Tablet: Single column, booking widget below content
- Mobile: Full-width, booking widget at top or bottom
```

---

## 7️⃣ BOOKING FLOW: 3-Step Process

**Prompt:**
```
Create a flowchart showing the 3-step booking process:

STEP-BY-STEP PROGRESSION:

┌─────────────────────────────────────────────────────────┐
│  STEP 1: DATE & TIME SELECTION (33% progress)         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Left (50%):                Right (35%):               │
│  ┌─────────────────────┐  ┌──────────────┐            │
│  │ Calendar Widget     │  │Summary:      │            │
│  │ Show next 30 days   │  │ Restaurant   │            │
│  │ Clickable dates     │  │ Laksha       │            │
│  │ Booked grayed       │  │ Rating: 4.9⭐ │            │
│  │ Selected: Orange    │  │              │            │
│  └─────────────────────┘  │ ✓ Apr 15     │            │
│                           │ Date selected │            │
│  Time Slots (grid):       │              │            │
│  [11:00][11:30][12:00].. │ ○ 19:00      │            │
│  Selected: Orange gradient │ Time: TBD    │            │
│  Booked: Strikethrough    │ Guests: TBD  │            │
│                           │              │            │
│                           │ [Continue]   │            │
│                           │ [Back]       │            │
│                           └──────────────┘            │
└─────────────────────────────────────────────────────────┘

Progress Bar: ▰▰░░░░░░░░ (33% orange)
Steps: 1 (active) | 2 | 3

┌─────────────────────────────────────────────────────────┐
│  STEP 2: PARTY SIZE & NOTES (66% progress)             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Left (50%):                Right (35%):               │
│  ┌─────────────────────┐  ┌──────────────┐            │
│  │ Party Size Buttons: │  │Summary:      │            │
│  │ [1] [2] [3] [4] [5] │  │ ✓ Apr 15     │            │
│  │ [6+]                │  │ ✓ 19:00      │            │
│  │ Selected [4]        │  │              │            │
│  │ (Orange gradient)   │  │ 👥 4 Guests  │            │
│  │                     │  │ (Updated)    │            │
│  │ Special Requests:   │  │              │            │
│  │ ┌──────────────────┐│  │ "Window seat │            │
│  │ │Window seat... 🎂 ││  │  if avail"   │            │
│  │ │(Textarea)      ││  │ (Notes shown) │            │
│  │ │50/250 chars  ││  │              │            │
│  │ └──────────────────┘│  │              │            │
│  │                     │  │ [Continue]   │            │
│  │ Quick chips:        │  │ [← Back]     │            │
│  │ [🎂Birthday]        │  │ [⊙ Cancel]   │            │
│  │ [🪟Window]          │  │              │            │
│  └─────────────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────┘

Progress Bar: ▰▰▰▰▰░░░░░░ (66% orange)
Steps: 1 ✓ | 2 (active) | 3

┌─────────────────────────────────────────────────────────┐
│  STEP 3: CONFIRMATION (100% progress)                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Left (60%):                                           │
│  ┌─────────────────────────────────────────┐          │
│  │ Confirmation Summary                    │          │
│  ├─────────────────────────────────────────┤          │
│  │ 📍 Restaurant: Laksha (Sri Lankan)      │          │
│  │ 📅 Date: Tuesday, April 15, 2026        │          │
│  │ ⏰ Time: 7:00 PM - 9:00 PM              │          │
│  │ 👥 Guests: 4 people                     │          │
│  │                                         │          │
│  │ Special Requests:                       │          │
│  │ "Window seat if available...."          │          │
│  │                                         │          │
│  │ Pricing:                                │          │
│  │ Booking Fee: Rs. 0 (FREE! 🎉)          │          │
│  │                                         │          │
│  │ Cancellation Policy:                    │          │
│  │ [Expand] Free cancellation up to 24hrs │          │
│  │                                         │          │
│  │ ☐ I agree to Terms and Policy          │          │
│  │ (Required) ✓                           │          │
│  │                                         │          │
│  │ [Confirm Reservation] [↓ Edit Details] │          │
│  └─────────────────────────────────────────┘          │
│                                                         │
│  Right (35% sidebar):                                  │
│  ┌──────────────────┐                                  │
│  │ Summary:         │                                  │
│  │ Restaurant:      │                                  │
│  │ Laksha ⭐4.9    │                                  │
│  │                  │                                  │
│  │ ✓ Apr 15, 2026   │                                  │
│  │ ✓ 7:00 PM        │                                  │
│  │ ✓ 4 guests       │                                  │
│  │                  │                                  │
│  │ Confirmation:    │                                  │
│  │ REST-ALC-ABZ9    │                                  │
│  │ (Copy button)    │                                  │
│  │                  │                                  │
│  │ Re: 24-hour      │                                  │
│  │ cancellation     │                                  │
│  └──────────────────┘                                  │
└─────────────────────────────────────────────────────────┘

Progress Bar: ▰▰▰▰▰▰▰▰▰▰ (100% orange - COMPLETE!)
Steps: 1 ✓ | 2 ✓ | 3 (active) ✓

SUCCESS STATE (After Confirmation):
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    ✓ CHECKMARK                         │
│              (Large, Green, Animated)                  │
│                                                         │
│      "Reservation Confirmed!"                          │
│     (Large heading, white)                             │
│                                                         │
│   Booking details summary shown                        │
│   Confirmation code: REST-ALC-ABZ9                     │
│                                                         │
│   [Add to Calendar] [View Booking] [Browse More]      │
│   [Book Another Restaurant]                           │
│                                                         │
│   "Confirmation email sent to ahmad@email.com ✓"      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 8️⃣ HEADER & NAVIGATION: Consistent Across All Pages

**Prompt:**
```
Create a detailed header navigation diagram showing:

FIXED HEADER (70px height, full width):
┌─────────────────────────────────────────────────────────────────┐
│ [🍽️ AgentDine] │        [Search restaurants...]🔍        │ ❓ ⚙️ 💬│
│  (Left 150px)  │        (Flexible, 200-500px wide)       │(Right)│
└─────────────────────────────────────────────────────────────────┘

LEFT SECTION (Logo/Brand):
- Icon: 🍽️ (32px)
- Text: "AgentDine" (18px, bold, orange)
- Width: 150px, flexbox column, centered

CENTER SECTION (Search):
- Container: Flexbox, center-aligned
- Input field: Dark background, white text
- Placeholder: "Search restaurants, cuisines, locations..."
- Icon (left): 🔍 (orange)
- Focus: Orange border
- Min-width: 200px
- Max-width: 500px

RIGHT SECTION (Actions):
- Help button: ❓ (20px, clickable)
  * Hover: Highlight orange background
- Settings button: ⚙️ (20px, clickable)
  * Hover: Highlight orange background
- Chat toggle (mobile): 💬 (20px, visible on mobile)
  * Shows when sidebar is closed

SPACING:
- Logo to search: 30px gap
- Search to actions: 30px gap
- Between actions: 15px gap

COLORS:
- Background: #1a1218
- Text: White #ffffff
- Icons: Orange #FF8C42 (on hover)
- Border: Orange rgba(255, 140, 66, 0.2)

RESPONSIVE:
- Desktop (1440px): All elements visible, search full width
- Tablet (1024px): Logo stays, search narrower, actions visible
- Mobile (768px): Logo icon only (text hidden), search hidden, actions only
- Small mobile (480px): Only logo icon + settings + chat toggle

STATES:
- Normal: Gray icons
- Hover: Orange highlighting
- Active: Orange filled background
- Disabled: Grayed out, cursor not-allowed

DROPDOWN MENUS (on click):
- Search results dropdown
- Settings menu (profile, logout)
- Help menu (FAQ, contact)
```

---

## 9️⃣ RESPONSIVE LAYOUT BREAKPOINTS

**Prompt:**
```
Create a responsive layout comparison diagram showing 4 breakpoints:

┌───────────────────────────────────────────────────────────────────────┐
│                      DESKTOP (1440px+)                                │
├─────────────────────────┬───────────────────────────────────────────┤
│   Chat Sidebar (420px)  │   Main Content (Full Flex)                │
│   • Fixed width         │   • Hero: Full width                       │
│   • Always visible      │   • Cards: 3 columns                       │
│   • No toggle           │   • Search: 2-column with sidebar          │
│                         │   • Restaurant details: 2-column           │
└─────────────────────────┴───────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                    TABLET (1024px - 1023px)                           │
├─────────────────────────┬───────────────────────────────────────────┤
│   Chat Toggle Button    │   Main Content (Full Flex)                │
│   • Floating chat icon  │   • Hero: Full width                       │
│   • Click to open       │   • Cards: 2 columns                       │
│   • Sidebar becomes     │   • Search: Single + toggle sidebar        │
│     full overlay        │   • Restaurant details: Full width         │
└─────────────────────────┴───────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│              MOBILE LANDSCAPE (768px - 767px)                         │
├─────────────────────────────────────────────────────────────────────┤
│ Header (60px) |  Main Content (Full Width)                           │
│               |  • Hero: Full width                                   │
│ Chat:         |  • Cards: 1 column (full width)                      │
│ • Overlay on  |  • Search results: Single column                     │
│   right side  |  • Restaurant details: Stacked                       │
│ • When open   |  • Booking: Single column form                       │
│ • Toggle: 💬  |                                                      │
│   (bottom-r)  |                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│           MOBILE PORTRAIT (376px - 480px)                             │
├─────────────────────────────────────────────────────────────────────┤
│ Header (50px, minimal) |  (Logo icon only)                            │
│ Main Content (100%)    |                                              │
│ • Hero: Full width     |  All content stacked vertically              │
│ • Cards: 1 column      |  • Featured cards: 100% width                │
│ • Search: Full width   |  • Booking form: 100% width, compact        │
│ • Forms: 100% width    |  • Details: Scrollable, full screen          │
│ • Buttons: Full width  |  • Chat: Full overlay when open              │
│ Chat Toggle:           |  • Toggle: Bottom-right corner               │
│ • Floating (💬) button |  • Large touch targets (48px min)            │
│ • Always accessible    |                                              │
└─────────────────────────────────────────────────────────────────────┘

KEY DIFFERENCES BY BREAKPOINT:

Desktop (1440px+):
✓ Sidebar visible (420px fixed)
✓ 3-column grids
✓ 2-column layouts
✓ Never toggled

Tablet (1024px-1439px):
→ Chat sidebar becomes toggle
→ Floating button appears
→ 2-column grids
→ Single column layouts with sidebar toggle

Mobile (768px-1023px):
→ Chat full overlay
→ 1-column layouts
→ Content reflows
→ No sidebar (overlay only)

Mobile Small (<768px):
→ Minimal header
→ All full-width
→ Largest touch targets
→ Simplified forms
→ No horizontal scrolling
```

---

## 🔟 CHATBOT SIDEBAR: Detailed Layout

**Prompt:**
```
Create a detailed diagram of the integrated chat sidebar showing:

SIDEBAR CONTAINER (420px width on desktop):
┌─────────────────────────────────────────────┐
│    HEADER (Sticky, 60px)                    │
│  ┌───────────────────────────────────────┐  │
│  │ 🤖 Chef Assistant | Online ●          │  │
│  │              [✕ Close]                │  │
│  └───────────────────────────────────────┘  │
│                                              │
│    MESSAGES AREA (Scrollable, flex-1)      │
│  ┌───────────────────────────────────────┐  │
│  │ Initial greeting:                     │  │
│  │ ┌─────────────────────────────────────┴──│
│  │ │ 🤖 "Hi! I'm Chef Assistant.         │  │
│  │ │    What are you looking for?"       │  │
│  │ │ 14:32                               │  │
│  │ │                                     │  │
│  │ │ Quick replies:                      │  │
│  │ │ [Find restaurant] [Check booking]   │  │
│  │ │ [View menu]                         │  │
│  │ └─────────────────────────────────────┬──│
│  │                                        │  │
│  │ User message (right-aligned):         │  │
│  │ ┌───────────────────────────────────┐│  │
│  │ │ "I want seafood in Colombo"   ✓✓ ││  │
│  │ │ 14:33                            ││  │
│  │ └───────────────────────────────────┘│  │
│  │                                        │  │
│  │ Bot response (left-aligned):          │  │
│  │ ┌───────────────────────────────────┐│  │
│  │ │ 🤖 "I found 23 seafood           ││  │
│  │ │    restaurants in Colombo!       ││  │
│  │ │    Top pick: The Lagoon ⭐4.8"  ││  │
│  │ │ 14:34                            ││  │
│  │ │                                   ││  │
│  │ │ [View Details] [See More]        ││  │
│  │ └───────────────────────────────────┘│  │
│  │                                        │  │
│  │ Typing indicator:                     │  │
│  │ ┌───────────────────────────────────┐│  │
│  │ │ Chef is typing... ● ● ●           ││  │
│  │ └───────────────────────────────────┘│  │
│  └───────────────────────────────────────┘  │
│                                              │
│    INPUT AREA (Sticky, 60px)                │
│  ┌───────────────────────────────────────┐  │
│  │ 🎤 [Text input........................]│  │
│  │    [Type message or use voice] [↓ Send]│  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

COMPONENT DETAILS:

Header:
- Logo: 🤖 (20px)
- Title: "Chef Assistant" (16px, bold white)
- Status: "Online" with green dot
- Close button: ✕ (24px, top-right)
- Background: Dark #1a1218

Messages:
- Bot messages: Left-aligned, dark bubble (#334155), orange left border
- User messages: Right-aligned, orange gradient bubble
- Timestamp: Light gray, 12px, below message
- Reactions: Clickable emoji buttons below message
- Links/Cards: Preview cards for restaurant suggestions

Quick Reply Buttons:
- Horizontal chips below bot message
- Dark background, orange text
- Click to insert message
- Auto-dismiss after selection

Input Area:
- Base: Dark #0F1419
- Text input: Placeholder text, white on focus
- Mic icon: Voice input button (orange)
- Send button: Orange gradient circle, arrow icon
- Disabled: Grayed out if input empty

BEHAVIOR:
- Auto-scroll to newest message
- Smooth fade-in for messages
- Typing indicator: 3 dots bouncing
- Read receipts: Double checkmark ✓✓
- Connection status: Green dot = Online
- Offline badge: "Working offline" if no connection

RESPONSIVE:
- Desktop: 420px fixed width sidebar
- Tablet/Mobile: Full-width overlay (0-100% width animation)
- Mobile: Takes full screen when open
- Close button always top-right
- Input always at bottom
```

---

## 1️⃣1️⃣ BOOKING CONFIRMATION EMAIL TEMPLATE

**Prompt:**
```
Create a wireframe of the booking confirmation email design:

EMAIL TEMPLATE (Width: 600px max):
┌─────────────────────────────────────────────────┐
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ 🍽️ AGENTDINE BOOKING CONFIRMATION       │  │
│  │                                          │  │
│  │ Hello Ahmed! 👋                         │  │
│  │ Your table at Laksha is confirmed ✓    │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                 │
│  📋 BOOKING DETAILS                            │
│  ┌──────────────────────────────────────────┐  │
│  │ Confirmation Code: REST-ALC-ABZ9         │  │
│  │ Restaurant: Laksha                       │  │
│  │ Cuisine: Sri Lankan Fusion ⭐ 4.9       │  │
│  │ Location: Colombo 3, Sri Lanka           │  │
│  │                                          │  │
│  │ 📅 Date: Tuesday, April 15, 2026         │  │
│  │ ⏰ Time: 7:00 PM - 9:00 PM              │  │
│  │ 👥 Party Size: 4 Guests                 │  │
│  │ 💰 No deposit required                  │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  📞 RESTAURANT CONTACT                         │
│  ┌──────────────────────────────────────────┐  │
│  │ Phone: +94 11 234 5678                  │  │
│  │ Address: Colombo 3, Sri Lanka            │  │
│  │ Website: www.laksha-restaurant.lk       │  │
│  │ Hours Today: 11:00 AM - 11:00 PM        │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  📌 SPECIAL REQUESTS                           │
│  "Window seat if available, Birthday"         │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                 │
│  ⚖️ CANCELLATION POLICY                        │
│  ✓ Free cancellation up to 24 hours before    │
│  ✓ No deposit - Pay at restaurant             │
│  ✓ Modify or cancel anytime in your bookings  │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                 │
│  [View Booking] [Modify] [Cancel]             │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                 │
│  Need help? Reply to this email or contact    │
│  support@agentdine.lk                         │
│                                                 │
│  © 2026 AgentDine. All rights reserved        │
│                                                 │
└─────────────────────────────────────────────────┘

COLORS:
- Background: White or very light gray
- Header BG: Dark #0F1419
- Accents: Orange #FF8C42
- Text: Dark gray for body, white for header
- Links: Orange #FF8C42, underlined

BUTTON STYLING:
- CTA buttons: Orange gradient background
- Link buttons: Orange text, underline
- All buttons: Responsive for mobile, full-width-ish

FONTS:
- Headers: Bold sans-serif, 18px+
- Body: Regular sans-serif, 14px
- Monospace for confirmation code: 16px, bold

RESPONSIVE:
- Mobile: Full-width, stack all content
- Desktop: Max 600px width, centered
- All images: 100% width, responsive scaling
```

---

## 1️⃣2️⃣ COMPONENT HIERARCHY & REUSABLE UI ELEMENTS

**Prompt:**
```
Create a component library diagram showing all reusable UI elements:

┌──────────────────────────────────────────────────────┐
│         AGENTDINE UI COMPONENT LIBRARY               │
└──────────────────────────────────────────────────────┘

BUTTONS:
┌─────────────────────────────────────┐
│ Primary Button (Orange Gradient)    │ 50px h
│ ┌─────────────────────────────────┐ │
│ │ [Reserve a Table]                │ │
│ │ ff6b35 → ff8c42                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Secondary Button (Outline)          │
│ ┌─────────────────────────────────┐ │
│ │ [View Details]                   │ │
│ │ Dark bg, orange border, orange   │ │
│ │ text                             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Danger Button (Red)                 │
│ ┌─────────────────────────────────┐ │
│ │ [Cancel Booking]                 │ │
│ │ Red #E63946, white text          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Small Button / Chip                 │
│ [Filter] [Favorite] [Save]         │
│ 32px h, various styles             │
└─────────────────────────────────────┘

CARDS:
┌─────────────────────────────────────┐
│ Restaurant Card (Featured)          │
│ ┌────────────────────────────────┐  │
│ │ [Image - 300x200px]            │  │
│ │ ⭐ 4.8 (top-right badge)       │  │
│ │ Restaurant Name                │  │
│ │ 🍲 Cuisine • Location          │  │
│ │ [View Details] [❤️ Save]       │  │
│ └────────────────────────────────┘  │
│ Hover: Lift shadow, scale image    │
│                                     │
│ Step Card (How It Works)            │
│ ┌────────────────────────────────┐  │
│ │ [1] (orange circle)            │  │
│ │ Step Title                      │  │
│ │ Description text...            │  │
│ └────────────────────────────────┘  │
│                                     │
│ Summary Widget / Info Box           │
│ ┌────────────────────────────────┐  │
│ │ Orange left border             │  │
│ │ Dark background (#16202f)      │  │
│ │ Multiple info lines, white text │  │
│ └────────────────────────────────┘  │
└─────────────────────────────────────┘

FORM ELEMENTS:
┌─────────────────────────────────────┐
│ Text Input                          │
│ 👤 [Full Name.............]|        │
│    Dark bg, orange focus, icon left│
│                                     │
│ Dropdown/Select                     │
│ [Select City ................... ▼] │
│    Shows: Colombo | Kandy | Galle  │
│                                     │
│ Date Picker                         │
│ [📅 Apr 15, 2026 .................]│
│    Calendar popup on click         │
│                                     │
│ Time Selector                       │
│ [⏰ 7:00 PM ................... ▼] │
│    or time slot buttons            │
│                                     │
│ Checkboxes / Radio Buttons         │
│ ☑️ Vegetarian                       │
│ ☐ Vegan                             │
│ ☐ Gluten-Free                       │
│    Orange checkmark                │
│                                     │
│ Text Area                           │
│ ┌──────────────────────────────┐   │
│ │ Special requests...          │   │
│ │                              │   │
│ │                    0/250     │   │
│ └──────────────────────────────┘   │
│    Dark bg, orange focus           │
└─────────────────────────────────────┘

BADGES & LABELS:
┌─────────────────────────────────────┐
│ Status Badge:                       │
│ ✓ Confirmed (green)                │
│ ⊙ Pending (orange)                 │
│ ✕ Cancelled (red)                  │
│ ◯ Full (gray)                       │
│                                     │
│ Cuisine Label:                      │
│ 🍲 Sri Lankan | 🦐 Seafood         │
│ Orange background, white text      │
│                                     │
│ Premium Badge:                      │
│ 👑 Premium | ⭐ Top Rated           │
│ Gold background                    │
│                                     │
│ Info Tag:                           │
│ "Open now" | "Fully Booked"        │
│ Green/red pill-shaped              │
└─────────────────────────────────────┘

NAVIGATION:
┌─────────────────────────────────────┐
│ Tab Navigation:                     │
│ [Overview] | [Menu] | [Reviews]    │
│  (active tab: white text, orange   │
│   underline, 4px bottom border)    │
│                                     │
│ Breadcrumb:                         │
│ Home > Restaurants > Laksha        │
│ (clickable links, orange on hover) │
│                                     │
│ Pagination:                         │
│ < 1  2  3  4  5 >                  │
│   (active = orange background)     │
│                                     │
│ Progress Bar:                       │
│ Step 1: ▰▰░░░░░░░░ (33% orange)   │
│ Step 2: ▰▰▰▰▰░░░░░░ (66%)         │
│ Step 3: ▰▰▰▰▰▰▰▰▰▰ (100%)         │
└─────────────────────────────────────┘

CHAT COMPONENTS:
┌─────────────────────────────────────┐
│ Message Bubble (Bot):               │
│ ┌─────────────────────────────────┐ │
│ │ | "Hi! How can I help?" ⏱14:32  │ │
│ │ [Quick reply chips below]        │ │
│ └─────────────────────────────────┘ │
│ Left-aligned, dark bg, orange border│
│                                     │
│ Message Bubble (User):              │
│ ┌─────────────────────────────────┐ │
│ │ "Show me seafood" ✓✓              │ │
│ │ 14:33                            │ │
│ └─────────────────────────────────┘ │
│ Right-aligned, orange gradient     │
│                                     │
│ Quick Reply Chip:                   │
│ [Find restaurant] [Check booking]  │
│ Dark bg, orange text, clickable    │
└─────────────────────────────────────┘

MODALS & OVERLAYS:
┌─────────────────────────────────────┐
│ Modal Container:                    │
│ ┌─────────────────────────────────┐ │
│ │ Modal Title              [✕]    │ │
│ │ ─────────────────────────────── │ │
│ │ Modal Content...                │ │
│ │                                 │ │
│ │        [Primary] [Secondary]    │ │
│ └─────────────────────────────────┘ │
│ Dark overlay, white modal, centered│
│                                     │
│ Toast Notification:                │
│ ┌─────────────────────────────────┐ │
│ │ ✓ Booking confirmed!            │ │
│ └─────────────────────────────────┘ │
│ Green bg, position: bottom-right   │
└─────────────────────────────────────┘

SIZES & SPACING:
- Button height: 50px (primary), 40px (secondary), 32px (small)
- Card padding: 20px-30px
- Border radius: 12px (cards), 8px (inputs), 20px (chips)
- Icon size: 20px-28px
- Text: 14-16px (body), 18-24px (headings)
- Gap between elements: 12px (tight), 20px (normal), 40px (large)

COLOR TOKENS:
Primary: #FF6B35, #FF8C42
Secondary: #E63946
Accent: #FFD700, #FFB84D
Success: #2ecc71
BG: #0F1419
Card BG: #16202f
Text: #ffffff
Text Light: #b0b8c1
Border: rgba(255, 140, 66, 0.3)
```

---

## 📊 COMPLETE INFORMATION ARCHITECTURE

**Prompt:**
```
Create a comprehensive information architecture (IA) diagram for AgentDine:

ORGANIZATION STRUCTURE:

┌─ Authentication Zone
│  ├─ Landing Page (/)
│  ├─ Sign Up (/signup)
│  ├─ Sign In (/signin)
│  └─ OAuth Callback (/auth/google-callback)
│
├─ Main Application Zone
│  │
│  ├─ Chat Dashboard (/chat)
│  │  ├─ Featured Restaurants Section
│  │  ├─ Quick Filters
│  │  ├─ How It Works Guide
│  │  └─ Chat Sidebar (Always Accessible)
│  │
│  ├─ Restaurant Discovery (/restaurants)
│  │  ├─ Search & Filter Page
│  │  │  ├─ Location Filter
│  │  │  ├─ Cuisine Filter
│  │  │  ├─ Price Range Slider
│  │  │  ├─ Rating Filter
│  │  │  └─ Results List
│  │  │
│  │  └─ Restaurant Details (/restaurants/{id})
│  │     ├─ Hero Image Section
│  │     ├─ Info Bar (Rating, Hours, Phone)
│  │     ├─ Overview Tab
│  │     ├─ Menu Tab
│  │     ├─ Reviews Tab
│  │     ├─ Photos Tab
│  │     └─ Booking Widget (Sidebar)
│  │
│  ├─ Booking Flow (/booking)
│  │  ├─ Step 1: Date & Time (/booking/step1)
│  │  ├─ Step 2: Party Size & Notes (/booking/step2)
│  │  ├─ Step 3: Confirmation (/booking/step3)
│  │  └─ Checkout (/checkout)
│  │
│  ├─ My Bookings (/bookings)
│  │  ├─ Upcoming Tab
│  │  ├─ Completed Tab
│  │  └─ Cancelled Tab
│  │
│  ├─ User Profile (/profile)
│  │  ├─ Personal Information
│  │  ├─ Dietary Preferences
│  │  ├─ Favorite Cuisines
│  │  ├─ Saved Restaurants
│  │  ├─ Notifications Settings
│  │  ├─ Payment Methods
│  │  └─ Account & Security
│  │
│  ├─ Reviews Section (/reviews)
│  │  ├─ Rate Restaurant
│  │  ├─ View Reviews
│  │  └─ Write Review
│  │
│  └─ Settings (/settings)
│     ├─ General Settings
│     ├─ Privacy Settings
│     └─ Help & Support
│
├─ Persistent Elements (On All Pages)
│  ├─ Fixed Header
│  │  ├─ Logo/Brand
│  │  ├─ Search Bar
│  │  └─ Help/Settings/Chat Buttons
│  │
│  ├─ Chat Sidebar
│  │  ├─ Chef Assistant Bot
│  │  ├─ Message Area
│  │  └─ Input Area
│  │
│  └─ Footer (if integrated)
│     ├─ Links
│     ├─ Contact Info
│     └─ Legal

CONTENT HIERARCHY:
Level 1: Main sections (Auth, App)
Level 2: Feature areas (Restaurants, Bookings, Profile)
Level 3: Specific pages (/restaurants, /restaurants/{id})
Level 4: Components (Filters, Cards, Forms)
Level 5: UI Elements (Buttons, Inputs, Labels)

DATA RELATIONSHIPS:
User → Restaurants (1:Many browsing)
User → Bookings (1:Many)
User → Reviews (1:Many)
Restaurant → Menu Items (1:Many)
Restaurant → Reviews (1:Many)
Booking → Restaurant (Many:1)
Booking → User (Many:1)

NAVIGATION FLOWS:
Primary: Chat → Discover → Details → Booking → Confirmation
Secondary: Profile → My Bookings → View Booking → Modify/Cancel
Tertiary: Search Bar anywhere → Restaurant Discovery → Results
Discover Path: Chat widgets quick actions → Specific pages

SEARCH & DISCOVERABILITY:
Global search (header): Restaurants, cuisines, locations
Filters (discovery): Location, cuisine, price, rating, dietary
Quick shortcuts: Chat quick replies, featured cards
Tags & labels: Cuisine tags, dietary info, status badges
```

---

## 🎯 USER INTERACTION PATTERNS

**Prompt:**
```
Create a diagram showing all user interaction patterns and states:

INTERACTION PATTERNS:

1. HOVER STATES:
   ┌─────────────────────────────┐
   │ Before hover:               │
   │ [Button] (gray outline)    │
   │                             │
   │ On hover:                   │
   │ [Button] (orange glow)     │
   │ • Slightly taller shadow    │
   │ • Color intensifies         │
   │ • Cursor: pointer           │
   │                             │
   │ Cards: Image scales 1.05x   │
   └─────────────────────────────┘

2. CLICK/ACTIVE STATES:
   ┌─────────────────────────────┐
   │ On click:                   │
   │ [Button] → Pressed          │
   │ • Scale: 0.98x              │
   │ • Shadow: More pronounced   │
   │ • Feedback visible          │
   │                             │
   │ Tab selection:              │
   │ [Active Tab] → Orange line  │
   │ [Inactive] → Gray           │
   └─────────────────────────────┘

3. LOADING STATES:
   ┌─────────────────────────────┐
   │ Button loading:             │
   │ [Searching...] (spinner)   │
   │ • Text changes              │
   │ • Orange spinner icon       │
   │ • Button disabled           │
   │                             │
   │ Page loading:               │
   │ Skeleton placeholders       │
   │ • Gray animated boxes       │
   │ • Same layout as content    │
   │ • Smooth fade-in to content │
   └─────────────────────────────┘

4. SUCCESS STATES:
   ┌─────────────────────────────┐
   │ Form validation:            │
   │ ✓ Email address valid       │
   │ ✓ Password meets requirement │
   │ (Green checkmarks appear)   │
   │                             │
   │ Action success:             │
   │ ✓ Toast notification from   │
   │   top or bottom             │
   │ • Green bg, white text      │
   │ • Auto-dismiss after 3s     │
   │                             │
   │ Booking confirmation:       │
   │ ✓ Large checkmark animation │
   │ • Scale up bouncy effect    │
   │ • Green color               │
   └─────────────────────────────┘

5. ERROR STATES:
   ┌─────────────────────────────┐
   │ Form validation error:      │
   │ ✕ Email not valid          │
   │ (Red text, shake animation) │
   │                             │
   │ API error:                  │
   │ ✕ Something went wrong     │
   │ • Red toast notification    │
   │ • Error icon (red)          │
   │ • [Retry] button option     │
   │                             │
   │ No results:                 │
   │ ⊙ No restaurants found      │
   │ • Helpful suggestion text   │
   │ • [Clear filters] button    │
   └─────────────────────────────┘

6. DISABLED STATES:
   ┌─────────────────────────────┐
   │ Button disabled:            │
   │ [Reserve] (grayed out)      │
   │ • Opacity: 0.5              │
   │ • Cursor: not-allowed       │
   │ • No hover effect           │
   │                             │
   │ Read-only input:            │
   │ [Email: user@example.com]   │
   │ • Gray background           │
   │ • No cursor                 │
   │ • Can select/copy           │
   └─────────────────────────────┘

7. FOCUS STATES (Keyboard Nav):
   ┌─────────────────────────────┐
   │ Focused button:             │
   │ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ┐       │
   │ │ [Reserve] (focus)│       │
   │ └ ─ ─ ─ ─ ─ ─ ─ ─ ┘       │
   │ • Orange outline: 2px       │
   │ • Tab order: Left to right  │
   │ • Enter/Space: Activate     │
   │                             │
   │ Accessible links:           │
   │ [Link](focus outline)       │
   │ • Visible focus indicator   │
   │ • Min 4px outline           │
   └─────────────────────────────┘

8. SCROLL & INFINITE LOAD:
   ┌─────────────────────────────┐
   │ Page scrolls:               │
   │ • Smooth scroll animation   │
   │ • Header stays fixed        │
   │ • Sidebar stays fixed       │
   │                             │
   │ Reached bottom:             │
   │ [Load More Restaurants]     │
   │ • Or infinite auto-load     │
   │ • Skeleton cards appear     │
   │ • New items fade in         │
   └─────────────────────────────┘

9. MODAL & OVERLAY:
   ┌─────────────────────────────┐
   │ Before modal:               │
   │ Background visible          │
   │                             │
   │ Modal opens:                │
   │ • Dark overlay (30% opacity)│
   │ • Fade in 0.3s animation    │
   │ • Modal slides up/appears   │
   │ • Body scroll disabled      │
   │                             │
   │ Closing:                    │
   │ • Fade out animation        │
   │ • Click outside to close    │
   │ • ESC key to close          │
   └─────────────────────────────┘

10. RESPONSIVE TRANSITIONS:
    ┌─────────────────────────────┐
    │ Resize window:              │
    │ • Layout reflows smoothly   │
    │ • No content shift jumps    │
    │ • Sidebar toggle appears    │
    │ • Chat sidebar collapses    │
    │                             │
    │ Orientation change:         │
    │ • Portrait ↔ Landscape     │
    │ • Content reorganizes       │
    │ • No horizontal scroll      │
    └─────────────────────────────┘

ANIMATION TIMING:
- Hover effects: 0.2s ease
- Click/Active: 0.1s ease
- Transitions: 0.3s ease
- Modals: 0.3s ease
- Loading spinner: 1.5s infinite
- Success animation: 0.5s bounce
- Scroll: Smooth, auto
- Fade in/out: 0.2-0.3s
```

---

## 📝 SUMMARY: DRAWING TIPS FOR GOOGLE DRAW / LUCIDCHART

### **Best Practices:**
1. **Use Templates**: Wireframe, flowchart, or diagram templates
2. **Color Coding**: Match exact brand colors (#FF8C42, #E63946, etc.)
3. **Annotations**: Add notes for component behavior
4. **Responsive Views**: Show 3-4 breakpoints side-by-side
5. **Interactive Elements**: Use arrows and annotations for flows
6. **Grid Alignment**: Use snap-to-grid for clean layouts
7. **Consistency**: Repeat same component shapes/sizes
8. **Labels**: Clear text for every section/element
9. **Legend**: Define what each color/shape means
10. **Export**: Save as PNG/PDF for sharing

---

**Ready to create diagrams with Google Draw! 🎨**
