# AGENTDINE CUSTOMER WEB APPLICATION - UI DESIGN PROMPTS FOR MAGIC PATTERNS
**Sri Lankan Restaurant Discovery & Reservation Platform - Web Version**

---

## 🎨 COLOR PALETTE (For All Web Designs)
```
Primary Orange: #FF6B35 → #FF8C42 (Gradient for CTAs)
Secondary Red: #E63946 (Alerts, cancellations, urgent)
Gold Accent: #FFD700, #FFB84D (Premium, ratings, highlights)
Deep Dark Background: #0F1419, #1a1218 (Main background)
Card Background: #16202f (Slightly lighter than main)
Text Primary: #ffffff (Main text)
Text Secondary: #b0b8c1 (Secondary info)
Border: rgba(255, 140, 66, 0.3) (Subtle orange border)
Success Green: #2ecc71 (Confirmations, status)
```

---

## 🌐 WEB DESIGN PRINCIPLES
- **Desktop-First**: Optimize for 1440px+ desktop (not mobile-first)
- **Responsive**: Graceful scaling to 1024px tablets, then to 768px if needed
- **Spacious Layout**: Use full screen width for hero sections and content
- **Multi-Column**: Leverage horizontal space with 2-3 column layouts
- **Sidebar Navigation**: Left sidebar (or top nav) for main menu
- **High Information Density**: Show more content at once than mobile
- **Conversational UI**: Chatbot as sidebar component, accessible from everywhere
- **Fast Interactions**: Hover states, smooth transitions, micro-interactions

---

## 1️⃣ LANDING PAGE (Hero + Value Props)
**Prompt:**
```
Design the AgentDine landing page for desktop web, modern SaaS style.

HEADER (Fixed, top, full width):
- Left: AgentDine logo (white text with orange icon, 120px wide)
- Center: Navigation menu (horizontal): Home | Browse | How it Works | About | Blog
  * Text: white, 14px
  * Active: orange #FF8C42 underline
  * Hover: orange color transition
- Right: Buttons (40px height): "Sign In" (white outline) | "Sign Up" (orange gradient solid)

Hero section (full width, 100vh, dark background #0F1419):
- Left side (50% width):
  * Large heading: "Discover Sri Lanka's Best Restaurants" (white, bold, 52px)
  * Subheading: "AI-powered recommendations, instant reservations, Sri Lankan flavors" (light gray, 20px)
  * 3 feature bullets:
    - 🤖 AI Chef Assistant - Get personalized suggestions instantly
    - ⚡ One-Click Booking - Reserve your table in seconds
    - ❤️ Saved Favorites - Never forget a great restaurant
  * CTA buttons below:
    - Primary: "Explore Restaurants" (orange gradient #FF6B35-#FF8C42, 16px text, 50px height, 200px wide)
    - Secondary: "Chat with Chef" (dark outline with orange border, 16px text, 50px height)

- Right side (50% width):
  * Large hero image (600x500px min): 
    - Mouth-watering food image (Sri Lankan restaurant setting)
    - Or: Stylized illustration of diverse Sri Lankan dishes
    - Overlay gradient corner (dark fade at bottom-left)
    - Subtle animation: Slight parallax on scroll

Below hero (remaining viewport):
- Trust section (white text on dark):
  * "1,250+ Restaurants" | "42,000+ Reviews" | "98% Satisfied Diners" (large numbers in orange #FF8C42)
  * Small icons above each stat

- Featured restaurants section:
  * "Trending in Colombo 🔥" heading (28px, white)
  * 3 restaurant cards (side by side, each ~380px wide):
    - Large image (380x200px)
    - Restaurant name (white, 18px)
    - Cuisine tags (orange labels)
    - ⭐ Rating (gold stars) and review count
    - Button: "View Details" (orange outline, hover fills with gradient)
  * All card images have subtle hover lift effect (shadow & scale)

Footer:
- 4 columns: Product, Company, Resources, Follow Us
- Links in light gray
- Copyright text
- Social icons (orange on hover)
```

---

## 2️⃣ AUTHENTICATION - SIGN UP PAGE
**Prompt:**
```
Design the Sign Up page for AgentDine web, clean form layout.

Layout: Split screen
- Left (50%): Dark background #1a1218
  * Large form on white/dark card
  * Card width: 400px, centered vertically on left half
  * Background: #16202f

- Right (50%): Large image 
  * Sri Lankan restaurant ambiance
  * Or stylized food illustration
  * Overlay text: "Join 42,000 diners discovering Sri Lanka's best restaurants"
  * Text: white, semi-transparent background

FORM CONTENT (left side card):
- Heading: "Create Your Account" (white, 28px)
- Subtext: "Join AgentDine to book reservations" (light gray, 14px)

Form fields (all 100% width of card):
1. Full Name input
   - Placeholder: "Enter your full name"
   - Icon: 👤 (left side, gray)
   - Focus: Orange border #FF8C42, orange text color

2. Email input
   - Placeholder: "your@email.com"
   - Icon: ✉️ (left side, gray)
   - Validation: Green ✓ on valid email

3. Password input
   - Placeholder: "••••••••"
   - Icon: 🔒 (left side, gray)
   - Show/Hide toggle (eye icon, orange when active)
   - Password strength meter below: "Strong" (green)

4. Confirm Password input
   - Placeholder: "••••••••"
   - Icon: 🔒

5. Phone number input
   - Placeholder: "+94 XXX XXX XXXX"
   - Icon: 📱
   - Sri Lankan format validation

6. City selector dropdown
   - Options: Colombo | Kandy | Galle | Negombo | Ella | Mirissa | Other
   - Dark dropdown, orange highlight on selection

7. Dietary preferences checkboxes (multi-select):
   - ☐ Vegetarian | ☐ Vegan | ☐ Gluten-Free | ☐ Dairy-Free | ☐ Halal | ☐ Kosher
   - Checkmark color: orange when checked

8. Terms & Conditions checkbox
   - "☐ I agree to Terms & Privacy Policy"
   - Link text: orange color

Buttons:
- Primary: "Create Account" (orange gradient, full width, 50px height, 16px text, bold)
- Below: "Already have an account? Sign In" (light gray text, "Sign In" in orange, clickable)

Social signup (above primary button, optional):
- "Or sign up with:"
- Google icon (white background rounded)
- Facebook icon (white background rounded)
- Both have hover effect (slight scale, orange glow)

Password requirements shown on right of password field (light gray text):
- ✓ At least 8 characters
- ✓ One uppercase letter
- ✓ One number
- ✓ One special character

All text inputs: Dark background #0F1419, white text, orange focus border
All buttons on hover: Slightly brighter, subtle shadow increase
```

---

## 3️⃣ AUTHENTICATION - SIGN IN PAGE
**Prompt:**
```
Design the Sign In page for AgentDine web, similar to Sign Up but simpler.

Layout: Split screen (same as Sign Up)
- Left (50%): Dark background #1a1218
  * White/dark card (400px, centered vertically)
  
- Right (50%): Large image (different restaurant image than Sign Up)

FORM CONTENT (left side):
- Heading: "Welcome Back" (white, 28px)
- Subtext: "Sign in to your AgentDine account" (light gray)

Form fields:
1. Email input
   - Placeholder: "your@email.com" 
   - Icon: ✉️
   - Orange focus border

2. Password input
   - Placeholder: "••••••••"
   - Icon: 🔒
   - Show/Hide toggle

3. "Remember me" checkbox (optional)
   - Subtle styling, gray text

4. "Forgot password?" link (orange text, right-aligned above button)

Buttons:
- Primary: "Sign In" (orange gradient, full width, 50px height)
- Below: "Don't have an account? Sign Up" (light gray, "Sign Up" orange)

Social signin:
- "Or continue with:"
- Google | Facebook icons (similar to signup)

Loading state on Sign In button:
- Shows spinner inside button (white rotating icon)
- Button text becomes "Signing in..."
```

