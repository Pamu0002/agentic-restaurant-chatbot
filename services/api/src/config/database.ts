/**
 * DATABASE CONFIGURATION
 * Firestore initialization and collection setup
 * Tech Stack: Firestore (Primary), MongoDB Atlas (Optional for analytics/logs)
 */

import * as admin from 'firebase-admin';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import logger from '../utils/logger';

let db: Firestore;

/**
 * Initialize Firebase Admin SDK and get Firestore instance
 */
export async function initializeDatabase(): Promise<void> {
  try {
    if (!admin.apps.length) {
      // Initialize Firebase Admin with default credentials
      // Make sure GOOGLE_APPLICATION_CREDENTIALS env var is set
      // or use admin.initializeApp() with explicit credentials
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }

    db = getFirestore();
    
    // Test connection
    const testRef = await db.collection('_health_check').limit(1).get();
    logger.info('✅ Firestore connected successfully');
  } catch (error) {
    logger.error('Failed to initialize Firestore:', error);
    throw error;
  }
}

/**
 * Create Firestore collections if they don't exist
 * Firestore auto-creates collections on first write, but we ensure indexes exist
 */
export async function runMigrations(): Promise<void> {
  try {
    logger.info('Running Firestore collection setup...');

    // Define collection structure (no manual schema needed for Firestore)
    // But we ensure indexes exist using composite indexes in Firestore console
    
    // Collections that will be created on first write:
    // 1. 'users' - User accounts with auth info
    // 2. 'sessions' - Active refresh tokens
    // 3. 'audit_logs' - Auth action history
    
    logger.info('✅ Firestore collections ready (auto-created on first write)');
    logger.info('📋 Collections to use:');
    logger.info('   - users: User profiles & auth');
    logger.info('   - sessions: Refresh tokens & device tracking');
    logger.info('   - audit_logs: Login/signup/profile actions');
  } catch (error) {
    logger.error('Firestore setup warning (non-fatal):', error);
    // Don't throw - collections auto-create on first write
  }
}

/**
 * Get Firestore instance
 */
export function getDb(): Firestore {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeDatabase() first.');
  }
  return db;
}

/**
 * Firestore Collection Schemas (Documents):
 * 
 * users collection:
 * {
 *   id: uuid (document ID)
 *   email: string (indexed, unique per app)
 *   passwordHash: string | null (only for email auth)
 *   displayName: string
 *   phone: string | null
 *   authProvider: 'email' | 'google'
 *   googleId: string | null (for google oauth)
 *   role: 'customer' | 'owner' | 'admin'
 *   isEmailVerified: boolean
 *   isActive: boolean
 *   preferences: { cuisine?: [], priceRange?: string, ... }
 *   createdAt: timestamp
 *   updatedAt: timestamp
 *   lastLoginAt: timestamp | null
 * }
 *
 * sessions collection:
 * {
 *   id: uuid (document ID)
 *   userId: string (indexed, FK to users)
 *   refreshTokenHash: string (SHA256, indexed)
 *   deviceInfo: string | null
 *   ipAddress: string | null
 *   expiresAt: timestamp (indexed, for cleanup)
 *   createdAt: timestamp
 *   revokedAt: timestamp | null (soft delete)
 * }
 *
 * auditLogs collection:
 * {
 *   id: uuid (document ID)
 *   userId: string | null (indexed, FK to users)
 *   action: string (LOGIN, SIGNUP, LOGOUT, PROFILE_UPDATE, etc.)
 *   resource: string | null (users, sessions, etc.)
 *   changes: { ... } (what changed)
 *   ipAddress: string | null
 *   userAgent: string | null
 *   createdAt: timestamp (indexed)
 * }
 */

export default {
  initializeDatabase,
  runMigrations,
  getDb,
};
