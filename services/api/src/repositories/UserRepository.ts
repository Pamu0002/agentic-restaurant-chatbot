/**
 * USER REPOSITORY
 * Data access layer for user operations - Firestore
 */

import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database';

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

    return this.mapDocToUser(id, userDoc);
  }

  /**
   * Find user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
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
  }

  /**
   * Find user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    const db = getDb();
    const doc = await db.collection(this.collectionName).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return this.mapDocToUser(doc.id, doc.data());
  }

  /**
   * Find user by Google ID
   */
  async getUserByGoogleId(googleId: string): Promise<User | null> {
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
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: Partial<User>): Promise<User> {
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

    await db.collection(this.collectionName).doc(id).update(updateData);

    const doc = await db.collection(this.collectionName).doc(id).get();
    if (!doc.exists) {
      throw new Error(`User with ID ${id} not found`);
    }

    return this.mapDocToUser(doc.id, doc.data());
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    const db = getDb();
    await db.collection(this.collectionName).doc(userId).update({
      lastLoginAt: Timestamp.now(),
    });
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
