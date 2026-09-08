# AGENTDINE PROGRESSIVE WEB APP - UI DESIGN PROMPTS FOR MAGIC PATTERNS
**Sri Lankan Restaurant Discovery Platform**

---

## 🎨 COLOR PALETTE (For All Designs)
```
Primary Orange: #FF6B35 → #FF8C42 (Gradient)
Secondary Red: #E63946
Gold Accent: #FFD700, #FFB84D
Deep Dark Background: #0F1419, #1a1218
Text Primary: #ffffff
Text Secondary: #b0b8c1, #505a6a
Border: rgba(255, 140, 66, 0.3)
```

---

## 📱 PWA DESIGN PRINCIPLES
- **Mobile-First**: Optimize for phones 375px-480px width
- **App Shell Architecture**: Header stays fixed, content scrolls
- **Offline Support Indicator**: Show "Working offline" badge when needed
- **Install Prompt**: "Add to Home Screen" button visible
- **Fast Load**: Show skeleton screens while loading

---

## 1️⃣ PWA SPLASH SCREEN & APP SHELL
**Prompt:**
```
Design a Progressive Web App splash screen and app shell for "AgentDine" - Sri Lankan restaurant discovery.

Splash Screen (shown on app load):
- Full screen (375x812px mobile)
- Dark background #0F1419 with food image overlay
- AgentDine logo (white/orange) centered
- Loading indicator (3 animated dots in orange #FF8C42)
- "Loading your restaurants..." text below logo
- Bottom badge: "Works Offline 🔄"

App Shell (persistent layout):
- Fixed header (56px height): AgentDine logo (left), search icon (right, orange circle background)
- Fixed bottom navigation bar (56px):
  * Home icon (🏠) - active shown in orange #FF8C42
  * Search icon (🔍) - gray when inactive
  * Bookings icon (📅) - badge shows "2" new bookings in red #E63946
  * Profile icon (👤) - gray when inactive
  * Each icon: 24px, white/orange
  * Active indicator: Orange line above icon
- Main content area scrolls between header and nav

Status indicator (top-left after logo):
- Green dot: "Online" 
- Gray dot: "Offline" with text "Syncing..."

Responsive: Adapts to 375px (mobile), 768px (tablet), desktop
Smooth transitions between nav items
```

---

## 2️⃣ HOME PAGE (PWA - Mobile First)
**Prompt:**
```
Design the PWA home page for AgentDine, optimized for mobile (375px width).

Header: Fixed, dark (#1a1218), app shell header with AgentDine logo, offline badge if needed

Content area (scrollable):
- Install banner (if not installed):
  * "Add AgentDine to your home screen" 
  * Icon: App icon on left (50x50px, orange border)
  * Buttons: "Add" (orange gradient), "Not now" (dismiss X)
  * Background: Dark with orange border, dismissible

- Hero section:
  * Large greeting: "Hi [Name]! 👋"
  * Subtext: "What's your craving in [Current City]?" 
  * Current location shown with 📍 pin icon in orange #FF8C42
  * "Change location" link below in light gray

- Quick cuisines (horizontal scroll):
  * Card design: 90x100px each, rounded corners
  * Shows: 🍕 Pizzeria | 🍜 Curry House | 🧆 Vegan | 🦐 Seafood | 🌮 Fusion
  * Tap to filter by cuisine
  * Underline shows selected in orange

- Featured restaurants section:
  * Title: "Trending in Colombo 🔥" (orange fire icon)
  * 3 vertical cards (335x200px images):
    - "The Lagoon Colombo" (Seafood restaurant) - Rating ⭐4.8
    - "Laksha" (Sri Lankan) - Rating ⭐4.9
    - "Ministry of Crab" (Seafood) - Rating ⭐4.8
  * Each card: Image, name, cuisine tags (orange labels), rating (gold ⭐)
  * Tap to view details

- "Need help?" section:
  * Large blue button with AI icon: "Chat with Chef Assistant 🤖"
  * Leads to floating chat widget (orange gradient)

- Tabs below featured: "Near You" | "Your Saved" | "Popular"

Bottom: Fixed navigation as per app shell

Skeleton loading state for images (gray placeholder with animation)
Pull-to-refresh gesture support (down swipe shows spinner)
```

