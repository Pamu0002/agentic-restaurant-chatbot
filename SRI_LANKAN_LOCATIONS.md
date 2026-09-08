# Supported Sri Lankan Locations

This document lists all supported locations for restaurant discovery in the chatbot system.

## Supported Cities

The chatbot only works with Sri Lankan cities and locations. Below is the complete list:

### Major Cities
- **Colombo** - Capital city, most restaurants available
- **Kandy** - Cultural center, hill country
- **Galle** - Coastal city, south coast
- **Jaffna** - Northern peninsula
- **Trincomalee** - Eastern coast, historic port city

### Western/Coastal Region
- **Negombo** - Beach resort town, north coast
- **Kalutara** - Coastal town
- **Kotugoda** - Coastal area
- **Beruwala** - Beach resort
- **Wadduwa** - Coastal area
- **Bentota** - Popular beach destination

### Southern Region
- **Matara** - Coastal city, south coast
- **Unawatuna** - Beach town near Galle
- **Hikkaduwa** - Beach resort
- **Mirissa** - Southern beach town
- **Akuressa** - Southern town
- **Weligama** - Historic coastal town

### Central/Hill Country
- **Dambulla** - Central region, cave temples area
- **Sigiriya** - Central highlands, famous rock fortress
- **Ella** - Hill country town, scenic area
- **Nuwara Eliya** - Central highlands, cool climate

### North-Central Region
- **Anuradhapura** - Ancient city, archaeological sites
- **Polonnaruwa** - Ancient city, central region

### Other Supported Areas
- **Madampe** - Western region

---

## Example Usage

### Valid Queries
✅ "Find Italian restaurants in Colombo"
✅ "Search for restaurants in Kandy for 4 people"
✅ "Find vegetarian restaurants in Galle"
✅ "Book a table in Negombo"
✅ "What restaurants are available in Ella"

### Invalid Queries
❌ "Find restaurants in Paris"
❌ "Show me restaurants in London"
❌ "Search for restaurants in New York"

---

## How to Reference Cities

When extracting locations from user messages, the chatbot:

1. **Case-insensitive matching** - "Colombo", "colombo", "COLOMBO" all work
2. **Partial word matching** - "Find restaurants in Colombo for 4" extracts "Colombo"
3. **Default fallback** - If no city is mentioned, defaults to "Colombo"
4. **Validation** - Location is validated against the supported cities list

---

## Adding New Cities

To add a new Sri Lankan city:

1. Update the `SRI_LANKA_CITIES` array in `services/chatService.ts`
2. Add the city name in lowercase
3. Update this documentation file
4. Ensure the Python AI backend knows about the city in its database

Example:
```typescript
const SRI_LANKA_CITIES = [
  'colombo', 'kandy', 'galle', 'jaffna', 'trincomalee',
  // ... existing cities ...
  'newcity' // Add new city here
];
```

---

## Validation Function

The chatbot exposes a validation function to check if a location is valid:

```typescript
import { isValidSriLankanLocation } from '@restaurant/web/services/chatService';

// Check if location is valid
if (isValidSriLankanLocation('Colombo')) {
  // Valid location
} else {
  // Invalid location
}
```

---

## Geographic Distribution

**By Region:**
- Western/Coastal: 8 cities (Negombo, Kalutara, Kotugoda, Beruwala, Wadduwa, Bentota, Madampe, Tekka)
- Southern: 6 cities (Matara, Unawatuna, Hikkaduwa, Mirissa, Akuressa, Weligama)
- Central/Hill Country: 5 cities (Dambulla, Sigiriya, Ella, Nuwara Eliya, and surrounding areas)
- North-Central: 3 cities (Anuradhapura, Polonnaruwa, and surrounding areas)
- Northern: 2 cities (Jaffna, Trincomalee)
- Eastern: Trincomalee region

---

## Future Enhancements

- [ ] Add more specific locations/neighborhoods
- [ ] Support for district names (Western District, Central District, etc.)
- [ ] Support for regional areas
- [ ] Location autocomplete suggestions
- [ ] Show nearest restaurants based on GPS location
- [ ] Support for specific neighborhoods or landmarks

---

## Status

**Last Updated:** April 2026  
**Total Supported Cities:** 23  
**Region Coverage:** All major regions of Sri Lanka  
**Status:** ✅ Active