---

## 4️⃣ RESTAURANT DISCOVERY - SEARCH & FILTER PAGE
**Prompt:**
```
Design the restaurant discovery/search page for AgentDine web, 2-column layout.

HEADER (Fixed at top, full width, dark #0F1419):
- Search bar (centered, 70% width):
  * Icon: 🔍 (orange, left side)
  * Input: "Search restaurants, cuisines, locations..." (white text)
  * Orange focus border
  * On focus: Expands slightly, suggestion dropdown appears

LEFT SIDEBAR (25% width, scrollable):
- "Filters" heading (white, bold)

1. LOCATION SECTION
   - "Location" heading (14px, white)
   - List of cities (each clickable):
     * ☐ Colombo (gray checkbox)
     * ☐ Kandy
     * ☐ Galle
     * ☐ Negombo
     * ☐ Ella
     * ☐ Mirissa
     * ☐ Other
   - Active/selected: Orange checkmark ✓, orange text
   - "View All" link (if more cities)

2. CUISINE TYPE SECTION
   - "Cuisine Type" heading
   - Multi-select chips (show 5, "View More" link):
     * 🍜 Sri Lankan | 🦐 Seafood | 🍕 Italian | 🥬 Vegetarian | 🌮 Fusion | +8 More
   - Active chip: Orange background, white text, rounded 20px
   - Inactive: Dark background, white text

3. PRICE RANGE SECTION
   - "Price Range" heading
   - Slider: $ ━━━━━━━ $$$$ 
   - Slider track: Orange (#FF8C42)
   - From-To text fields: "Min: Rs. 0" | "Max: Rs. 5000"
   - Min/Max buttons: "$" | "$$" | "$$$" | "$$$$" (toggle style)

4. RATING SECTION
   - "Rating" heading
   - Star selector: Show ⭐⭐⭐⭐ (clickable, highlights in gold)
   - Text: "4.0 & above"

5. DIETARY RESTRICTIONS
   - "Dietary Info" heading
   - ☐ Vegetarian Options | ☐ Vegan | ☐ Gluten-Free | ☐ Dairy-Free | ☐ Halal | ☐ Kosher
   - Orange checkmarks when selected

6. AVAILABILITY
   - "Availability" heading
   - Date picker: Shows 7 days
   - Time selector: 11:00 | 12:00 | 13:00 | 14:00 | etc.
   - Party size: Buttons 1 | 2 | 3 | 4 | 5 | 6+

7. ACTION BUTTONS (bottom of sidebar, sticky)
   - "Apply Filters" (orange gradient, full width)
   - "Clear All" (dark outline, full width, gray text)

RIGHT CONTENT AREA (70% width):
- Top bar (sticky, horizontal):
  * Results count: "23 restaurants match your filters"
  * Sort dropdown: "Sort by: Relevance | Rating | Distance | Newest" (orange text, dark background)
  * View toggle: List icon (active, orange) | Grid icon (gray)

RESULTS SECTION (main content, scrollable):
- Vertical list of restaurant cards (each 100% width, 160px height):
  * Restaurant image (160x160px, left side, rounded)
  * Restaurant info (right side):
    - Name: "Laksha" (white, 18px, bold)
    - Brief description: "Authentic Sri Lankan cuisine with fusion touches" (gray, 12px)
    - Cuisine tags: 🍲 Curry | 🦐 Seafood | ♨️ Spicy (orange labels, small)
    - Rating: ⭐ 4.9 (gold) | 234 reviews | 📍 2.3 km away
    - Status: Green "Open now" badge | "Closes at 22:00" (gray)
    - Reservation available: Yes/No indicator
    - Price level: $$ (yellow)
  * Right edge: 
    - Heart icon (unfilled, gray, red on hover #E63946)
    - "View Details" button (orange outline, 80px wide, small)
    - Hover effect: Card lifts shadow, image slightly scales

- Empty state (if no results):
  * Large emoji: 🔍
  * "No restaurants found"
  * "Try adjusting your filters or search terms"
  * Button: "Clear all filters" (orange)

- Load more button at bottom:
  * "Load More Restaurants" (dark outline, orange text, 150px wide)
```

---

## 5️⃣ RESTAURANT DETAILS PAGE
**Prompt:**
```
Design the restaurant details page for AgentDine web, immersive layout.

HEADER (Fixed top, dark #0F1419, full width):
- Left: Back button ← (white arrow, 24px)
- Center: Restaurant name "Laksha" (white, 20px)
- Right: Save button (heart icon, gray, outline), Share button (share icon, gray)

HERO SECTION (full width, 500px height):
- Large restaurant image (Laksha, Sri Lankan ambiance)
- Gradient overlay (bottom 0-40%): dark fade from transparent to #0F1419
- Image is zoomable on hover (slight scale effect)
- Floating banner (bottom-left, semi-transparent dark):
  * Restaurant name (white, 28px, bold)
  * Cuisine tags: 🍲 Curry | 🌶️ Spicy | ♨️ Traditional (orange labels)

CONTENT SECTION (below hero, max-width 1200px, centered):
- TOP INFO BAR (horizontal, full width):
  * Left side:
    - ⭐ 4.9 rating (gold star, 20px) | "234 reviews" (light gray) | "View Reviews" (orange link)
    - 📍 "Colombo 3" (white text)
    - 🕐 "Open now until 22:00" (green badge)
  * Right side:
    - Price level: $$
    - "Reserve a Table" button (orange gradient, 120px)
    - "View Menu" button (dark outline, 120px)

- 2-COLUMN LAYOUT (below info bar):

LEFT COLUMN (65% width, scrollable):

1. ABOUT SECTION
   - Heading: "About Laksha" (white, 24px)
   - Description: "Established in 2010, Laksha brings authentic Sri Lankan flavors to Colombo. Our chefs prepare traditional curries using time-honored recipes passed down through generations. Known for our lamprais, kottu roti, and fresh seafood specialties." (white text, 14px line-height 1.6)
   - Highlights: 
     * "🏆 Award-winning chef" (orange check mark)
     * "♨️ Traditional wood-fired preparation"
     * "🌿 Organic ingredients sourced locally"

2. HOURS & LOCATION SECTION
   - Left: "Hours Today" | Mon-Fri 11:00-23:00 | Sat-Sun 10:00-23:30 (light gray)
   - Button: "See full hours" (orange outline, small)
   - Right: "Address" | "Colombo 3, Sri Lanka" (light gray) | Button: "View on Map" (orange)
   - Phone: "📞 +94 11 234 5678" (orange, clickable)

3. AMENITIES SECTION
   - Heading: "Amenities" (white, 18px)
   - Grid of 2x3:
     * WiFi ✓ (green checkmark)
     * Parking ✓
     * Air Conditioning ✓
     * Online Reservation ✓
     * Private Rooms ✗ (gray)
     * Bar/Drinks ✓

4. REVIEWS SECTION
   - Heading: "Reviews" (white, 24px)
   - Rating breakdown:
     * 5⭐ ▰▰▰▰▰ 200 (orange bar, 75% width)
     * 4⭐ ▰▰▰▰░ 100 (orange bar, 50% width)
     * 3⭐ ▰░░░░ 20 (gray bar, 20% width)
   - Top reviews (show 2):
     * User card:
       - Avatar (30x30px circle)
       - Name "Ahmed B" (white) | Date "2 weeks ago" (gray)
       - ⭐ 4.8 rating (gold)
       - Review text: "Amazing authentic Sri Lankan food! Service was excellent." (light gray)
       - "👍 Helpful" button (gray, orange on hover)
     * Swipe right: See next review (carousel within this section)
   - Button: "See All Reviews" (orange outline, centered)

5. MENU PREVIEW SECTION
   - Heading: "Featured Menu Items" (white)
   - Horizontal scroll of 3 dishes:
     * Each card:
       - Small image (120x100px)
       - Dish name: "Lamprais" (white, 14px)
       - Description: "Rice baked in banana leaf" (gray, 12px)
       - Price: "Rs. 850" (orange, 16px)
       - Dietary tag: 🌶️ Spicy (orange)
       - Rating?: "4.9 ⭐" (gold)
     * Button: "View Full Menu" (orange, centered below)

RIGHT COLUMN (30% width, sidebar):

BOOKING WIDGET (sticky):
- Card background: #16202f
- Border: 1px solid rgba(255, 140, 66, 0.3)
- Heading: "Reserve a Table" (white, 20px, bold)

Form fields:
1. Date picker:
   - "Select Date" (light gray label)
   - Calendar icon + date display: "Apr 15, 2026" (white)
   - Clickable: Shows calendar popup

2. Time selector:
   - "Select Time" (light gray label)
   - Time buttons: 11:00 | 11:30 | 12:00 | 12:30 | ... (show 4, "More times" link)
   - Selected time: Orange background, white text

3. Party size:
   - "Number of Guests"
   - Buttons: 1 | 2 | 3 | 4 | 5 | 6+ (selected: orange)

4. Name input:
   - Placeholder: "Your name" (light gray)
   - Orange focus border

5. Email input:
   - Placeholder: "your@email.com"
   - Orange focus border

6. CTA:
   - Primary: "Check Availability" (orange gradient, full width, 50px)
   - Small text: "0 Rs. booking fee 🎉" (gold text, small)

Availability indicator:
- "✓ Tables available" (green text) or "✗ Fully booked" (red text)

- SPECIAL INFO BOX:
  * Cancellation policy shown
  * "Deposit required: Rs. 500" (if applicable)
  * "Free cancellation up to 24 hours before reservation"
```

