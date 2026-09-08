/**
 * GUEST CONTROLLER
 * 
 * Handles guest user session creation and management
 * Guests can browse restaurants without authentication
 */

import { Response } from 'express';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

interface CustomRequest {
  userId?: string;
  isGuest?: boolean;
}

interface GuestSessionResponse {
  sessionId: string;
  guestId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
}

/**
 * Create a new guest session
 * POST /api/guests/create-session
 */
async function createGuestSession(
  req: CustomRequest & any,
  res: Response
): Promise<void> {
  try {
    const guestId = `guest-${uuidv4()}`;
    const sessionId = uuidv4();
    
    // Generate a temporary JWT token for guest
    // Token expires in 24 hours
    const token = require('jsonwebtoken').sign(
      {
        guestId,
        sessionId,
        isGuest: true,
        type: 'guest_session',
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Store guest session in Firestore for reference
    await admin.firestore().collection('guest_sessions').doc(sessionId).set({
      guestId,
      sessionId,
      createdAt: admin.firestore.Timestamp.now(),
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
      status: 'active',
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
    });

    logger.info(`✅ Guest session created: ${sessionId}`);

    const response: GuestSessionResponse = {
      sessionId,
      guestId,
      token,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    res.status(201).json({
      success: true,
      data: response,
      message: 'Guest session created successfully',
    });
  } catch (error) {
    logger.error('❌ Error creating guest session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create guest session',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Get guest session info
 * GET /api/guests/:sessionId
 */
async function getGuestSession(
  req: CustomRequest & any,
  res: Response
): Promise<void> {
  try {
    const { sessionId } = req.params;

    const sessionDoc = await admin
      .firestore()
      .collection('guest_sessions')
      .doc(sessionId)
      .get();

    if (!sessionDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Guest session not found',
      });
      return;
    }

    const sessionData = sessionDoc.data();

    // Check if session is expired
    const expiresAt = sessionData?.expiresAt?.toDate?.() || new Date(sessionData?.expiresAt);
    if (new Date() > expiresAt) {
      res.status(401).json({
        success: false,
        message: 'Guest session has expired',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        ...sessionData,
        createdAt: sessionData?.createdAt?.toDate?.() || sessionData?.createdAt,
        expiresAt: sessionData?.expiresAt?.toDate?.() || sessionData?.expiresAt,
      },
    });
  } catch (error) {
    logger.error('❌ Error retrieving guest session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve guest session',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Extend guest session
 * POST /api/guests/:sessionId/extend
 */
async function extendGuestSession(
  req: CustomRequest & any,
  res: Response
): Promise<void> {
  try {
    const { sessionId } = req.params;

    const sessionDoc = await admin
      .firestore()
      .collection('guest_sessions')
      .doc(sessionId)
      .get();

    if (!sessionDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'Guest session not found',
      });
      return;
    }

    const expiresAt = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    await sessionDoc.ref.update({
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    });

    logger.info(`✅ Guest session extended: ${sessionId}`);

    res.json({
      success: true,
      message: 'Guest session extended successfully',
      data: {
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    logger.error('❌ Error extending guest session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extend guest session',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * End guest session
 * POST /api/guests/:sessionId/end
 */
async function endGuestSession(
  req: CustomRequest & any,
  res: Response
): Promise<void> {
  try {
    const { sessionId } = req.params;

    await admin
      .firestore()
      .collection('guest_sessions')
      .doc(sessionId)
      .update({
        status: 'ended',
        endedAt: admin.firestore.Timestamp.now(),
      });

    logger.info(`✅ Guest session ended: ${sessionId}`);

    res.json({
      success: true,
      message: 'Guest session ended successfully',
    });
  } catch (error) {
    logger.error('❌ Error ending guest session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end guest session',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export {
    createGuestSession, endGuestSession, extendGuestSession, getGuestSession
};

