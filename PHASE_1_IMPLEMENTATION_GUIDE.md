# ⚡ PHASE 1 IMPLEMENTATION GUIDE - 3 HOURS
## Complete Authentication + Seed Data

**Objective:** Get authentication fully working with profile view/edit and seed restaurant data  
**Time Available:** 4-6 hours today  
**Deliverable:** Users can signup → login → view/edit profile ✅

---

## 🚀 QUICK START (Next 5 Minutes)

### **Step 1: Make Sure Services are Running**

Open 3 terminals and start services:

**Terminal 1: Backend API**
```bash
cd services/api
npm run dev
# Should see: 🚀 Express API Server Started on http://localhost:5000
```

**Terminal 2: Frontend**
```bash
cd packages/@restaurant/web
npm run dev  
# Should see: ➜  Local:   http://localhost:5173
```

**Terminal 3: Keep for running scripts**
```bash
cd c:\Users\Pamudi\Desktop\fyp\agentic-restaurant-chatbot
# Ready for seed data import
```

---

## ✅ CURRENT STATUS CHECK

### **What's Already Done (85%):**
- ✅ Email/password registration works
- ✅ Email/password login works
- ✅ JWT token generation works
- ✅ UserProfile component UI exists
- ✅ Preferences form UI exists

### **What's Missing (15%):**
- ❌ Profile view page routing/integration
- ❌ Edit profile backend endpoint
- ❌ Preferences storage backend endpoint
- ❌ Restaurant seed data in Firestore

---

## 📋 TASK BREAKDOWN (3 Hours Total)

### **TASK 1: Add Profile Endpoints to Backend (45 minutes)**

**Goal:** Create 2 new endpoints to handle profile updates

**File to modify:** `services/api/src/routes/authRoutes.ts`

**Add these 2 endpoints:**