---

## 6️⃣ RESERVATION BOOKING - STEP 1 (Date & Time)
**Prompt:**
```
Design the reservation booking page Step 1 for AgentDine web.

HEADER (sticky at top):
- Left: Back button ← "Back to Restaurant" (orange orange on hover)
- Center: "Book Your Table at Laksha" + Progress indicator "Step 1 of 3" (28px white heading)
- Right: "Exit" (X button, gray, white on hover)

PROGRESS BAR (below header, full width):
- Visual progress: 33% filled (orange #FF8C42)
- Steps: 1. Date & Time (active, orange) | 2. Party Size (gray) | 3. Confirmation (gray)

CONTENT (centered, max-width 900px):

LEFT SECTION (50%):

1. CALENDAR SECTION
   - Heading: "Select Date" (white, 20px)
   - Calendar widget showing next 30 days:
     * Header: Month/Year with < > navigation arrows (orange)
     * Week days: Su Mo Tu We Th Fr Sa (gray, small caps)
     * Date grid (7x5):
       - Today marked with blue dot: "15 (today)"
       - Available dates: white text, clickable, hover shows light background
       - Fully booked dates: gray text, strikethrough, disabled
       - Selected date: Orange background (#FF8C42), white text, bold
       - Special dates (holidays): Gold circle indicator
     * Below calendar: "Availability changing" (light gray, spinner)

- Availability legend:
  * ● Available (white) | ● Busy (orange) | ● Fully Booked (gray)

2. TIME SLOT SECTION (appears below calendar after date selected)
   - Heading: "Select Time" (white, 20px)
   - Time slots grid (4 columns, time buttons):
     * Format: 12-hour "11:00 AM" | "11:30 AM" | "12:00 PM", etc.
     * Total slots shown: 24 slots (full day coverage)
     * Available slot: white text, dark background, hover effect (orange border)
     * Selected slot: Orange gradient background, white text, bold
     * Booked slot: Gray background, strikethrough text, disabled/cursor-not-allowed
     * Partially available: "1 table" indicator (small gray text below time)
     * Peak hours: Show "⭐ Popular" tag in gold
   - Scroll if more than visible (horizontal scroll or show "Load More" button)

RIGHT SECTION (30%, sidebar):

BOOKING SUMMARY WIDGET:
- Black card background (#16202f)
- Border: 1px orange (rgba(255, 140, 66, 0.3))

- Restaurant info:
  * Image (80x80px, rounded)
  * Name: "Laksha" (white, 18px)
  * Cuisine: "🍲 Sri Lankan" (gray, 14px)
  * Rating: "⭐ 4.9" (gold)

- Selected info (highlighted with orange left border):
  * "📅 Date" | "Apr 15, 2026" (white)
  * "⏰ Time" | "7:00 PM" (white, or "Not selected yet" in gray)
  * "👥 Guests" | "TBD" (will fill in step 2)

- Bottom CTA section (sticky):
  * "Continue" button (orange gradient, full width, 50px, disabled until time selected)
  * "Back" button (dark outline, full width)

- "Cancellation Policy" link (small, orange text)

BOTTOM MOBILE-LIKE FOOTER (visible on desktop for consistency):
- Centered: "Step 1 of 3 - Select Date & Time"
- Arrows: "Next →" (orange, clickable, disabled until time selected)
```

---