---

## 3️⃣ SEARCH & DISCOVER PAGE (PWA)
**Prompt:**
```
Design the search/discovery page for AgentDine PWA, mobile-optimized.

Header: Search bar at top (sticky):
- Input field: "Search restaurants, cuisines..." (dark background, orange focus border)
- Search icon (orange) on left
- Voice icon on right (mic button, orange)

Content sections (scrollable):

1. Recent Searches (if user has searched before):
  - Small horizontal chips: "Italian Colombo" | "Vegan Kandy" | "Seafood Galle"
  - Tap to repeat search
  - X button to clear (red #E63946)

2. Location filter:
  - Horizontal scroll list showing: Colombo | Kandy | Galle | Negombo | Ella | Mirissa
  - Current location highlighted in orange gradient
  - Shows icon + city name
  - Tap to change location

3. Filter chips (horizontal scroll):
  - "Vegetarian" (with leaf 🌿)
  - "Vegan" 
  - "Seafood" (🦐)
  - "Budget-friendly" (💰)
  - "Luxury" (👑)
  - Active filter: orange background, white text
  - Inactive: dark background, orange text

4. Results count:
  - "23 restaurants match your search"
  - "Sort by: Distance | Rating | Newest" (dropdown, orange text)

5. Restaurant results (vertical cards, 335px wide):
  - Card shows: Image | Name | Cuisine | Rating ⭐ (gold) | Distance 📍 | Price level ($$$)
  - Example: "Laksha" - Sri Lankan | ⭐4.9 | 2.3km | $$ 
  - Tap card to view details
  - Skeleton loader for images

6. Empty state (if no results):
  - Message: "No restaurants found in [Location] for [Filters]"
  - Suggestion: "Try different filters or location"
  - Button: "Browse all restaurants" (orange)

Bottom: Floating action button (FAB):
- Orange gradient circle button
- Location/filter icon
- "Adjust filters" on tap opens side panel

App shell navigation at bottom
```

---

## 4️⃣ RESTAURANT DETAILS PAGE (PWA)
**Prompt:**
```
Design restaurant details page for PWA, stack all content vertically for mobile.

Hero image section:
- Full-width image (375x220px): "Laksha" restaurant
- Back button (white arrow, top-left, semi-transparent overlay)
- Save/favorite button (red heart #E63946, top-right)
- Image has gradient overlay at bottom (dark fade)

Restaurant info card (overlaps image slightly):
- Name: "Laksha" (large, white, bold)
- Cuisine: "Sri Lankan, Fusion" (orange labels #FF8C42)
- Rating: ⭐4.9 (323 reviews) - gold star #FFD700
- Location: 📍 "Colombo 3, Sri Lanka"

Quick info badges:
- 💰 Price: "$$" 
- ⏱️ "Avg: 45 mins"
- 📞 Phone: +94 11 234 5678 (tappable)
- 🕐 "Open now" (green badge)

Tabs (horizontal scroll, orange underline for active):
- Overview (default)
- Menu
- Reviews
- Photos

OVERVIEW TAB:
- Description paragraph
- Hours today section showing time slots
- Full address with "Open Maps" button (orange outline)
- Facilities listed: WiFi ✓ | Parking ✓ | AC ✓ | Reservation ✓

MENU TAB:
- Category headings: "Appetizers" | "Mains" | "Desserts" | "Beverages"
- Each item card:
  * Small image (60x60px)
  * Name: "Lamprais" 
  * Description: "Rice baked in banana leaf" (gray text)
  * Price: "Rs. 850" (orange text)
  * Dietary tags: 🌶️ Spicy | 🥬 Vegetarian option available

REVIEWS TAB:
- Star breakdown bar (5⭐ 200 | 4⭐ 100 | 3⭐ 20 | 2⭐ 2 | 1⭐ 1) - bars in orange
- Top reviews listed:
  * User avatar + name + date
  * ⭐4.8 rating
  * Review text: "Amazing authentic Sri Lankan food!"
  * "Helpful" button (gray)

CTA SECTION (sticky at bottom or full-width):
- Large button: "Reserve a Table" (orange gradient #FF6B35-#FF8C42, full width)
- Secondary: "Call Restaurant" (dark outline, full width)

App shell at bottom
```