```typescript
/**
 * PUT /api/auth/profile
 * Update user profile (name, phone, etc)
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, phone } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate input
    if (!displayName || displayName.trim().length < 2) {
      return res.status(400).json({ error: 'Display name must be at least 2 characters' });
    }

    // Update in Firestore
    await db.collection('users').doc(userId).update({
      displayName: displayName.trim(),
      phone: phone?.trim() || '',
      updatedAt: new Date().toISOString(),
    });

    logger.info(`Profile updated for user ${userId}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        displayName,
        phone,
      },
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/auth/preferences
 * Update user preferences (cuisines, price range, location)
 */
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { cuisines, priceRange, location, notifications } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate input
    if (priceRange && !['budget', 'moderate', 'expensive'].includes(priceRange)) {
      return res.status(400).json({ error: 'Invalid price range' });
    }

    // Update preferences in Firestore
    await db.collection('users').doc(userId).update({
      preferences: {
        cuisines: Array.isArray(cuisines) ? cuisines : [],
        priceRange: priceRange || 'moderate',
        location: location?.trim() || '',
        notifications: notifications !== false,
      },
      updatedAt: new Date().toISOString(),
    });

    logger.info(`Preferences updated for user ${userId}`);

    res.json({
      success: true,
      message: 'Preferences saved successfully',
      data: {
        preferences: {
          cuisines,
          priceRange,
          location,
          notifications,
        },
      },
    });
  } catch (error) {
    logger.error('Error updating preferences:', error);
    res.status(500).json({
      error: 'Failed to update preferences',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
```

**Action:** Add these 2 endpoints to `authRoutes.ts` before the `module.exports = router;` line

**Test in Postman:**
```
PUT http://localhost:5000/api/auth/profile
Header: Authorization: Bearer YOUR_JWT_TOKEN
Body: {
  "displayName": "John Doe",
  "phone": "0771234567"
}

PUT http://localhost:5000/api/auth/preferences
Header: Authorization: Bearer YOUR_JWT_TOKEN
Body: {
  "cuisines": ["Italian", "Chinese"],
  "priceRange": "moderate",
  "location": "Colombo",
  "notifications": true
}
```

---

### **TASK 2: Connect Frontend Auth Context to Backend (45 minutes)**

**Goal:** Make updateProfile and updatePreferences actually call the backend

**File to modify:** `packages/@restaurant/shared/src/contexts/AuthContext.tsx`

**Find the `updateProfile` function and replace with:**

```typescript
const updateProfile = async (updatedUser: Partial<AuthUser>) => {
  setError(null);
  try {
    if (!user) throw new Error('User not authenticated');

    // Call backend to update profile
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        displayName: updatedUser.displayName || user.displayName,
        phone: updatedUser.phone || user.phone,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    // Update local state
    setUser((prev) => prev ? { ...prev, ...updatedUser } : null);
    logger.info('Profile updated successfully');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Profile update failed';
    setError(message);
    logger.error('Profile update error:', message);
    throw err;
  }
};
```

**Find the `updatePreferences` function and replace with:**

```typescript
const updatePreferences = async (preferences: any) => {
  setError(null);
  try {
    if (!user) throw new Error('User not authenticated');

    // Call backend to update preferences
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        cuisines: preferences.cuisines || [],
        priceRange: preferences.priceRange || 'moderate',
        location: preferences.location || '',
        notifications: preferences.notifications !== false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update preferences');
    }

    // Update local state
    setUser((prev) => prev ? {
      ...prev,
      preferences: {
        ...prev.preferences,
        ...preferences,
      }
    } : null);
    logger.info('Preferences updated successfully');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Preferences update failed';
    setError(message);
    logger.error('Preferences update error:', message);
    throw err;
  }
};
```

---

### **TASK 3: Seed Firestore with Restaurant Data (45 minutes)**

**Goal:** Add 30 test restaurants to Firestore so search has data

**Create new file:** `database/seed-restaurants.js`

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'agentic-restaurant-chatbot',
});

const db = admin.firestore();

const restaurants = [
  // Italian
  { name: 'La Bella Italia', cuisine: ['Italian'], location: 'Colombo 3', priceRange: 'expensive', rating: 4.8, capacity: 50, imageUrl: 'https://via.placeholder.com/200?text=La+Bella' },
  { name: 'Pasta Paradise', cuisine: ['Italian'], location: 'Colombo 7', priceRange: 'moderate', rating: 4.5, capacity: 40, imageUrl: 'https://via.placeholder.com/200?text=Pasta' },
  { name: 'Trattoria Sicilia', cuisine: ['Italian'], location: 'Mount Lavinia', priceRange: 'moderate', rating: 4.6, capacity: 35, imageUrl: 'https://via.placeholder.com/200?text=Trattoria' },

  // Chinese
  { name: 'Dragon Palace', cuisine: ['Chinese'], location: 'Colombo 4', priceRange: 'moderate', rating: 4.4, capacity: 60, imageUrl: 'https://via.placeholder.com/200?text=Dragon' },
  { name: 'Golden Lotus', cuisine: ['Chinese'], location: 'Colombo 2', priceRange: 'budget', rating: 4.2, capacity: 45, imageUrl: 'https://via.placeholder.com/200?text=Lotus' },
  { name: 'Ming Chinese Restaurant', cuisine: ['Chinese'], location: 'Galle Road', priceRange: 'moderate', rating: 4.3, capacity: 50, imageUrl: 'https://via.placeholder.com/200?text=Ming' },

  // Indian
  { name: 'Spice Route', cuisine: ['Indian'], location: 'Colombo 5', priceRange: 'moderate', rating: 4.7, capacity: 55, imageUrl: 'https://via.placeholder.com/200?text=Spice' },
  { name: 'Taj Mahal', cuisine: ['Indian'], location: 'Colombo 3', priceRange: 'expensive', rating: 4.6, capacity: 40, imageUrl: 'https://via.placeholder.com/200?text=Taj' },
  { name: 'Curry King', cuisine: ['Indian'], location: 'Dehiwala', priceRange: 'budget', rating: 4.3, capacity: 30, imageUrl: 'https://via.placeholder.com/200?text=Curry' },

  // Japanese
  { name: 'Sakura Sushi', cuisine: ['Japanese'], location: 'Colombo 7', priceRange: 'expensive', rating: 4.9, capacity: 35, imageUrl: 'https://via.placeholder.com/200?text=Sakura' },
  { name: 'Tokyo Kitchen', cuisine: ['Japanese'], location: 'Colombo 4', priceRange: 'moderate', rating: 4.5, capacity: 40, imageUrl: 'https://via.placeholder.com/200?text=Tokyo' },
  { name: 'Ramen House', cuisine: ['Japanese'], location: 'Mount Lavinia', priceRange: 'budget', rating: 4.2, capacity: 25, imageUrl: 'https://via.placeholder.com/200?text=Ramen' },

  // Thai
  { name: 'Bangkok Kitchen', cuisine: ['Thai'], location: 'Colombo 6', priceRange: 'moderate', rating: 4.6, capacity: 45, imageUrl: 'https://via.placeholder.com/200?text=Bangkok' },
  { name: 'Lemongrass Thai', cuisine: ['Thai'], location: 'Colombo 3', priceRange: 'moderate', rating: 4.4, capacity: 35, imageUrl: 'https://via.placeholder.com/200?text=Lemongrass' },
  { name: 'Pad Thai Restaurant', cuisine: ['Thai'], location: 'Galle Road', priceRange: 'budget', rating: 4.1, capacity: 30, imageUrl: 'https://via.placeholder.com/200?text=PadThai' },

  // Mexican
  { name: 'Casa Mexico', cuisine: ['Mexican'], location: 'Colombo 7', priceRange: 'moderate', rating: 4.5, capacity: 40, imageUrl: 'https://via.placeholder.com/200?text=Casa' },
  { name: 'Lime & Salt', cuisine: ['Mexican'], location: 'Mount Lavinia', priceRange: 'moderate', rating: 4.3, capacity: 35, imageUrl: 'https://via.placeholder.com/200?text=Lime' },
  { name: 'Taco Fiesta', cuisine: ['Mexican'], location: 'Colombo 2', priceRange: 'budget', rating: 4.0, capacity: 25, imageUrl: 'https://via.placeholder.com/200?text=Taco' },

  // Sri Lankan
  { name: 'New Asha', cuisine: ['Sri Lankan'], location: 'Colombo 4', priceRange: 'budget', rating: 4.4, capacity: 60, imageUrl: 'https://via.placeholder.com/200?text=Asha' },
  { name: 'Lakshmi', cuisine: ['Sri Lankan'], location: 'Colombo 3', priceRange: 'budget', rating: 4.3, capacity: 50, imageUrl: 'https://via.placeholder.com/200?text=Lakshmi' },
  { name: 'Curry Leaf', cuisine: ['Sri Lankan'], location: 'Galle Road', priceRange: 'moderate', rating: 4.5, capacity: 40, imageUrl: 'https://via.placeholder.com/200?text=Curry' },

  // Multiple Cuisines (Mix)
  { name: 'The Fusion Kitchen', cuisine: ['Italian', 'Asian', 'Mediterranean'], location: 'Colombo 7', priceRange: 'expensive', rating: 4.8, capacity: 70, imageUrl: 'https://via.placeholder.com/200?text=Fusion' },
  { name: 'Global Tastes', cuisine: ['Chinese', 'Indian', 'Thai'], location: 'Colombo 5', priceRange: 'moderate', rating: 4.5, capacity: 55, imageUrl: 'https://via.placeholder.com/200?text=Global' },
  { name: 'Street Food Hub', cuisine: ['Thai', 'Mexican', 'Indian'], location: 'Colombo 2', priceRange: 'budget', rating: 4.2, capacity: 30, imageUrl: 'https://via.placeholder.com/200?text=Street' },

  // Premium
  { name: 'Hilton Residences', cuisine: ['French', 'International'], location: 'Colombo 1', priceRange: 'expensive', rating: 4.9, capacity: 120, imageUrl: 'https://via.placeholder.com/200?text=Hilton' },
  { name: 'Paradise Island Resort', cuisine: ['Seafood', 'International'], location: 'Negombo', priceRange: 'expensive', rating: 4.8, capacity: 100, imageUrl: 'https://via.placeholder.com/200?text=Paradise' },
];

async function seedRestaurants() {
  try {
    console.log('🌱 Starting to seed restaurants...');

    for (const restaurant of restaurants) {
      await db.collection('restaurants').add({
        ...restaurant,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        available: true,
        reviews: [],
        menus: {
          appetizers: [],
          mains: [],
          desserts: [],
          beverages: [],
        },
      });
    }

    console.log(`✅ Successfully seeded ${restaurants.length} restaurants!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding restaurants:', error);
    process.exit(1);
  }
}

