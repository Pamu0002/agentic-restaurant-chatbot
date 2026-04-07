/**
 * TEST SETUP
 * Initialize test environment before running tests
 */

import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test.local' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';

// Suppress console logs during tests
global.console.log = jest.fn();
global.console.error = jest.fn();
global.console.warn = jest.fn();
global.console.info = jest.fn();

// Cleanup after all tests
afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
});