## 7️⃣ RESERVATION BOOKING - STEP 2 (Party Size & Details)
**Prompt:**
```
Design reservation booking Step 2 for AgentDine web.

HEADER (same as Step 1):
- Back button, "Book Your Table at Laksha", "Exit" button
- Progress bar: 66% filled (orange), Steps: 1 | 2 (active, orange) | 3

CONTENT (centered, max-width 900px):

LEFT SECTION (50%):

1. PARTY SIZE SECTION
   - Heading: "How many guests?" (white, 24px)
   - Large button group (5 columns):
     * Buttons: 1 | 2 | 3 | 4 | 5 (each 80x60px, centered number inside)
     * Selected (e.g., 4): Orange gradient, white text, bold
     * Unselected: Dark background, white text, hover orange border
     * Plus button: "6+" (leads to number input below if clicked)
   - Below buttons: "Up to 6 guests per reservation" (gray text, 12px)
   - If "6+" selected: Show number input "Enter number: ___ guests" (max validation)
   - Availability note: "✓ 3 tables available for 4 guests on Apr 15 at 7:00 PM" (green, 14px)

2. SPECIAL REQUESTS SECTION
   - Heading: "Special Requests (Optional)" (white, 18px)
   - Large text area (full width, 120px height):
     * Placeholder: "Let us know about celebrations, seating preferences, dietary needs..."
     * Dark background #0F1419, white text
     * Orange focus border
     * Character counter: "0/250" (light gray, right corner)
   - Quick suggestion chips below input:
     * 🎂 "Birthday celebration" (clickable, adds to text)
     * 🪟 "Window seat if available"
     * 📍 "Special occasion"
     * 🍽️ "Vegetarian menu"
     * 🎵 "Quiet corner"
     * All chips: Dark background, orange text, clickable to add to textarea

3. ADDITIONAL INFO (Optional collapsible section)
   - Heading: "Additional Information" (gray text, clickable toggle)
   - Collapsed by default (show arrow ▼)
   - Expands to show:
     * ☐ First-time visitor at this restaurant (checkbox)
     * ☐ This is a romantic dinner (checkbox)
     * ☐ Group event/party (checkbox)
     * ☐ Business meal (checkbox)
     * These could personalize recommendations

RIGHT SECTION (30%, sidebar):

BOOKING SUMMARY WIDGET (updated):
- Restaurant card (same as step 1)
- Updated info:
  * ✓ "📅 Apr 15, 2026" (green checkmark)
  * ✓ "⏰ 7:00 PM" (green checkmark)
  * "👥 Guests" | "4 guests" (updated here in orange)
  * Special requests preview: Shows first 50 chars of special request textarea (gray italic)

- Bottom CTA:
  * "Continue to Confirmation" (orange gradient, full width, enabled)
  * "← Back" (gray outline, full width)

- Total cost estimation (if applicable):
  * "Estimated booking fee: Rs. 0" (gold text)
  * "No payment required until confirmation" (gray, 12px)

FORM VALIDATION:
- Below each field, show green checkmark ✓ when valid
- Show error message in red if invalid (e.g., "Special requests too long")
```

---

## 8️⃣ RESERVATION BOOKING - STEP 3 (Confirmation)
**Prompt:**
```
Design reservation booking Step 3 for AgentDine web - Confirmation.

HEADER:
- Back button, "Book Your Table at Laksha", "Exit" button
- Progress bar: 100% filled (orange), Steps: 1 ✓ | 2 ✓ | 3 (active, orange)

CONTENT (centered, max-width 900px):

MAIN SECTION (full width, above sidebar):

1. CONFIRMATION SUMMARY BOX
   - Large card (dark #16202f, orange border #FF8C42)
   - Heading: "Confirm Your Reservation" (white, 26px, centered)
   - Divider line (orange, 50% width)

   - Details grid (2 columns):
     * Left column:
       - "📍 Restaurant" | "Laksha" (white)
       - "🍲 Cuisine" | "Sri Lankan, Fusion" (gray)
       - "📅 Date" | "Tuesday, April 15, 2026" (white, larger font)
     * Right column:
       - "⏰ Time" | "7:00 PM - 9:00 PM" (white, larger font)
       - "👥 Guests" | "4 guests" (white)
       - "📍 Location" | "Colombo 3, Sri Lanka" (gray small text link)

2. SPECIAL REQUESTS REVIEW
   - Heading: "Special Requests" (white, 16px)
   - Quoted text: "Window seat if available, Birthday celebration coming" (gray italic, in light border box)
   - Edit link: "(Edit)" (orange, small, clickable)

3. PRICING BREAKDOWN
   - Card background: dark #16202f
   - "Booking Fee" | "Rs. 0" (light gray, strikethrough)
   - "🎉 No deposit required!" (gold text, bold)
   - Note: "You'll only be charged if you modify or cancel within 24 hours" (gray, small, 12px)
   - Refund policy: "Free cancellation up to 24 hours before reservation" (green check, small)

4. CANCELLATION POLICY FULL TEXT
   - Expandable section: "Cancellation Policy" (clickable, shows arrow ▼)
   - Collapsed by default
   - Expanded text: Full policy (gray, 12px, italic)

5. TERMS ACCEPTANCE
   - Checkbox: "☐ I agree to the Cancellation Policy and Terms of Service"
   - Unchecked by default
   - Red text: "Required to confirm"
   - Links: "Policy" (orange) and "Terms" (orange) are clickable

RIGHT SIDEBAR (30% width):

CONTACT VERIFICATION BOX:
- Heading: "Your Contact Info" (white)
- Name: "Ahmed Bashir" (white, 16px, bold)
- Email: "ahmed@example.com" (gray, small)
- Phone: "+94 77 123 4567" (gray, small)
- Edit link: "(Edit)" (orange, small, clickable to go back to profile)

CONFIRMATION DETAILS:
- Confirmation code: "REST-ALC-ABZ9" (orange monospace text, 18px, bold)
- "Copy" button (dark outline, small)
- Note: "You'll receive this code via email" (gray, small)

CTA SECTION (full width, centered):
- Primary: "Confirm Reservation" (orange gradient, 200px wide, 60px height, 18px text, bold)
- Secondary: "← Edit Details" (dark outline, 150px wide, gray text)
- Tertiary: "Cancel" (red outline, 100px wide, red text)

BEFORE CONFIRMATION MODAL (appears on button click):
- "Processing..." spinner (orange circle spinner)
- "Confirming your reservation..." (light gray text)

AFTER CONFIRMATION (page transition):
- Success animation: ✓ checkmark (large, green #2ecc71, 100px, animated scale up)
- Heading: "Reservation Confirmed!" (white, 40px, bold)
- Subheading: "Your table is reserved at Laksha" (light gray, 18px)
- Confirmation details repeat in smaller format
- Buttons:
  * "Add to Calendar" (orange outline)
  * "View Booking" (orange gradient)
  * "Browse Restaurants" (dark outline)
  * "Book Another Restaurant" (dark outline)
- Email confirmation note: "A confirmation email has been sent to [email] ✓" (green text, small)
```

---