---

## 5️⃣ BOOKING/RESERVATION PAGE (PWA)
**Prompt:**
```
Design the reservation flow for PWA, step-by-step form.

Header: "Book Laksha" | Progress: "Step 1 of 3" (orange progress bar shows 33%)

STEP 1: Date & Time
- Calendar picker showing next 7 days:
  * Days shown with dates
  * Selected date highlighted in orange #FF8C42
  * Grayed out if fully booked
  * Today marked with blue indicator

- Time slots section:
  * "Select time" heading
  * Time slots in 30-min intervals: 11:00 | 11:30 | 12:00 | 12:30 | etc.
  * Each slot: Small button, gray background normally
  * Selected time: Orange gradient background, white text
  * Booked time: Gray, strikethrough text, disabled
  * Shows availability: "1 table available" in light gray

- "Continue" button (orange gradient, full width)
- "Back" button (gray outline, full width)

STEP 2: Party Size & Details
- Party size selector:
  * "How many guests?" heading
  * Large buttons: 1 | 2 | 3 | 4 | 5 | 6+ 
  * Selected: Orange gradient, white text
  * Unselected: Dark background, white text

- Special requests text area:
  * Placeholder: "Window seat if available, Birthday celebration, Dietary needs..."
  * Character count: "0/200" (light gray)
  * Focus state: Orange border

- "Continue" button (orange gradient, full width)

STEP 3: Confirmation
- Summary box (dark background, orange border):
  * Restaurant: "Laksha" (bold white)
  * Date & Time: "📅 April 15, 2026 | ⏰ 19:00" (white)
  * Party Size: "👥 4 Guests" (white)
  * Special Notes: "Window seat if available" (light gray, italic)

- Note: "Rs. 0 - Reservation is FREE! 🎉"
- Cancellation policy: "Can cancel up to 24 hours before reservation"

Buttons:
- "Confirm Reservation" (orange gradient, full width, bold)
- "Edit Details" (dark outline, full width)

Success state (after confirmation):
- ✅ Checkmark animation
- "Reservation Confirmed!" heading
- Confirmation details in box
- Confirmation code: "REST-ABC123DEF" (copyable, orange text)
- "Add to Calendar" button (orange outline)
- "View Booking" button (orange gradient)
- "Book Another" button (gray)

App shell navigation
```

---

## 6️⃣ MY BOOKINGS PAGE (PWA)
**Prompt:**
```
Design "My Bookings" section for PWA, showing reservation history.

Header: "My Bookings" | Tabs: "Upcoming" (active, underline orange) | "Past"

UPCOMING RESERVATIONS:
- Booking card (full width):
  * Top section: Restaurant image (80x80px circle, left) | Restaurant name "Laksha" (bold white)
  * Date/Time: "📅 Apr 15 | ⏰ 19:00" (white)
  * Party size: "👥 4 guests" (light gray)
  * Status: Green badge "Confirmed ✓"
  * Action buttons on tap: 
    - "View Details" (white text, dark background)
    - "Modify" (orange outline)
    - "Cancel" (red outline #E63946)
  * Swipe left: Reveals "Cancel" button in red
  * Countdown: "🕐 5 days away" (orange text)

- Multiple cards stacked vertically

- Empty state if no upcoming:
  * Icon: 📅
  * "No upcoming reservations"
  * Button: "Explore & Book" (orange gradient)

PAST RESERVATIONS TAB:
- Booking card (similar to above but grayed out):
  * Status: "Completed ✓" or "Cancelled" (red)
  * Action button: "Leave Review" (orange) if completed
  * Review star rating shown if already reviewed
  * Button: "Book Again" (orange outline)

Floating chat button (orange, bottom-right):
- For assistance with bookings

App shell navigation
```

---

