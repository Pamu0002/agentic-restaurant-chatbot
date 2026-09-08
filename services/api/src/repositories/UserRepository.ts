/**
 * USER REPOSITORY
 * Data access layer for user operations - Firestore with fallback
 */

import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database';
import logger from '../utils/logger';

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  displayName: string;
  phone?: string;
  authProvider: 'email' | 'google';
  googleId?: string;
  role: 'customer' | 'owner' | 'admin';
  isEmailVerified: boolean;
  isActive: boolean;
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// Simple in-memory user store as final fallback
const fallbackUserStore = new Map<string, User>();

export class UserRepository {
  private collectionName = 'users';

  /**
   * Create a new user
   */
  async createUser(data: {
    email: string;
    passwordHash?: string;
    displayName: string;
    authProvider: string;
    googleId?: string;
    phone?: string;
    role?: string;
  }): Promise<User> {
    try {
      const db = getDb();
      const id = uuidv4();
      const now = Timestamp.now();

      const userDoc: any = {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash || null,
        displayName: data.displayName,
        authProvider: data.authProvider || 'email',
        googleId: data.googleId || null,
        phone: data.phone || null,
        role: data.role || 'customer',
        isEmailVerified: false,
        isActive: true,
        preferences: {},
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null,
      };

      await db.collection(this.collectionName).doc(id).set(userDoc);
      logger.info(`✅ User created in database: ${id}`);
      return this.mapDocToUser(id, userDoc);
    } catch (error: any) {
      logger.warn(`⚠️  Database error creating user, using fallback: ${error.message}`);
      // Fallback: store in memory
      const id = uuidv4();
      const user: User = {
        id,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        displayName: data.displayName,
        authProvider: (data.authProvider || 'email') as 'email' | 'google',
        googleId: data.googleId,
        phone: data.phone,
        role: (data.role || 'customer') as 'customer' | 'owner' | 'admin',
        isEmailVerified: false,
        isActive: true,
        preferences: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: undefined,
      };
      fallbackUserStore.set(id, user);
      logger.info(`💾 User created in fallback store: ${id}`);
      return user;
    }
  }

  /**
   * Find user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const db = getDb();
      const snapshot = await db
        .collection(this.collectionName)
        .where('email', '==', email.toLowerCase())
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return this.mapDocToUser(doc.id, doc.data());
    } catch (error: any) {
      logger.warn(`⚠️  Database error finding user by email, checking fallback: ${error.message}`);
      // Fallback: check memory store
      for (const user of fallbackUserStore.values()) {
        if (user.email === email.toLowerCase()) {
          logger.info(`✅ User found in fallback store: ${email}`);
          return user;
        }
      }
      return null;
    }
  }

  /**
   * Find user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const db = getDb();
      const doc = await db.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return this.mapDocToUser(doc.id, doc.data());
    } catch (error: any) {
      logger.warn(`⚠️  Database error finding user by ID, checking fallback: ${error.message}`);
      // Fallback: check memory store
      const user = fallbackUserStore.get(id);
      if (user) {
        logger.info(`✅ User found in fallback store: ${id}`);
        return user;
      }
      return null;
    }
  }

  /**
   * Find user by Google ID
   */
  async getUserByGoogleId(googleId: string): Promise<User | null> {
    try {
      const db = getDb();
      const snapshot = await db
        .collection(this.collectionName)
        .where('googleId', '==', googleId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return this.mapDocToUser(doc.id, doc.data());
    } catch (error: any) {
      logger.warn(`⚠️  Database error finding user by Google ID, checking fallback: ${error.message}`);
      // Fallback: check memory store
      for (const user of fallbackUserStore.values()) {
        if (user.googleId === googleId) {
          logger.info(`✅ User found in fallback store by Google ID: ${googleId}`);
          return user;
        }
      }
      return null;
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      const db = getDb();
      const updateData: any = {
        updatedAt: Timestamp.now(),
      };

      if (data.displayName !== undefined) updateData.displayName = data.displayName;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.preferences !== undefined) updateData.preferences = data.preferences;
      if (data.isEmailVerified !== undefined) updateData.isEmailVerified = data.isEmailVerified;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
      if (data.passwordHash !== undefined) updateData.passwordHash = data.passwordHash;
      if (data.googleId !== undefined) updateData.googleId = data.googleId;
      if (data.authProvider !== undefined) updateData.authProvider = data.authProvider;

      await db.collection(this.collectionName).doc(id).update(updateData);

      const doc = await db.collection(this.collectionName).doc(id).get();
      if (!doc.exists) {
        throw new Error(`User with ID ${id} not found`);
      }

      return this.mapDocToUser(doc.id, doc.data());
    } catch (error: any) {
      logger.warn(`⚠️  Database error updating user, using fallback: ${error.message}`);
      // Fallback: update in memory store
      const user = fallbackUserStore.get(id);
      if (user) {
        const updated: User = {
          ...user,
          ...data,
          updatedAt: new Date(),
        };
        fallbackUserStore.set(id, updated);
        logger.info(`💾 User updated in fallback store: ${id}`);
        return updated;
      }
      throw new Error(`User with ID ${id} not found in fallback store`);
    }
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    try {
      const db = getDb();
      await db.collection(this.collectionName).doc(userId).update({
        lastLoginAt: Timestamp.now(),
      });
    } catch (error: any) {
      logger.warn(`⚠️  Database error updating last login, using fallback: ${error.message}`);
      // Fallback: update in memory store
      const user = fallbackUserStore.get(userId);
      if (user) {
        user.lastLoginAt = new Date();
        fallbackUserStore.set(userId, user);
        logger.info(`💾 Last login updated in fallback store: ${userId}`);
      }
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const db = getDb();
    const snapshot = await db
      .collection(this.collectionName)
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    return !snapshot.empty;
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(userId: string): Promise<void> {
    const db = getDb();
    await db.collection(this.collectionName).doc(userId).update({
      isActive: false,
    });
  }

  /**
   * Map Firestore document to User object
   */
  private mapDocToUser(id: string, data: any): User {
    return {
      id,
      email: data.email,
      passwordHash: data.passwordHash,
      displayName: data.displayName,
      phone: data.phone,
      authProvider: data.authProvider || 'email',
      googleId: data.googleId,
      role: data.role || 'customer',
      isEmailVerified: data.isEmailVerified || false,
      isActive: data.isActive !== false,
      preferences: data.preferences || {},
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastLoginAt: data.lastLoginAt?.toDate(),
    };
  }
}

export default new UserRepository();