## 9️⃣ MY BOOKINGS / RESERVATIONS PAGE
**Prompt:**
```
Design the "My Bookings" page for AgentDine web, dashboard overview.

HEADER (fixed):
- Left: "My Bookings" (white, 32px, bold)
- Right: Filters/Sort buttons (optional)

TAB NAVIGATION (below header, sticky):
- "Upcoming" (active, white text, orange underline, 20px)
- "Completed" (gray text)
- "Cancelled" (gray text)
- Each text is clickable to switch tabs
- Active tab: Orange underline (4px), white text

LEFT SIDEBAR (20% width, scrollable):
- "Filter by Date Range" (white, 14px)
- Quick filters:
  * "This Week" (clickable, orange text if active)
  * "This Month"
  * "Last 3 Months"
  * "Custom Range" (allows date picker popup)

MAIN CONTENT (75% width):

UPCOMING BOOKINGS TAB (active):
- Sorted by date (nearest first)
- Each booking card (full width, 140px height):
  * Left: Restaurant image (120x120px, rounded, dark border)
  * Center-Left: Restaurant details
    - Name: "Laksha" (white, 18px, bold)
    - Cuisine: "🍲 Sri Lankan Fusion" (orange labels)
    - Rating: "⭐ 4.9" (gold)
    - Address: "📍 Colombo 3" (gray, 12px)
  * Center-Right: Reservation details (highlighted box with orange border)
    - Date/Time: "📅 Apr 15, 2026 | ⏰ 7:00 PM" (white, 16px, bold)
    - Party size: "👥 4 guests" (white)
    - Status badge: Green "Confirmed ✓" (22px height)
    - Confirmation code: "Code: REST-ALC" (gray, small, clickable to expand)
  * Right: Countdown + Action buttons
    - "🕐 8 days away" (orange text, 14px)
    - Buttons (stacked):
      * "Modify" (orange outline, small)
      * "Cancel" (red outline, small)
      * "View Details" (dark outline, small)
  * Swipe left (on mobile): Reveals red "Cancel" button
  * Hover effect: Card lifts with shadow, image area brightens

- Multiple cards stacked

- Empty state (if no upcoming bookings):
  * Large emoji: 📅
  * "No upcoming reservations"
  * "You don't have any bookings at the moment"
  * Button: "Explore & Book" (orange gradient, 150px)
  * Suggestions: "Browse our featured restaurants above"

COMPLETED BOOKINGS TAB (inactive, click to view):
- Similar layout but grayed out
- Status: "Completed ✓" (green badge)
- Additional action button: "Leave Review" (orange) or "Reviewed ✓" if already reviewed
- Shows star rating if review was left

CANCELLED BOOKINGS TAB (inactive):
- Grayed out cards
- Status: "Cancelled" (red badge)
- Reason shown (if provided): "Reason: Changed plans" (gray italic)
- Action button: "Book Similar" (orange outline) - books same restaurant different date

FLOATING ACTION BUTTON (bottom-right corner):
- Orange gradient circle (60px diameter)
- Icon: 🤖 Chef icon or + icon
- Text on hover: "Chat with Chef"
- Click: Opens chat widget

PAGINATION/LOAD MORE (bottom):
- "Load More Bookings" button (if more exist)
- Or: Page numbers 1 2 3 (if pagination enabled)

RESPONSIVE HINT:
- On tablet (1024px): Card layout slightly compressed
- Restaurant image: 100px, info font sizes reduced
```

---

## 🔟 USER PROFILE PAGE
**Prompt:**
```
Design the user profile page for AgentDine web, comprehensive settings dashboard.

HEADER (fixed):
- Left: "My Profile" (white, 32px, bold)
- Right: "Edit Profile" button (orange outline, 100px)

LAYOUT: Left sidebar (22%) + Main content (78%)

LEFT SIDEBAR (22%, scrollable):

PROFILE SUMMARY CARD (top):
- Avatar circle (80x80px, orange border, centered)
- Name: "Ahmed Bashir" (white, 18px, bold, centered)
- Email: "ahmed@example.com" (gray, 12px, centered)
- "Member since April 2025" (light gray, 11px, centered)
- "Level: 🥇 Gold Member" (gold text, 12px, centered)

MENU SECTIONS (vertical list):
1. "Account Settings" (white text, 14px, bold)
   - "Personal Info" (gray, 12px, clickable) -> highlights active section
   - "Security" (gray, 12px)
   - "Notifications" (gray, 12px)

2. "Preferences" (white, 14px, bold)
   - "Dietary & Allergies"
   - "Favorite Cuisines"
   - "Saved Restaurants"

3. "Booking Management"
   - "My Bookings" (links to My Bookings page)
   - "Payment Methods"
   - "Cancellation History"

4. "Support & More"
   - "Help & FAQ"
   - "Report Issue"
   - "Privacy Policy"
   - "Sign Out" (red text, 12px)

MAIN CONTENT AREA (78%, scrollable):

SECTION 1: PERSONAL INFORMATION (active by default)
- Heading: "Personal Information" (white, 24px)
- Form fields (2 columns on desktop, 1 column on tablet):
  1. First Name input: "Ahmed" (dark background, orange focus border)
  2. Last Name input: "Bashir"
  3. Email input: "ahmed@example.com" (read-only, gray background)
  4. Phone input: "+94 77 123 4567" (orange focus)
  5. Date of Birth (optional): "15/04/1995" (calendar picker, orange focus)
  6. City dropdown: "Colombo" (options: Colombo, Kandy, Galle, etc.)
  7. Bio text area (optional): "Food lover, always up for new experiences!" (150px height)

- Save button (orange gradient, 150px)
- "All changes saved" success message (green check, appears after save)

SECTION 2: DIETARY & ALLERGIES
- Heading: "Dietary Preferences & Allergies" (white, 24px)
- Note: "Help us customize your experience" (light gray)
- Checkboxes (2 columns):
  * ☑️ Vegetarian (checked)
  * ☐ Vegan
  * ☐ Gluten-Free (checked)
  * ☐ Dairy-Free
  * ☐ Nut Allergy
  * ☐ Shellfish Allergy
  * ☐ Halal
  * ☐ Kosher
- Allergies text area: "Shellfish allergy (severe)" (dark background, orange focus)
- Save button (orange)

SECTION 3: FAVORITE CUISINES
- Heading: "Favorite Cuisines" (white, 24px)
- Multi-select chips (display like tags):
  * Current favorites shown: 🍲 "Sri Lankan" (orange) | 🦐 "Seafood" (orange) | 🥬 "Vegetarian" (orange) | ×(remove button)
  * Add section: "Add cuisine..." (input field or dropdown)
  * Suggestions: All available cuisines (clickable to add)
- Save button (orange)

SECTION 4: SAVED RESTAURANTS
- Heading: "Saved Restaurants" (white, 24px)
- Grid of saved restaurant cards (3 columns):
  * Each card: Image (200x150px) | Name | Cuisine | Rating (gold stars)
  * Hover: Shows heart icon (red filled) + "Remove from Favorites" button
- "View All Saved (12)" link (orange text)

SECTION 5: NOTIFICATIONS SETTINGS
- Heading: "Notifications" (white, 24px)
- Toggle switches (many can be ON/OFF, orange when ON, gray when OFF):
  * ☑️ "Email confirmations for reservations" [ON]
  * ☑️ "Booking reminders 24 hours before" [ON]
  * ☐ "Special offers & promotions" [OFF]
  * ☑️ "Restaurant reviews from restaurants I visited" [ON]
  * ☐ "Newsletter (weekly highlights)" [OFF]
  * ☑️ "Cancellation alerts" [ON]
- Each toggle has small description below
- Save button (orange)

SECTION 6: PAYMENT METHODS
- Heading: "Payment Methods" (white, 24px)
- "Add Payment Method" button (orange outline, centered)
- Saved cards (if any):
  * Card brand icon | Last 4 digits: "•••• •••• •••• 4242" (Visa logo) | "Set as Default" link | "Remove" link (red)
  * Multiple cards listed

SECTION 7: APP SETTINGS
- Heading: "App Settings" (white, 24px)
- Toggle: ☑️ "Dark mode" [ON] (gold text, already dark mode in this design)
- Toggle: "Download app for offline access" (button, then description)
- Cache settings: "Clear Cache | 23 MB" (orange button, small)
- Version: "App v1.0.2 | Build #4215" (gray, 12px)

SECTION 8: ACCOUNT & SECURITY
- Heading: "Account & Security" (white, 24px)
- Button: "Change Password" (dark outline, 150px)
- Button: "Password-less Login" (orange outline, 150px)
- Button: "Active Sessions" (dark outline, 150px) - shows all signed-in devices
- Warning box (with ⚠️ icon):
  * Heading: "Delete Account" (red text, 16px)
  * "⚠️ This action is permanent and cannot be undone"
  * Button: "Delete My Account" (red background, white text, 150px)

BOTTOM ACTION BAR (sticky):
- "Save Changes" (orange gradient, 150px)
- "Cancel" (dark outline, 150px)
- Or: "All changes saved ✓" (green text, if auto-saved)
```