## 7️⃣ FLOATING CHAT WIDGET (PWA - Bottom Right)
**Prompt:**
```
Design the AI Chef Assistant floating chat widget for PWA.

Collapsed State:
- Circular button (60px diameter): Positioned bottom-right
- Gradient: Orange (#FF6B35 to #FF8C42)
- Icon: 💬 (chat bubble emoji)
- Border: Subtle orange glow effect
- Badge (if unread): Red dot with number in top-right corner (red #E63946)
- Shadow: 0 4px 20px rgba(255, 107, 53, 0.4)

Expanded State (tap to open):
- Chat window slides up from bottom
- Header bar (dark #1a1218):
  * "Chef Assistant 🤖" (white text)
  * Status: "Online" with green dot
  * Minimize button: "_" (underscore, white)
  * Close button: "✕" (X, white)

- Chat area (scrollable, dark background #0F1419):
  * Bot messages (left side):
    - Dark bubble (#334155) with orange left border (3px)
    - White text
    - Example: "Hi! I'm Chef Assistant. What are you looking for?" 
    - Timestamp below message (light gray, small)
  
  * User messages (right side):
    - Orange gradient bubble (#FF6B35-#FF8C42)
    - White text
    - Rounded on left, flat on right
    - Timestamp below

  * Quick reply chips (below bot message):
    - Small horizontal buttons: "Find restaurant" | "Make booking" | "Help"
    - Dark background, orange text, tap to send message
    - Shows in orange when active

- Input area (bottom, sticky):
  * Text field: Dark background, orange focus border
  * Placeholder: "Type or say... 🎤"
  * Send button: Orange gradient circle icon (arrow)
  * Voice input icon on left (mic)

- Example conversation:
  * Bot: "What type of cuisine are you craving?"
  * Quick chips: "🍜 Curry" | "🦐 Seafood" | "🍕 Pizza"
  * User taps "🍜 Curry"
  * Bot: "Great! How many guests? 👥"

Loading state: "Chef is typing..." with 3 animated dots (orange)

Offline badge: "Chat available offline ✓" (small gray badge if offline mode)

Responsive: Takes 90% width on mobile, 420px on larger screens
Mobile: Can swipe down to minimize, up to expand
```

---

## 8️⃣ PROFILE PAGE (PWA)
**Prompt:**
```
Design user profile page for PWA.

Header: "Profile" with settings icon (⚙️, orange) in top-right

Profile info section:
- Avatar circle (80x80px) with orange border, user initials "AB" (if no photo)
- Name: "Ahmed Bashir" (bold white)
- Email: "ahmed@example.com" (light gray)
- Member since: "Joined April 2026" (small gray text)
- Edit profile button: "Edit" (dark outline, orange text)"

Sections (each expandable):

1. PREFERENCES
  - Location: "Colombo" (tap to change, shows list: Colombo | Kandy | Galle | Negombo | Ella | Mirissa)
  - Favorite cuisines: Tags showing "Sri Lankan" | "Seafood" | "Vegan" (orange labels, X to remove)
  - "Add cuisines" button (orange outline)
  - Price range: Slider from $ to $$$$$ (orange slider track)

2. DIETARY RESTRICTIONS
  - Checkboxes: ☑️ Vegetarian | ☐ Vegan | ☐ Gluten-Free | ☐ Dairy-Free | ☐ Halal | ☐ Kosher
  - "Save" button (orange gradient)

3. NOTIFICATIONS
  - Toggle switches (orange when ON):
    * Special offers & promotions [ON]
    * Booking reminders [ON]
    * New restaurant alerts [OFF]
    * Review requests [ON]
    * Newsletter [OFF]
  - Each has description text below toggle

4. SAVED RESTAURANTS
  - Shows 3 favorite restaurants:
    * "The Lagoon" with heart icon (red/filled)
    * "Laksha" with heart icon
    * "Ministry of Crab" with heart icon
  - Button: "View all saved" (orange text)

5. HELP & SUPPORT
  - FAQ link (orange text)
  - "Report a problem" link (orange text)
  - "Contact us" button (orange outline)
  - Version: "v1.0.2" (small gray text at bottom)

6. APP SETTINGS
  - Toggle: "Offline mode" [ON] (green when enabled)
  - Toggle: "Dark mode" [ON]
  - Cache: "Clear app cache | 23 MB" (orange button)
  - "App version info" (gray)

7. ACCOUNT & SECURITY
  - Button: "Change password" (dark outline)
  - Button: "Sign out" (gray outline)
  - Button: "Delete account" (red outline #E63946)

App shell navigation at bottom
```

