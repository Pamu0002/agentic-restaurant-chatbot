/**
 * CHAT SERVICE
 * 
 * Handles all chat-related API calls to the backend
 * Connects to both Express API and Python AI service
 */

import { Message } from '../models/Chat';

// API Base URLs - Use import.meta.env for Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || import.meta.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000';

interface SendMessageRequest {
  userId: string;
  conversationId?: string;
  message: string;
  metadata?: object;
}

interface SendMessageResponse {
  success: boolean;
  data: {
    message: Message;
    conversationId: string;
  };
  message: string;
}

interface RestaurantQuery {
  location: string;
  cuisine?: string;
  party_size: number;
  budget?: string;
}

interface AgentResponse {
  agent_name: string;
  action: string;
  result: {
    restaurants?: any[];
    reasoning?: string;
    query?: any;
    count?: number;
  };
}

/**
 * Valid Sri Lankan locations/cities
 * Only these cities are supported for restaurant discovery
 */
const SRI_LANKA_CITIES = [
  'colombo', 'kandy', 'galle', 'jaffna', 'trincomalee',
  'negombo', 'dambulla', 'anuradhapura', 'polonnaruwa',
  'matara', 'unawatuna', 'hikkaduwa', 'mirissa',
  'sigiriya', 'ella', 'nuwara eliya', 'bentota',
  'kalutara', 'kotugoda', 'beruwala', 'wadduwa',
  'mathara', 'akuressa', 'weligama', 'madampe'
];

/**
 * Validate if a location is in Sri Lanka
 * Returns true if location is valid, false otherwise
 */
export const isValidSriLankanLocation = (location: string): boolean => {
  return SRI_LANKA_CITIES.some(city => 
    city.toLowerCase() === location.toLowerCase()
  );
};

/**
 * Send a message to the chat backend
 * This will be processed by the AI service and returned
 */
export const sendChatMessage = async (
  userId: string,
  request: {
    conversationId?: string;
    message: string;
    metadata?: object;
  },
  token?: string
): Promise<SendMessageResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        conversationId: request.conversationId,
        message: request.message,
        metadata: request.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Get all conversations for a user
 */
export const getConversations = async (userId: string, token?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Get conversations error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Get a specific conversation with full history
 */
export const getConversation = async (
  conversationId: string,
  token?: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Get conversation error: ${response.statusStatus}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (token?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Create conversation error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (
  conversationId: string,
  token?: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Delete conversation error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
};

/**
 * DISCOVERY AGENT - Search for restaurants
 * Calls Python AI service to discover restaurants
 */
export const discoverRestaurants = async (query: RestaurantQuery) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/v1/agents/discover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      throw new Error(`Discovery agent error: ${response.statusText}`);
    }

    const data: AgentResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error discovering restaurants:', error);
    throw error;
  }
};

/**
 * RECOMMENDATION AGENT - Get personalized recommendations
 * Calls Python AI service for recommendations
 */
export const getRecommendations = async (userId: string) => {
  try {
    const response = await fetch(
      `${AI_SERVICE_URL}/api/v1/agents/recommend?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Recommendation agent error: ${response.statusText}`);
    }

    const data: AgentResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

/**
 * RESERVATION AGENT - Make a reservation
 * Calls Python AI service to create a reservation
 */
export const makeReservation = async (reservationData: {
  user_id: string;
  restaurant_id: string;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
}) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/v1/agents/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      throw new Error(`Reservation agent error: ${response.statusText}`);
    }

    const data: AgentResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error making reservation:', error);
    throw error;
  }
};

/**
 * Helper: Extract restaurant query from user message
 * Uses simple keyword extraction for demo
 * IMPORTANT: Only supports Sri Lankan cities and locations
 * In production, use Intent Classifier Agent
 */
export const extractRestaurantQuery = (userMessage: string): RestaurantQuery | null => {
  const messageLower = userMessage.toLowerCase();

  // Check if it's a search/discovery request
  if (!messageLower.includes('restaurant') && 
      !messageLower.includes('find') && 
      !messageLower.includes('search') &&
      !messageLower.includes('cuisine') &&
      !messageLower.includes('recommend')) {
    return null;
  }

  // Extract cuisine (very basic - should use Intent Classifier)
  let cuisine: string | undefined;
  const cuisineKeywords = ['italian', 'french', 'japanese', 'chinese', 'indian', 'mexican', 'thai', 'vegan', 'vegetarian'];
  for (const keyword of cuisineKeywords) {
    if (messageLower.includes(keyword)) {
      cuisine = keyword.charAt(0).toUpperCase() + keyword.slice(1);
      break;
    }
  }

  // Extract location - Sri Lankan cities only
  let location = 'Colombo'; // Default location (Sri Lanka)
  const locationKeywords = [
    'colombo', 'kandy', 'galle', 'jaffna', 'trincomalee',
    'negombo', 'dambulla', 'anuradhapura', 'polonnaruwa',
    'matara', 'unawatuna', 'hikkaduwa', 'mirissa',
    'sigiriya', 'ella', 'nuwara eliya', 'bentota'
  ];
  for (const keyword of locationKeywords) {
    if (messageLower.includes(keyword)) {
      location = keyword.charAt(0).toUpperCase() + keyword.slice(1);
      break;
    }
  }

  // Extract party size
  const sizeMatch = userMessage.match(/\b(\d+)\b\s*(peop|person|pax|guest|table)/i);
  const party_size = sizeMatch ? parseInt(sizeMatch[1], 10) : 2;

  // Extract budget
  let budget: string | undefined;
  if (messageLower.includes('cheap') || messageLower.includes('budget')) {
    budget = 'cheap';
  } else if (messageLower.includes('expensive') || messageLower.includes('luxury')) {
    budget = 'expensive';
  } else if (messageLower.includes('moderate') || messageLower.includes('mid')) {
    budget = 'moderate';
  }

  return {
    location,
    cuisine,
    party_size,
    budget,
  };
};

/**
 * Helper: Determine if message requires an agent call
 */
export const shouldCallAgent = (userMessage: string): 
  'discovery' | 'recommendation' | 'reservation' | null => {
  const messageLower = userMessage.toLowerCase();

  if (messageLower.includes('restaurant') || 
      messageLower.includes('find') || 
      messageLower.includes('search') ||
      messageLower.includes('discover') ||
      messageLower.includes('cuisine') ||
      messageLower.includes('recommend')) {
    return 'discovery';
  }

  if (messageLower.includes('book') || 
      messageLower.includes('reserve') || 
      messageLower.includes('reservation')) {
    return 'reservation';
  }

  if (messageLower.includes('suggest') || 
      messageLower.includes('what do you recommend')) {
    return 'recommendation';
  }

  return null;
};