---

## 1️⃣1️⃣ RESTAURANT REVIEWS PAGE
**Prompt:**
```
Design the reviews/ratings page for AgentDine web.

HEADER:
- Left: "Laksha" (white, 32px) + link back to restaurant
- Right: "Write a Review" button (orange gradient, if user hasn't reviewed this restaurant)

RATING SUMMARY BOX (top):
- Left side (30%):
  * Large rating: "4.9" (white, 60px, bold)
  * Out of "/ 5" (light gray, 20px)
  * "Based on 234 reviews" (light gray, 14px)
  * "Recommend: 98%" (green check, 14px)

- Right side (70%):
  * Rating breakdown (horizontal bar chart):
    - 5⭐ ▰▰▰▰▰ 200 reviews (75%) - orange bar
    - 4⭐ ▰▰▰▰░ 100 reviews (25%) - orange bar
    - 3⭐ ▰░░░░ 20 reviews (8%) - gray bar
    - 2⭐ ░░░░░ 2 reviews (1%) - gray bar
    - 1⭐ ░░░░░ 1 review (0.4%) - red bar
  * Each bar clickable to filter reviews

FILTER & SORT BAR (sticky, below summary):
- Left: "Filter" button (dark outline)
  * Dropdown: ⭐ 5 Stars | ⭐ 4 Stars | ⭐ 3 Stars | All Reviews (checkboxes)
- Center: "Sort by" dropdown (orange text)
  * Options: Most Helpful | Recent | Highest Rating | Lowest Rating
- Right: "Search reviews..." input (dark background, white text, 200px)

REVIEWS LIST (main content, scrollable):
- Each review card (full width, ~200px height):
  * Top section:
    - User avatar (40x40px circle, rounded)
    - User name: "Ahmed B" (white, 14px) | "Verified Guest ✓" (green badge, 11px)
    - Posted: "2 weeks ago" (light gray, 11px)
  * Rating: ⭐⭐⭐⭐⭐ (5 gold stars, clickable to filter) | "5.0" (gold text)
  * Review title (if provided): "Amazing authentic Sri Lankan food!" (white, 16px, bold)
  * Review body: "The service was excellent, and the food was incredibly authentic. The lamprais was outstanding. Highly recommended!" (white, 14px, line-height 1.6)
  * Photos (if user added): Thumbnail gallery (3 photos, 80x80px each, clickable for lightbox)
  * Helpful section:
    - "👍 Helpful" link (gray, small) || "👎 Not helpful" link (gray, small)
    - Count: "12 found this helpful" (light gray, 11px)
  * Restaurant response (if manager replied):
    - Box with orange left border:
      - Management icon + "Manager Response" (orange, 12px)
      - Response text: "Thank you so much for your kind words!..." (gray italic, 13px)
  * Divider line (subtle, rgba(255,140,66,0.1))

- Pagination at bottom:
  * "Load More Reviews" (orange outline, centered)
  * Or: Page numbers 1 2 3 4 ... (if pagination)

EMPTY STATE (if no reviews):
- Large emoji: ⭐
- "No reviews yet"
- "Be the first to review this restaurant"
- Button: "Write a Review" (orange gradient)

WRITE REVIEW MODAL (appears on button click):
- Dark overlay
- White modal card (600px wide):
  * Heading: "Write a Review for Laksha" (white, 24px)
  * Close button: X (top-right, gray)
  
  * Form fields:
    1. Rating selector: ⭐⭐⭐⭐☆ (clickable stars, turns orange on hover, gold on selection)
    2. Review title input: "What's your headline?" (150px height, orange focus)
    3. Review text area: "Share your experience... (500px height, orange focus)
    4. Photo upload: "Add up to 5 photos" (drag-and-drop zone or file picker)
       - Preview thumbnails (80x80px)
       - X button to remove photo
    5. Checkbox: ☑️ "I visited this restaurant" (required)
    
  * Buttons:
    - "Publish Review" (orange gradient, 150px, enabled only if form valid)
    - "Cancel" (dark outline, 100px)
    - "Save as Draft" (gray outline, 150px)
```

---

## 1️⃣2️⃣ PAYMENT & CHECKOUT PAGE
**Prompt:**
```
Design the payment/checkout page for AgentDine web.

HEADER:
- "Checkout - Laksha Reservation" (white, 32px)
- Progress indicator (if multi-step checkout)

LAYOUT: 2 columns (60% left, 35% right)

LEFT COLUMN (60%):

SECTION 1: BOOKING DETAILS
- Heading: "Booking Details" (white, 20px)
- Read-only review (similar to confirmation page):
  * Restaurant: Laksha | Date: Apr 15, 2026 | Time: 7:00 PM | Guests: 4
  * Status: "✓ Confirmed" (green)

SECTION 2: DEPOSIT & PRICING
- Heading: "Charges" (white, 20px)
- Line items:
  * "Booking deposit" | "Rs. 500" (white, 14px)
  * "Platform fee (optional)" | "Rs. 0" (light gray, 12px)
  * "Tax (5%)" | "Rs. 25" (light gray, 12px)
  * ────────────────────────────────
  * "Total" | "Rs. 525" (white, 18px, bold, orange background)

- Note: "You will pay the remaining balance at the restaurant" (gray, italic, 12px)

SECTION 3: PAYMENT METHOD
- Heading: "Payment Method" (white, 20px)
- Radio button options:
  * ⭕ Saved Card
    - Card display: "Visa •••• 4242" (white text)
    - "Use this card" button (orange outline)
    
  * ⭕ Credit/Debit Card (default selected)
    - Form fields:
      * Card number input: "1234 5678 9012 3456" (dark bg, orange focus)
      * Cardholder name: "Ahmed Bashir" (dark bg)
      * Two columns:
        - Expiry: "MM/YY" (dark bg)
        - CVC: "•••" (dark bg)
      * Billing address: Same as account (checkbox)
      * If different: Address input fields
    
  * ⭕ Digital Wallet
    - "Apple Pay" button (black background, white text)
    - "Google Pay" button (white background, blue text)
    - "Paypal" button (dark blue background)

SECTION 4: OFFER CODE (Optional, collapsible)
- Heading: "Have a promo or gift code?" (gray, 14px, clickable)
- Expands to show:
  * Input field: "Enter code" (dark bg, white text, 200px)
  * "Apply" button (orange outline, 100px)
  * Applied code display (if code valid): "Code: SAVE20 | Discount: -Rs. 100" (green background)

SECTION 5: TERMS & CONDITIONS
- Checkbox: ☐ "I agree to the Terms of Service and Privacy Policy"
- Links: "Terms" (orange) "Privacy" (orange)
- Unchecked by default, RED indicator "Required"

RIGHT COLUMN (35%, sticky sidebar):

ORDER SUMMARY CARD:
- Title: "Order Summary" (white, 18px, bold)

Restaurant info:
- Image (60x60px, rounded)
- "Laksha" (white, 16px)
- "Sri Lankan" (gray, 12px)
- ⭐ "4.9" (gold) (12px)

Reservation details (bordered box, orange border):
- 📅 "Apr 15, 2026"
- ⏰ "7:00 PM"
- 👥 "4 Guests"
- Edit link: "(Edit)" (orange, 11px, clickable)

Cost breakdown:
- Deposit: Rs. 500
- Fee: Rs. 0
- Tax: Rs. 25
- ─────────────
- Total: Rs. 525 (orange text, bold)

Additional info:
- Confirmation code will be sent via email
- Can cancel up to 24 hours before reservation
- "View cancellation policy" (orange link, 11px)

CTA BUTTONS (full width, stacked):
- Primary: "Complete Payment" (orange gradient, 50px height, 16px text)
- Secondary: "← Back to Details" (dark outline, 40px height)

BOTTOM NOTE (gray italic, 11px):
- "This transaction is secure and encrypted"
- 🔒 SSL Secure icon

FAQs (if needed):
- "Need help?" (clickable, expands FAQ list)
- Common questions:
  * "Can I modify the booking after payment?"
  * "What's the cancellation policy?"
  * "How do I receive my confirmation?"
  * Each question expands to show answer (gray text)

LOADING/PROCESSING STATE:
- When "Complete Payment" clicked:
  * Button shows spinner + "Processing..." text
  * Content dims slightly
  * Cannot interact with page
  * After 2-3 seconds: Success page appears (see below)

SUCCESS PAGE (after payment):
- Full-screen overlay:
  * Large checkmark animation (white, bouncy, 80px)
  * "Payment Successful! ✓" (white, 32px, bold)
  * "Your reservation is confirmed" (light gray, 18px)
  * Confirmation details repeat in smaller format
  * Buttons:
    - "Done" (orange gradient, 150px) - closes modal, returns to My Bookings
    - "Add to Calendar" (dark outline)
    - "Share Booking" (dark outline)
```