---

## 9️⃣ OFFLINE PAGE (PWA)
**Prompt:**
```
Design offline support page shown when no internet connection.

Full-screen layout (375px mobile):
- Top banner (dark #1a1218):
  * Status icon: ⚠️ 
  * "You're offline" (white, bold)
  * "But you can still browse saved restaurants" (light gray)

- Illustration area (center):
  * Large emoji: 📡❌ or ☁️🚫
  * Or simple icon: airplane mode icon
  * "Connection Lost" heading (white)
  * Subtext: "Check your internet connection" (light gray)

- What you can do section (white text):
  * ✓ Browse your saved restaurants
  * ✓ View your bookings
  * ✓ Read restaurant details
  * ✓ Store messages locally
  * ✗ Search for new restaurants (grayed out)
  * ✗ Make new bookings (grayed out)

- Cached content section:
  * "Recently viewed restaurants:" 
  * Shows 3 cards of restaurants user viewed before going offline
  * Each card has cached image and info
  * Tap to view details

- Retry button (full width):
  * "Retry connection" (orange gradient)
  * Shows spinner while retrying

- Auto-sync indicator at bottom:
  * "Changes will sync when online ↻"
  * Counter: "2 pending changes"

Footer text:
- "AgentDine works better with internet connection"
- "Some features are limited offline"

Soft color scheme - slightly grayed out UI to indicate limited functionality
```

---

## 🔟 INSTALLATION PROMPT (PWA)
**Prompt:**
```
Design the "Install AgentDine" prompt banner for PWA home screen.

Banner position: Below app shell header, above main content
Banner style: Horizontal card (full width minus padding)

Content:
- Left side: App icon (50x50px, rounded, orange border)
- Center: 
  * Bold text: "Add AgentDine to your home" 
  * Subtext: "Get fast access and offline support" (small, light gray)
- Right side: 
  * Primary button: "Add" (orange gradient, 60px wide, rounded)
  * Secondary: Close button "✕"

Animation:
- Slides in from top with smooth animation
- Appears 3 seconds after app loads
- Dismissible (X button or swipe up)
- Reappears after 7 days if not installed

Variants:
- Android: Shows "Add to home screen" text
- iOS: Shows "Add to home screen" with iOS-specific styling (Safari share menu icon)

After user taps "Add":
- Confirmation message: "✓ AgentDine added!" (green checkmark)
- Fades out after 2 seconds

Colors: Orange (#FF8C42) for buttons, dark background matching app shell
```

---

## 1️⃣1️⃣ PROVIDER DASHBOARD (PWA)
**Prompt:**
```
Design provider (restaurant owner) dashboard for PWA - mobile optimized.

Header: Restaurant name "Laksha" | Notifications bell (badge shows "2" in red)

Quick stats cards (scrollable, 2 columns on mobile):
- Booking card:
  * "📅 Today's Bookings"
  * Large number: "12"
  * Subtitle: "8 confirmed, 4 pending"
  * Orange accent color

- Revenue card:
  * "💰 Revenue"
  * "Rs. 8,450"
  * "↑ 12% from yesterday" (green)

- Rating card:
  * "⭐ Rating"
  * "4.8 / 5"
  * "234 reviews"

- Occupancy card:
  * "🪑 Occupancy"
  * "75%"
  * Progress bar (orange #FF8C42)

Today's reservations section:
- List of bookings:
  * Time | Customer Name | Party Size | Status
  * Example: "19:00 | Ahmed B | 4 guests | ✅ Confirmed"
  * Status badges: Green (confirmed), orange (pending), red (cancelled)
  * Tap to expand - shows notes and phone number
  * Action buttons: "Check-in" (orange) | "Note" (gray) | "Cancel" (red)

Action buttons (sticky):
- Full width: "+ Add Reservation Manually" (orange outline)
- Full width: "📞 Quick call center" (dark outline)

Sections tabs (if space):
- Today (active, orange underline)
- This Week
- This Month

Empty state message (if needed):
- "No reservations today"
- Button: "Invite customers" (orange)

App shell with provider-specific navigation
```

