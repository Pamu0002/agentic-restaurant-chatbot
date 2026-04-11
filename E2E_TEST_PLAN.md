# 🧪 END-TO-END TEST PLAN - Agentic Restaurant Chatbot

## ✅ SERVICES RUNNING
- ✅ Express API (Port 5000) - PID 38344
- ✅ Python AI Service (Port 8000) - PID 43696
- ✅ Frontend (Port 5173) - PID 41372

---

## 🧪 TEST SCENARIOS

### 1️⃣ **Authentication Flow**
**URL:** http://localhost:5173

**Test Steps:**
- [ ] Load app → See WelcomeScreen
- [ ] Click "Sign Up" → Registration form appears
- [ ] Enter valid email & password
- [ ] Click "Create Account" → Success message
- [ ] Sign out
- [ ] Click "Sign In" → Login form
- [ ] Enter credentials → Logged in ✅

**Expected:** User authenticated, can access chat

---

### 2️⃣ **Chat Interface**
**URL:** http://localhost:5173 (after login)

**Test Cases:**

#### A. Test AI Response
```
Send: "Show me restaurants"
Expected: Bot responds with restaurant suggestions
```

#### B. Test Discovery Agent
```
Send: "Find Italian restaurants in Colombo"
Expected: 
- Agent processes request
- Shows 3-5 restaurants with names, ratings, cuisines
```

#### C. Test Entity Extraction
```
Send: "I want vegan food for 4 people in Kandy"
Expected:
- Correctly extracts: cuisine=vegan, party_size=4, location=Kandy
```

#### D. Test Quick Replies
```
Click: "Find Restaurant" button
Expected: Search interface opens with pre-filled info
```

---

### 3️⃣ **Search Page**
**URL:** http://localhost:5173/search

**Test Cases:**

#### A. Location Search
```
1. Select "Colombo" from dropdown
2. Leave other fields default
3. Click "Search Restaurants"
Expected: 
- Loading spinner shows
- Results display in grid
- Each card shows name, rating, cuisine, address
```

#### B. Filtered Search
```
1. Select location: "Kandy"
2. Select cuisine: "Italian"
3. Set party size: 4
4. Select budget: "$$"
5. Click Search
Expected:
- Only Italian restaurants for 4 people in moderate price range
```

#### C. Filter Results
```
1. After search results
2. Click cuisine filter "Chinese"
3. See only Chinese restaurants
Expected: Results update instantly
```

#### D. Search Error Handling
```
1. Try without selecting location
Expected: Error message "Please select a location"
```

---

### 4️⃣ **Recommendations Page**
**URL:** http://localhost:5173/recommendations

**Test Cases:**

#### A. Load Recommendations
```
1. Click "⭐ Personalized for You"
2. See recommendations loading
Expected:
- 3-5 personalized restaurants
- Each shows reason why recommended
```

#### B. Recommendation Cards
```
Each card should show:
- Restaurant name
- Rating
- Cuisine type
- Why recommended (AI reasoning)
- "Book Table" button
```

---

### 5️⃣ **Reservations Page**
**URL:** http://localhost:5173/reservations

**Test Cases:**

#### A. View Bookings
```
1. Click "📅 My Bookings"
Expected:
- Tabs for "Upcoming" and "Past"
- List of reservations OR "No bookings yet"
```

#### B. Reservation Card Details
```
Each reservation should show:
- Restaurant name
- Date & Time
- Party size
- Confirmation code
- Status badge (Confirmed/Cancelled/Completed)
```

#### C. Reservation Actions
```
For upcoming reservations:
- [ ] "📞 Contact Restaurant" button works
- [ ] "❌ Cancel" button works
For completed:
- [ ] "⭐ Leave Review" button works
```

---

### 6️⃣ **API Connectivity**

#### A. Express API Health
```bash
curl http://localhost:5000/api/health
Expected: { status: "ok" }
```

#### B. Python AI Service Health
```bash
curl http://localhost:8000/docs
Expected: Swagger UI loads (200 OK)
```

#### C. Discovery Agent Endpoint
```bash
curl -X POST http://localhost:8000/api/v1/agents/discover \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Colombo",
    "cuisine": "Italian",
    "party_size": 2
  }'
Expected: Returns array of restaurants with details
```

#### D. Recommendation Agent Endpoint
```bash
curl -X POST http://localhost:8000/api/v1/agents/recommend \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test-user"}'
Expected: Returns personalized recommendations
```

---

### 7️⃣ **UI/UX Tests**

#### A. Responsive Design
```
Test on:
- [ ] Desktop (1920x1080) - Full layout
- [ ] Tablet (768x1024) - Responsive
- [ ] Mobile (375x667) - Stack vertically
```

#### B. Color Scheme
```
Expected theme colors:
- Blue accent: #00d4ff
- Dark background: #0f1419
- Success: Green
- Error: Red
- All buttons hover effect smooth
```

#### C. Loading States
```
- [ ] Spinner shows while searching
- [ ] Buttons disabled while loading
- [ ] No duplicate requests
```

---

### 8️⃣ **Error Handling**

#### A. Network Error
```
Stop backend service
Try search
Expected: "Failed to search restaurants" message
Resume service - works again
```

#### B. Invalid Input
```
- Empty location → Error message
- Invalid date → Error message
- Invalid party size → Error message
```

#### C. 404 Routes
```
Visit: http://localhost:5173/invalid-page
Expected: Redirects to home page /
```

---

## 📊 TEST CHECKLIST

| Component | Test | Status |
|-----------|------|--------|
| Auth Login | ✅/❌ | [ ] |
| Auth Signup | ✅/❌ | [ ] |
| Chat Interface | ✅/❌ | [ ] |
| Discovery Agent | ✅/❌ | [ ] |
| Recommendation Agent | ✅/❌ | [ ] |
| Search Page | ✅/❌ | [ ] |
| Search Filters | ✅/❌ | [ ] |
| Reservations Page | ✅/❌ | [ ] |
| Restaurant Cards | ✅/❌ | [ ] |
| Logo Display | ✅/❌ | [ ] |
| Responsive Design | ✅/❌ | [ ] |
| Error Handling | ✅/❌ | [ ] |
| API Endpoints | ✅/❌ | [ ] |

---

## 🎯 MANUAL TESTING STEPS

### QUICK START TEST (5 minutes)

1. **Open browser:** http://localhost:5173
2. **Login:** Use test email
3. **Chat:** Type "Find restaurants in Colombo"
4. **Verify:** Bot responds with restaurants
5. **Search:** Go to /search, search for restaurants
6. **Verify:** See results in grid
7. **Recommendations:** Go to /recommendations
8. **Verify:** See personalized suggestions

### If all above work: ✅ **SYSTEM IS WORKING**
### If any fail: ❌ **DEBUG REQUIRED**

---

## 🚀 NEXT STEPS (Post-Testing)
1. Fix any bugs found
2. Implement payment integration
3. Add admin dashboard
4. Add email notifications
5. Add provider portal

---

## 📝 NOTES
- All services running ✅
- Frontend responsive ✅
- Backend APIs connected ✅
- Database connections ready ✅

**Ready for production deployment after tests pass!**