---

## 1️⃣3️⃣ CHAT WIDGET - INTEGRATED SIDEBAR
**Prompt:**
```
Design the integrated chat widget for AgentDine web (always available, sidebar).

SIDEBAR POSITION: Right side of screen, width 380px (can collapse to icon), always visible
- Or: Floating on top-right corner (alternative positioning)

COLLAPSED STATE (icon only):
- Floating on top-right corner: 60px diameter circle
- Gradient orange (#FF6B35 to #FF8C42)
- Icon: 💬 (chat emoji, white)
- Badge: Red dot with number (if unread messages) - "3" (white text)
- Shadow: 0 4px 20px rgba(255, 107, 53, 0.4)
- On hover: Slight scale effect (1.05x)
- Click: Expands to full chat

EXPANDED STATE (sidebar or full chat):

HEADER (sticky, dark #1a1218):
- Title: "Chef Assistant 🤖" (white, 18px, bold)
- Status: Green dot + "Online" (light green text, 12px)
- Minimize button: "_" (underscore icon, gray, clickable, white on hover)
- Close button: "✕" (X icon, gray)

CHAT AREA (scrollable, dark #0F1419):
- Message history (scrolls from bottom upward):

BOT MESSAGES (left-aligned):
- Message bubble:
  * Dark background (#334155)
  * White text
  * Orange left border (3px)
  * Rounded corners (12px, flat on left where border is)
  * Position: 20% from left
  * Example: "Hi! I'm Chef Assistant. What can I help you find today? 🍽️"
- Timestamp below message: "14:32" (light gray, 11px)
- Quick replies below message (horizontal chips):
  * "Find restaurant" (dark bg, orange text, 12px, clickable)
  * "Check a booking" (dark bg, orange text)
  * "View menu" (dark bg, orange text)
  * Chips become orange background (white text) when hovered

USER MESSAGES (right-aligned):
- Message bubble:
  * Orange gradient background (#FF6B35 to #FF8C42)
  * White text
  * Rounded corners (12px, flat on right)
  * Position: 80% from left
  * Example: "I want to book a table in Colombo for 4 people tomorrow"
- Timestamp: "14:35" (light gray, 11 px)
- Read receipt: "✓✓" (double checkmark, light gray)

BOT TYPING STATE:
- Message bubble with gray background
- 3 animated dots: ● ● ● (orange, bouncing animation)
- "Chef is typing..." (light gray text, 12px)

EXAMPLE CONVERSATION SHOWN:
1. Bot: "Hi! I'm Chef Assistant. What would you like to do?" + Quick chips (Find restaurant | Check booking | View menu)
2. User: "Find a seafood restaurant"
3. Bot: "Great! Which city? 🏙️ Colombo | Kandy | Galle | Negombo | Other" (displayed as buttons/chips)
4. User: "Colombo"
5. Bot: "Perfect! I found 23 seafood restaurants in Colombo. Top pick: 'The Lagoon' - 4.8⭐ with fresh daily catch. Book now? [Yes] [View Details] [See More Options]"
6. User: (Interactive button click feedback shown)

INPUT AREA (sticky at bottom, dark #1a1218):
- Text input field (full width minus padding):
  * Dark background #0F1419
  * Placeholder: "Type your message here... or say 🎤" (light gray)
  * White text when typing
  * Orange focus border (2px)
  * Rounded corners (8px)
  * Height: 44px
  * Padding: 10px left, 40px right (for send button)

- Right side buttons (inside input area):
  * Microphone icon (🎤, orange, 20px, clickable for voice input)
  * Send button (arrow, white text/icon on orange background, 30px circle, right-aligned)
  * On send: Input clears, message appears on right as user message
  * Button disabled if input is empty (grayed out)

SPECIAL FEATURES:

1. SUGGESTED ACTIONS (if user hasn't typed):
   - Horizontal chips below input (or above):
   * "🍍 Colombo" (quick filter)
   * "⭐ Top Rated" (sort option)
   * "🎉 Special Offers" (booking offer)
   * Clicking adds to text input or triggers action

2. DROPDOWN MENUS (if bot offers choices):
   - Appears where chat message is:
   * Dropdown format: "Select from list:"
   * Options: "Restaurant 1" | "Restaurant 2" | "Restaurant 3"
   * Clickable, updates chat when selected

3. LINKED PREVIEWS (if bot sends restaurant link):
   - Small card preview appears in chat:
     * Image (100x80px)
     * Name "Laksha"
     * Rating ⭐4.9
     * "Open Details" button (orange)
     * Clicking opens full restaurant page

4. KEYBOARD SHORTCUTS:
   - Hint text: "(Enter to send, Shift+Enter for new line)" (gray, 10px, only on first visit)

DESKTOP RESPONSIVE:
- Sidebar width: 380px (fixed on desktop)
- On smaller screens: Collapses to floating button, expands as full-screen overlay
- Mobile: Full-screen chat interface

ACCESSIBILITY:
- Keyboard navigation (Tab through quick reply chips)
- Screen reader friendly labels
- Focus indicators visible (orange border)
- Clear semantics (role="dialog" for chat)
```

---

## 🌐 WEB DESIGN PRINCIPLES & GUIDELINES

### TYPOGRAPHY
- **Heading**: Inter Bold (or San Francisco Bold), 32px-52px, white #ffffff
- **Subheading**: Inter SemiBold, 18px-24px, white #ffffff
- **Body**: Inter Regular, 14px-16px, light gray #b0b8c1
- **Label**: Inter Medium, 12px-14px, gray #505a6a
- **Code/Mono**: Courier, 12px-14px, orange #FF8C42 (for confirmation codes, booking codes)

### SPACING & GRID
- **Column Grid**: 12-column grid, 1440px max-width
- **Gutter**: 20px between columns
- **Margin**: 40px/60px/80px between major sections
- **Padding**: 20px/30px/40px inside cards and containers