---

## 1️⃣2️⃣ ADMIN DASHBOARD (PWA - Provider)
**Prompt:**
```
Design admin dashboard for PWA, optimized for mobile management.

Header: "Admin Dashboard" | Settings icon (⚙️)

KPI Cards (stacked vertically):
- Total Users: "15,234" (blue accent)
- Active Restaurants: "892" (orange accent #FF8C42)
- Revenue: "Rs. 2.3M" (gold accent #FFD700)
- Pending Apps: "23" (red badge #E63946)

Critical alerts section:
- Card: Red border, white text on dark background
- "⚠️ 5 new restaurant applications pending review"
- "Review now" button (red #E63946)

Tabs (scrollable):
- Overview (active, orange underline)
- Users
- Restaurants
- Transactions

OVERVIEW tab shows:
- Revenue chart (simplified bar chart, orange bars)
- Recent approvals/rejections (list):
  * Restaurant name | Status | Date | Action
  * Example: "New Colombo Bistro | ✅ Approved | Today | View"
  
- Pending applications queue:
  * Numbered list with restaurant names
  * "1. Spice Zone - Italian-Fusion"
  * Tap to view application details
  * Button: "Review All" (orange, full width)

USERS tab:
- Search box (dark, orange focus)
- User list with avatars:
  * Avatar | Name | Role | Status (Online green dot)
  * Example: "Ahmed B | User | Online ●"

RESTAURANTS tab:
- Filter tabs: All | Active (green) | Inactive (gray) | Suspended (red)
- Restaurant list:
  * Logo | Name | City | Rating | Status
  * Example: "Laksha | Colombo | 4.8★ | Active ✓"
  * Tap to view/manage

TRANSACTIONS tab:
- Recent bookings/payments:
  * Restaurant | Date | Amount | Status
  * Example: "Laksha | Apr 15 | Rs. 850 | Completed"
  * Status: Completed (green) | Pending (orange) | Failed (red)

Floating action button:
- Emergency contact button (red #E63946)
- "Contact support" on tap

Bottom: Admin navigation (different from customer nav)
```

---

## 🎯 MAGIC PATTERNS SUBMISSION GUIDE FOR PWA

### Steps to Generate Each Design:

1. **Go to**: https://www.magicpatterns.com
2. **Sign up/Login** (if not already)
3. **Click**: "Create Design" or "New Design"
4. **Select Project Type**: "Mobile App" (not Web App)
5. **Paste the prompt** from above into the text area
6. **Set device**: "iPhone 12 Pro" (375 × 812px)
7. **Paste color palette**:
```
Primary: #FF6B35, #FF8C42
Secondary: #E63946
Accent: #FFD700, #FFB84D
Dark BG: #0F1419, #1a1218
Text: #ffffff
Text Light: #b0b8c1
```
8. **Font**: "Inter" (if available) or "San Francisco"
9. **Click**: "Generate Design"
10. **Review**: Check generated design
11. **Refine**: Use editor to adjust if needed
12. **Export**: Download as PNG/SVG

---

## 🌍 SRI LANKAN RESTAURANT EXAMPLES TO USE

### Colombo Restaurants:
- **The Lagoon**: Seafood, Colombo 1, ⭐4.8
- **Laksha**: Sri Lankan Fusion, Colombo 3, ⭐4.9
- **Ministry of Crab**: Seafood, Colombo 3, ⭐4.8
- **Ottos**: International, Colombo 4, ⭐4.7
- **Bagatelle**: French Cuisine, Colombo 1, ⭐4.6
- **Mano**: Italian, Colombo 3, ⭐4.5
- **Spice Zone**: Indian-Fusion, Colombo 7, ⭐4.4
- **Barefoot Garden Cafe**: Sri Lankan, Colombo, ⭐4.7

