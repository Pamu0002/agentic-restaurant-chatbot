/**
 * ENTRY POINT FOR EXPRESS API SERVICE
 * 
 * This file initializes the Express server and sets up:
 * - Middleware (for processing requests)
 * - Routes (API endpoints)
 * - Error handling
 * - Database connections
 */

import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

// ============================================
// 1. INITIALIZE EXPRESS APP
// ============================================

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ============================================
// 2. MIDDLEWARE SETUP
// ============================================

// CORS: Allow requests from frontend running on port 3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// HELMET: Add security headers to responses
app.use(helmet());

// BODY PARSER: Parse JSON request bodies
app.use(express.json());

// MORGAN: Log all HTTP requests
app.use(morgan('combined'));

// ============================================
// 3. BASIC ROUTES (EXAMPLES)
// ============================================

/**
 * HEALTH CHECK ENDPOINT
 * 
 * Purpose: Check if the server is running
 * Method: GET
 * URL: /health
 * Returns: JSON with status
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * WELCOME ENDPOINT
 * 
 * Purpose: Welcome message
 * Method: GET
 * URL: /
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🍽️ Welcome to Agentic Restaurant Chatbot API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      restaurants: '/api/v1/restaurants',
      reservations: '/api/v1/reservations',
      users: '/api/v1/users'
    }
  });
});

/**
 * GET RESTAURANTS ENDPOINT (EXAMPLE)
 * 
 * Purpose: Retrieve restaurants from database
 * Method: GET
 * URL: /api/v1/restaurants?location=Paris&cuisine=Italian
 * Returns: List of restaurants matching criteria
 * 
 * EXPLAIN: 
 * - This is a READ operation (GET)
 * - Use query parameters (?location=...) for filters
 * - Try it: http://localhost:5000/api/v1/restaurants
 */
app.get('/api/v1/restaurants', async (req: Request, res: Response) => {
  try {
    // Extract query parameters from URL
    const { location, cuisine, limit = 10 } = req.query;

    // TODO: Connect to Firestore database
    // const snapshot = await firestore
    //   .collection('restaurants')
    //   .where('location', '==', location)
    //   .limit(Number(limit))
    //   .get();

    // For now, return mock data
    const mockRestaurants = [
      {
        id: '1',
        name: 'Pizza Palace',
        location: 'Paris',
        cuisine: 'Italian',
        rating: 4.5,
        availableTables: 5
      },
      {
        id: '2',
        name: 'Le Petit Bistro',
        location: 'Paris',
        cuisine: 'French',
        rating: 4.8,
        availableTables: 3
      }
    ];

    // Send successful response
    res.json({
      success: true,
      statusCode: 200,
      data: mockRestaurants,
      count: mockRestaurants.length
    });

  } catch (error) {
    // Handle errors
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: 'Failed to fetch restaurants'
    });
  }
});

/**
 * CREATE RESERVATION ENDPOINT (EXAMPLE)
 * 
 * Purpose: Create a new restaurant reservation
 * Method: POST
 * URL: /api/v1/reservations
 * Body: { userId, restaurantId, date, partySize }
 * Returns: Created reservation with ID
 * 
 * EXPLAIN:
 * - This is a CREATE operation (POST)
 * - Send data in request body (not URL)
 * - Always validate input data
 * - Return 201 status for creation
 * 
 * Example request with curl:
 * curl -X POST http://localhost:5000/api/v1/reservations \
 *   -H "Content-Type: application/json" \
 *   -d '{"userId":"user1","restaurantId":"rest1","date":"2024-03-10","partySize":4}'
 */
app.post('/api/v1/reservations', async (req: Request, res: Response) => {
  try {
    // Extract data from request body
    const { userId, restaurantId, date, partySize } = req.body;

    // VALIDATION: Check if all required fields are present
    if (!userId || !restaurantId || !date || !partySize) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Missing required fields: userId, restaurantId, date, partySize'
      });
    }

    // VALIDATION: Check if data types are correct
    if (typeof partySize !== 'number' || partySize < 1) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'partySize must be a positive number'
      });
    }

    // TODO: Save to Firestore
    // const reservation = await firestore
    //   .collection('reservations')
    //   .add({
    //     userId,
    //     restaurantId,
    //     date,
    //     partySize,
    //     createdAt: new Date(),
    //     status: 'pending'
    //   });

    // For now, return mock response
    const newReservation = {
      id: 'res_' + Date.now(),
      userId,
      restaurantId,
      date,
      partySize,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Return 201 (Created) status with the new reservation
    res.status(201).json({
      success: true,
      statusCode: 201,
      data: newReservation,
      message: 'Reservation created successfully'
    });

  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: 'Failed to create reservation'
    });
  }
});

/**
 * UPDATE RESERVATION ENDPOINT (EXAMPLE)
 * 
 * Purpose: Update an existing reservation
 * Method: PUT
 * URL: /api/v1/reservations/RES_ID
 * Returns: Updated reservation
 * 
 * EXPLAIN:
 * - Use path parameter (/RES_ID) for resource ID
 * - Send updated data in body
 * - Return 200 status for update
 */
app.put('/api/v1/reservations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Get ID from URL
    const updates = req.body;   // Get updates from body

    // TODO: Update in Firestore
    // await firestore
    //   .collection('reservations')
    //   .doc(id)
    //   .update(updates);

    // Mock response
    res.json({
      success: true,
      statusCode: 200,
      data: {
        id,
        ...updates,
        updatedAt: new Date().toISOString()
      },
      message: 'Reservation updated successfully'
    });

  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: 'Failed to update reservation'
    });
  }
});

/**
 * DELETE RESERVATION ENDPOINT (EXAMPLE)
 * 
 * Purpose: Cancel a reservation
 * Method: DELETE
 * URL: /api/v1/reservations/RES_ID
 * Returns: Confirmation message
 * 
 * EXPLAIN:
 * - DELETE removes data from database
 * - Return 200 or 204 (No Content)
 */
app.delete('/api/v1/reservations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Delete from Firestore
    // await firestore
    //   .collection('reservations')
    //   .doc(id)
    //   .delete();

    res.json({
      success: true,
      statusCode: 200,
      message: `Reservation ${id} cancelled successfully`
    });

  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: 'Failed to delete reservation'
    });
  }
});

// ============================================
// 4. 404 HANDLER
// ============================================

/**
 * This middleware runs if no other route matches
 * It handles 404 (Not Found) errors
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: `Route not found: ${req.method} ${req.path}`
  });
});

// ============================================
// 5. ERROR HANDLER
// ============================================

/**
 * Global error handling middleware
 * Catches all errors from routes and other middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    statusCode: 500,
    error: error.message || 'Internal server error'
  });
});

// ============================================
// 6. START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`🚀 Express API Server Started`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('═══════════════════════════════════════════════════════\n');
});

export default app;
