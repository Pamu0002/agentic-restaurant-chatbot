/**
 * AUDIT LOG REPOSITORY
 * Data access layer for audit logging - Firestore
 */

import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database';

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export class AuditLogRepository {
  private collectionName = 'audit_logs';

  /**
   * Create an audit log entry
   */
  async createLog(data: {
    userId?: string;
    action: string;
    resource?: string;
    changes?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const db = getDb();
    const id = uuidv4();
    const now = Timestamp.now();

    const logDoc: any = {
      userId: data.userId || null,
      action: data.action,
      resource: data.resource || null,
      changes: data.changes || {},
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      createdAt: now,
    };

    await db.collection(this.collectionName).doc(id).set(logDoc);

    return this.mapDocToLog(id, logDoc);
  }

  /**
   * Get audit logs for a user
   */
  async getLogsByUserId(userId: string, limit: number = 50): Promise<AuditLog[]> {
    const db = getDb();

    const snapshot = await db
      .collection(this.collectionName)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) =>
      this.mapDocToLog(doc.id, doc.data())
    );
  }

  /**
   * Get logs by action
   */
  async getLogsByAction(action: string, limit: number = 100): Promise<AuditLog[]> {
    const db = getDb();

    const snapshot = await db
      .collection(this.collectionName)
      .where('action', '==', action)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) =>
      this.mapDocToLog(doc.id, doc.data())
    );
  }

  /**
   * Get all logs (admin only)
   */
  async getAllLogs(limit: number = 500): Promise<AuditLog[]> {
    const db = getDb();

    const snapshot = await db
      .collection(this.collectionName)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) =>
      this.mapDocToLog(doc.id, doc.data())
    );
  }

  /**
   * Map Firestore document to AuditLog object
   */
  private mapDocToLog(id: string, data: any): AuditLog {
    return {
      id,
      userId: data.userId,
      action: data.action,
      resource: data.resource,
      changes: data.changes || {},
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  }
}

export default new AuditLogRepository();