### Other Cities:
- **Kandy**: "Topaz" (Sri Lankan), ⭐4.6
- **Galle**: "The Lighthouse" (Seafood), ⭐4.8
- **Negombo**: "Beach Restaurant" (International), ⭐4.5
- **Ella**: "Mountain Cafe" (Vegetarian), ⭐4.9
- **Mirissa**: "Blue Whale" (Seafood), ⭐4.7

### Sri Lankan Cuisines to Feature:
- 🍜 Curry House (Various curries)
- 🦐 Seafood (Fresh catches)
- 🍲 Kottu Roti (Famous street food)
- 🥘 Lamprais (Rice & meat in banana leaf)
- 🌾 String Hoppers (Noodle-like dish)
- 🍛 Deviled dishes (spicy preparations)
- 🥬 Vegetarian options (abundant in Sri Lanka)
- 🍌 Plantain chips (popular snack)

---

## 📱 PWA-SPECIFIC FEATURES TO HIGHLIGHT

1. **Offline Support**: "Works offline" badges in designs
2. **Install Prompt**: Home screen installation visual
3. **App Shell**: Fixed header + bottom navigation
4. **Push Notifications**: Show notification badges (red dots)
5. **Fast Load**: Include skeleton loaders/placeholders
6. **Mobile-First**: All designs optimized for 375px width
7. **Touch-Friendly**: Large tap targets (48px minimum)
8. **Smooth Animations**: Transitions between screens
9. **Safe Area**: Respect notch/status bar areas
10. **Pull-to-Refresh**: Gesture support shown

---

## 🎨 SRI LANKAN CULTURAL TOUCHES

- **Local Payment**: Show "Rs." currency (Sri Lankan Rupee)
- **Location Names**: Use real Sri Lankan cities
- **Local Dishes**: Feature authentic Sri Lankan cuisine
- **Time Format**: 24-hour time format (common in Sri Lanka)
- **Phone Format**: +94 country code for numbers
- **Emojis**: 🏝️ 🌴 🍲 🙏 for cultural context
- **Greeting**: "Ayubowan!" (Sinhala greeting) in welcome
- **Colors**: Keep warm, spicy color palette (matches food culture)

---

## ✅ DESIGN CHECKLIST FOR PWA

- [ ] All designs are mobile-first (375px minimum width)
- [ ] Color palette is consistent across all screens
- [ ] Text is readable (white #ffffff or light gray on dark)
- [ ] Orange (#FF8C42) used for all primary CTAs
- [ ] Red (#E63946) used for alerts/cancellations
- [ ] Gold (#FFD700) used for stars/premium elements
- [ ] App shell (header + bottom nav) is consistent
- [ ] Offline support indicator shown where applicable
- [ ] Install prompt designed visually
- [ ] PWA features highlighted (fast, offline, app-like)
- [ ] Sri Lankan locations and restaurants featured
- [ ] Local currency (Rs.) shown in pricing
- [ ] Touch-friendly buttons (48px+ tap targets)
- [ ] Smooth animations between states
- [ ] Loading states designed (skeleton screens)
- [ ] Empty states designed for zero-content scenarios

---

## 📸 EXPORT & USE

After generating designs from Magic Patterns:

1. **Download** each design as PNG/SVG
2. **Organize folder**:
   ```
   /designs/pwa/
   ├── splash-screen.png
   ├── home-page.png
   ├── search-discover.png
   ├── restaurant-details.png
   ├── booking-flow.png
   ├── my-bookings.png
   ├── chat-widget.png
   ├── profile-page.png
   ├── offline-page.png
   ├── install-prompt.png
   ├── provider-dashboard.png
   └── admin-dashboard.png
   ```
3. **Share** with development team
4. **Reference** during component development
5. **Update** as design evolves

---

## 🚀 NEXT STEPS

1. ✅ Generate designs using prompts above
2. ✅ Review designs with stakeholders
3. ✅ Create component library (buttons, cards, inputs)
4. ✅ Implement PWA features (service workers, manifest)
5. ✅ Build responsive components matching designs
6. ✅ Test on real mobile devices
7. ✅ Optimize for offline using IndexedDB
8. ✅ Deploy and test install prompt

**Ready to generate designs for AgentDine PWA! 🎉**
