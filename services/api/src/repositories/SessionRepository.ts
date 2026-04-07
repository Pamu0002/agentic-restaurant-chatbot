/**
 * SESSION REPOSITORY
 * Data access layer for session/refresh token operations - Firestore with fallback
 */

import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database';
import logger from '../utils/logger';

export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  deviceInfo?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
}

// Simple in-memory session store as final fallback
const fallbackSessionStore = new Map<string, Session>();

export class SessionRepository {
  private collectionName = 'sessions';

  /**
   * Create a new session
   */
  async createSession(data: {
    userId: string;
    refreshTokenHash: string;
    deviceInfo?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<Session> {
    try {
      const db = getDb();
      const id = uuidv4();
      const now = Timestamp.now();

      const sessionDoc: any = {
        userId: data.userId,
        refreshTokenHash: data.refreshTokenHash,
        deviceInfo: data.deviceInfo || null,
        ipAddress: data.ipAddress || null,
        expiresAt: Timestamp.fromDate(data.expiresAt),
        createdAt: now,
        revokedAt: null,
      };

      await db.collection(this.collectionName).doc(id).set(sessionDoc);
      logger.info(`✅ Session created in database: ${id}`);

      return this.mapDocToSession(id, sessionDoc);
    } catch (error: any) {
      logger.warn(`⚠️  Database error creating session, using fallback: ${error.message}`);
      // Fallback: store in memory
      const id = uuidv4();
      const session: Session = {
        id,
        userId: data.userId,
        refreshTokenHash: data.refreshTokenHash,
        deviceInfo: data.deviceInfo,
        ipAddress: data.ipAddress,
        expiresAt: data.expiresAt,
        createdAt: new Date(),
        revokedAt: undefined,
      };
      fallbackSessionStore.set(id, session);
      logger.info(`💾 Session created in fallback store: ${id}`);
      return session;
    }
  }

  /**
   * Find session by token hash
   */
  async getSessionByTokenHash(tokenHash: string): Promise<Session | null> {
    const db = getDb();
    const now = Timestamp.now();

    const snapshot = await db
      .collection(this.collectionName)
      .where('refreshTokenHash', '==', tokenHash)
      .where('expiresAt', '>', now)
      .where('revokedAt', '==', null)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return this.mapDocToSession(doc.id, doc.data());
  }

  /**
   * Find all sessions for a user
   */
  async getSessionsByUserId(userId: string): Promise<Session[]> {
    const db = getDb();

    const snapshot = await db
      .collection(this.collectionName)
      .where('userId', '==', userId)
      .where('revokedAt', '==', null)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc: any) =>
      this.mapDocToSession(doc.id, doc.data())
    );
  }

  /**
   * Revoke a session
   */
  async revokeSession(sessionId: string): Promise<void> {
    const db = getDb();
    await db.collection(this.collectionName).doc(sessionId).update({
      revokedAt: Timestamp.now(),
    });
  }

  /**
   * Revoke all sessions for a user
   */
  async revokeAllSessions(userId: string): Promise<void> {
    const db = getDb();

    const snapshot = await db
      .collection(this.collectionName)
      .where('userId', '==', userId)
      .where('revokedAt', '==', null)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc: any) => {
      batch.update(doc.ref, { revokedAt: Timestamp.now() });
    });

    await batch.commit();
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const db = getDb();
    const now = Timestamp.now();

    const snapshot = await db
      .collection(this.collectionName)
      .where('expiresAt', '<', now)
      .get();

    const batch = db.batch();
    let count = 0;

    snapshot.docs.forEach((doc: any) => {
      batch.delete(doc.ref);
      count++;
    });

    if (count > 0) {
      await batch.commit();
    }

    return count;
  }

  /**
   * Check if session exists and is valid
   */
  async isSessionValid(sessionId: string): Promise<boolean> {
    const db = getDb();
    const now = Timestamp.now();

    const doc = await db.collection(this.collectionName).doc(sessionId).get();

    if (!doc.exists) {
      return false;
    }

    const data = doc.data();
    if (!data) {
      return false;
    }
    return (
      data.expiresAt > now &&
      !data.revokedAt
    );
  }

  /**
   * Map Firestore document to Session object
   */
  private mapDocToSession(id: string, data: any): Session {
    return {
      id,
      userId: data.userId,
      refreshTokenHash: data.refreshTokenHash,
      deviceInfo: data.deviceInfo,
      ipAddress: data.ipAddress,
      expiresAt: data.expiresAt?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      revokedAt: data.revokedAt?.toDate(),
    };
  }
}

export default new SessionRepository();