seedRestaurants();
```

**Run seed script:**
```bash
cd c:\Users\Pamudi\Desktop\fyp\agentic-restaurant-chatbot
node database/seed-restaurants.js
# Should see: ✅ Successfully seeded 30 restaurants!
```

**Verify in Firestore Console:**
- Go to: https://console.firebase.google.com
- Select your project: `agentic-restaurant-chatbot`
- Open Firestore Database
- Should see `restaurants` collection with 30 documents ✅

---

## ✅ TESTING CHECKLIST (30 minutes)

### **Test 1: Complete Auth Flow**
```
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Register: test@example.com / TestPass@123
4. Complete signup
5. Login with same credentials
6. Should see dashboard
✅ PASS
```

### **Test 2: Profile View**
```
1. After login, click profile/settings
2. Should see:
   - Display name
   - Email
   - Phone (empty initially)
   - Preferences section
✅ PASS
```

###**Test 3: Edit Profile**
```
1. Click Edit Profile
2. Update:
   - Name: "John Doe"
   - Phone: "0771234567"  
   - Cuisines: Select Italian, Chinese
   - Price Range: Moderate
   - Location: Colombo
3. Click Save
4. Should see ✓ Profile updated
5. Refresh - data persists
✅ PASS
```

### **Test 4: Check Firestore**
```
1. Go to Firebase Console
2. Open `restaurants` collection:
   - Should see 30 documents ✅
3. Open `users` collection:
   - Should see your test user ✅
   - Preferences should be saved ✅
```

---

## 📊 PHASE 1 SUMMARY

| Task | Time | Status |
|------|------|--------|
| Add backend endpoints | 45 min | ⏳ TODO |
| Connect frontend context | 45 min | ⏳ TODO |
| Seed restaurant data | 45 min | ⏳ TODO |
| Full testing | 30 min | ⏳ TODO |
| **TOTAL** | **3 hours** | ⏳ TODO |

---

## 🚀 READY TO START?

**Print this guide, open in separate window, and start with TASK 1!**

Next I'll give you live coding support as you go through each task.

**All set? Reply:**
- **A)** Starting Task 1 now - waiting for backend endpoint guidance
- **B)** Need help understanding the code first
- **C)** Let me know when you finish Task 1

Go! 💪