### BUTTONS & CTA
- **Primary Button**: Orange gradient (#FF6B35 to #FF8C42), white text, 50px height, rounded 8px
  * Hover: Brightness +10%, shadow increased
  * Active: Brightness -5%, slight press animation
  * Disabled: Grayed out, cursor not-allowed
  
- **Secondary Button**: Dark outline, orange border, white/orange text, 50px height
  * Hover: Orange background fills, white text
  * Active: Filled orange background
  
- **Tertiary/Danger**: Red outline (#E63946), red text, 50px height
  * Hover: Red background fills, white text

### COLORS IN CONTEXT
- **Primary Actions**: Orange gradient #FF6B35 → #FF8C42
- **Threats/Cancellations**: Red #E63946
- **Success/Status**: Green #2ecc71
- **Warnings/Priority**: Gold #FFD700
- **Background**: Dark #0F1419
- **Card Background**: Slightly lighter #16202f
- **Text**: White #ffffff (primary), Light gray #b0b8c1 (secondary)
- **Borders**: Subtle orange rgba(255, 140, 66, 0.3)

### INTERACTIONS & ANIMATIONS
- **Hover States**: Color intensity +10%, subtle shadow increase
- **Click/Active**: Text/icon slightly bolder, shadow more pronounced
- **Loading**: Spinner animation (orange, rotating 1.5s infinite)
- **Success**: Green checkmark with bounce animation (scale: 0.8 → 1.0 → 0.95)
- **Error**: Red shake animation (translateX ±3px)
- **Transitions**: All 0.2s ease-in-out (where smooth transition makes sense)

### RESPONSIVE BREAKPOINTS
- **Desktop**: 1440px+ (full 2-column layouts, sidebars visible)
- **Laptop**: 1024px-1439px (slight compression, multi-column maintained)
- **Tablet**: 768px-1023px (single column for content areas, sidebars stack)
- **Mobile**: Below 768px (full-screen layouts, floating chat)

### ACCESSIBILITY
- **Color Contrast**: All text meets WCAG AA standard (4.5:1 minimum)
- **Focus States**: Orange outline on all interactive elements
- **Keyboard Navigation**: Tab order logical, Enter/Space trigger actions
- **Semantic HTML**: Proper headings, labels, ARIA roles
- **Icon + Text**: Icons always paired with text (not icon-only buttons)

### FORM DESIGN
- **Input Fields**: Dark background, white text, orange focus border
- **Placeholder Text**: Light gray, size 14px
- **Labels**: Above input, white text, 12px, bold
- **Error Messages**: Red text, icon 🚫, position below input
- **Success Messages**: Green text, icon ✓, position below input
- **Validation**: Real-time feedback (green checkmark as user types correctly)

### CARDS & CONTAINERS
- **Card Background**: #16202f with subtle border rgba(255, 140, 66, 0.3)
- **Padding**: 20px-30px inside cards
- **Border Radius**: 12px for cards, 8px for smaller elements
- **Shadow**: Subtle 0 4px 12px rgba(0, 0, 0, 0.3) on hover
- **Divider**: 1px solid rgba(255, 140, 66, 0.15) between sections

---

## 🎯 MAGIC PATTERNS SUBMISSION GUIDE FOR WEB

### Steps to Generate Each Design:

1. **Go to**: https://www.magicpatterns.com
2. **Sign up/Login** (if not already)
3. **Click**: "Create Design" or "New Design"
4. **Select Project Type**: "Website" (not Mobile App)
5. **Paste the prompt** from above into the text area
6. **Set device**: "Desktop" (1440px wide) or "Responsive" if available
7. **Paste color palette**:
```
Primary: #FF6B35, #FF8C42
Secondary: #E63946
Accent: #FFD700, #FFB84D
Dark BG: #0F1419, #1a1218
Card BG: #16202f
Text: #ffffff
Text Light: #b0b8c1
```
8. **Font**: "Inter" (if available) or "San Francisco"
9. **Click**: "Generate Design"
10. **Review**: Check generated design
11. **Refine**: Use editor to adjust if needed
12. **Export**: Download as PNG/SVG/Figma link

---

## 📋 DESIGN CHECKLIST FOR CUSTOMER WEB APPLICATION

- [ ] All designs are desktop-optimized (1440px minimum)
- [ ] Color palette is consistent across all screens
- [ ] Text is readable (white #ffffff or light gray on dark #0F1419)
- [ ] Orange (#FF8C42) used for all primary CTAs
- [ ] Red (#E63946) used for alerts/cancellations
- [ ] Gold (#FFD700) used for ratings/premium
- [ ] Header/Footer consistent across pages
- [ ] Chat widget accessible from all pages
- [ ] Proper responsive breakpoints (1440px, 1024px, 768px)
- [ ] Hover states designed for all interactive elements
- [ ] Loading states designed (spinners, skeletons)
- [ ] Empty states designed (no data scenarios)
- [ ] Error states designed (validation, failures)
- [ ] Sri Lankan locations and restaurants featured
- [ ] Local currency (Rs.) shown in all pricing
- [ ] Smooth transitions between pages
- [ ] Proper focus states for keyboard navigation
- [ ] All buttons are 48px+ height (accessibility)
- [ ] Confirmation codes use monospace font
- [ ] Payment page follows PCI standards (no sensitive data visible)

---

## 📸 EXPORT & USE

After generating designs from Magic Patterns:

1. **Download** each design as PNG/SVG/Figma
2. **Organize folder**:
   ```
   /designs/web/
   ├── landing-page.png
   ├── sign-up.png
   ├── sign-in.png
   ├── restaurant-discovery.png
   ├── restaurant-details.png
   ├── booking-step-1.png
   ├── booking-step-2.png
   ├── booking-step-3.png
   ├── my-bookings.png
   ├── user-profile.png
   ├── restaurant-reviews.png
   ├── payment-checkout.png
   └── chat-widget.png
   ```
3. **Share** with development team
4. **Reference** during component development
5. **Update** as design evolves

---

## 🚀 NEXT STEPS

1. ✅ Generate designs using prompts above (13 pages total)
2. ✅ Review designs with stakeholders
3. ✅ Create React component library matching designs
4. ✅ Build all pages with TypeScript + Tailwind CSS
5. ✅ Integrate with backend API (restaurants, bookings, reviews)
6. ✅ Test on multiple desktop sizes (1440px, 1024px, 768px)
7. ✅ Optimize for performance (lazy loading, code splitting)
8. ✅ Add animations (page transitions, micro-interactions)
9. ✅ Implement error handling and loading states
10. ✅ Deploy to production

**Ready to generate web designs for AgentDine Customer Portal! 🎉**

---

## 💡 ADDITIONAL RESOURCES

**Sri Lankan Restaurant Details**:
- "The Lagoon" - Seafood, Colombo 1, ⭐4.8
- "Laksha" - Sri Lankan Fusion, Colombo 3, ⭐4.9
- "Ministry of Crab" - Seafood, Colombo 3, ⭐4.8
- "Ottos" - International, Colombo 4, ⭐4.7

**Cities**: Colombo, Kandy, Galle, Negombo, Ella, Mirissa, Jaffna, Anuradhapura

**Cuisines**: Curry House, Kottu Roti, Lamprais, String Hoppers, Seafood, Vegetarian, Fusion

---

**Document Version**: 1.0  
**Last Updated**: April 13, 2026  
**Status**: Ready for Magic Patterns Design Generation
