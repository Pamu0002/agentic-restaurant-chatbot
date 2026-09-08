/**
 * DATABASE CONFIGURATION
 * Firestore initialization and collection setup
 * Tech Stack: Firestore (Primary), MongoDB Atlas (Optional for analytics/logs)
 */

import * as admin from 'firebase-admin';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../utils/logger';

let db: Firestore | null = null;

// Mock in-memory database for development
const mockDb = {
  collections: {
    users: new Map<string, any>(),
    sessions: new Map<string, any>(),
    audit_logs: new Map<string, any>(),
  } as Record<string, Map<string, any>>,
  
  collection: (name: string) => ({
    doc: (id: string) => ({
      set: async (data: any) => {
        if (!mockDb.collections[name]) {
          mockDb.collections[name] = new Map();
        }
        mockDb.collections[name].set(id, { id, ...data });
        console.log(`✓ Mock DB: Saved ${name}/${id}`);
      },
      get: async () => ({ 
        exists: mockDb.collections[name]?.has(id) ?? false, 
        data: () => mockDb.collections[name]?.get(id),
        id,
      }),
      update: async (data: any) => {
        if (mockDb.collections[name]?.has(id)) {
          const existing = mockDb.collections[name].get(id);
          mockDb.collections[name].set(id, { ...existing, ...data });
          console.log(`✓ Mock DB: Updated ${name}/${id}`);
        }
      },
      delete: async () => {
        mockDb.collections[name]?.delete(id);
      },
      ref: { path: `${name}/${id}` },
    }),
    where: (field: string, op: string, value: any) => ({
      where: (field2: string, op2: string, value2: any) => ({
        orderBy: (orderField: string, direction: string) => ({
          limit: (limit: number) => ({
            get: async () => {
              const docs = Array.from(mockDb.collections[name]?.values() || [])
                .filter(doc => doc[field] === value && doc[field2] === value2)
                .sort((a, b) => {
                  if (direction === 'desc') return (b[orderField] || 0) - (a[orderField] || 0);
                  return (a[orderField] || 0) - (b[orderField] || 0);
                })
                .slice(0, limit)
                .map((data, idx) => ({ id: `doc${idx}`, data: () => data }));
              return { docs };
            },
          }),
        }),
        where: (field3: string, op3: string, value3: any) => ({
          get: async () => {
            const docs = Array.from(mockDb.collections[name]?.values() || [])
              .filter(doc => doc[field] === value && doc[field2] === value2 && doc[field3] === value3)
              .map((data, idx) => ({ id: `doc${idx}`, data: () => data, ref: { path: `${name}/doc${idx}` } }));
            return { docs };
          },
        }),
      }),
      orderBy: (orderField: string, direction: string) => ({
        limit: (limit: number) => ({
          get: async () => {
            const docs = Array.from(mockDb.collections[name]?.values() || [])
              .filter(doc => doc[field] === value)
              .sort((a, b) => {
                if (direction === 'desc') return (b[orderField] || 0) - (a[orderField] || 0);
                return (a[orderField] || 0) - (b[orderField] || 0);
              })
              .slice(0, limit)
              .map((data, idx) => ({ id: `doc${idx}`, data: () => data }));
            return { docs };
          },
        }),
      }),
      limit: (limit: number) => ({
        get: async () => {
          const docs = Array.from(mockDb.collections[name]?.values() || [])
            .filter(doc => doc[field] === value)
            .slice(0, limit)
            .map((data, idx) => ({ id: `doc${idx}`, data: () => data, ref: { path: `${name}/doc${idx}` } }));
          return { docs };
        },
      }),
      get: async () => {
        const docs = Array.from(mockDb.collections[name]?.values() || [])
          .filter(doc => doc[field] === value)
          .map((data, idx) => ({ id: `doc${idx}`, data: () => data, ref: { path: `${name}/doc${idx}` } }));
        return { docs };
      },
    }),
    orderBy: (orderField: string, direction: string) => ({
      limit: (limit: number) => ({
        get: async () => {
          const docs = Array.from(mockDb.collections[name]?.values() || [])
            .sort((a, b) => {
              if (direction === 'desc') return (b[orderField] || 0) - (a[orderField] || 0);
              return (a[orderField] || 0) - (b[orderField] || 0);
            })
            .slice(0, limit)
            .map((data, idx) => ({ id: `doc${idx}`, data: () => data }));
          return { docs };
        },
      }),
    }),
    limit: (limit: number) => ({
      get: async () => {
        const docs = Array.from(mockDb.collections[name]?.values() || [])
          .slice(0, limit)
          .map((data, idx) => ({ id: `doc${idx}`, data: () => data }));
        return { docs };
      },
    }),
  }),
  batch: () => ({
    update: (ref: any, data: any) => console.log(`✓ Mock DB: Batch update ${ref.path}`),
    delete: (ref: any) => console.log(`✓ Mock DB: Batch delete ${ref.path}`),
    commit: async () => console.log(`✓ Mock DB: Batch committed`),
  }),
};

/**
 * Initialize Firebase Admin SDK and get Firestore instance
 */
export async function initializeDatabase(): Promise<void> {
  try {
    if (!admin.apps.length) {
      // Try to load credentials from file
      const credentialsPath = path.join(process.cwd(), '..', '..', 'credentials.json');
      
      logger.info('Looking for credentials at:', credentialsPath);
      
      if (fs.existsSync(credentialsPath)) {
        logger.info('✅ Found credentials.json');
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
        
        admin.initializeApp({
          credential: admin.credential.cert(credentials),
          projectId: credentials.project_id,
        });
        logger.info('✅ Firebase initialized with credentials file');
      } else {
        logger.warn('⚠️  credentials.json not found at', credentialsPath);
        logger.info('Trying environment variable GOOGLE_APPLICATION_CREDENTIALS...');
        
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
      }
    }

    db = getFirestore();
    
    // Test connection
    const testRef = await db.collection('_health_check').limit(1).get();
    logger.info('✅ Firestore connected successfully');
  } catch (error) {
    logger.warn('⚠️  Firestore not available, using in-memory mock database for development');
    logger.warn('Error details:', error);
    // Continue with mock database for development
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
 * Get Firestore instance (or mock for development)
 */
export function getDb(): Firestore | any {
  if (db) {
    return db;
  }
  // Return mock database for development
  logger.debug('Using mock in-memory database');
  return mockDb as any;
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
