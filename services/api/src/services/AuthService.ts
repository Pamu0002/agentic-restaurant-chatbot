/**
 * AUTHENTICATION SERVICE (PRODUCTION-GRADE)
 * - Password hashing with bcrypt
 * - JWT access tokens (15 min) + Refresh tokens (7 days)
 * - Google OAuth verification
 * - Session management  
 * - Audit logging
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import AuditLogRepository from '../repositories/AuditLogRepository';
import SessionRepository from '../repositories/SessionRepository';
import UserRepository from '../repositories/UserRepository';
import logger from '../utils/logger';

// ============================================
// CONFIGURATION
// ============================================

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const BCRYPT_ROUNDS = 12;
const PASSWORD_MIN_LENGTH = 8;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

// ============================================
// TYPES
// ============================================

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
  };
}

export class AuthenticationService {
  private googleClient: OAuth2Client;

  constructor() {
    this.googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
  }

  /**
   * Validate email format
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  private validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Must include lowercase letters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Must include uppercase letters');
    }
    if (!/\d/.test(password)) {
      errors.push('Must include numbers');
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Must include special characters (@$!%*?&)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // ============================================
  // PASSWORD HASHING
  // ============================================

  /**
   * Hash password with bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  /**
   * Verify password against hash
   */
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // ============================================
  // TOKEN GENERATION
  // ============================================

  /**
   * Generate access token (short-lived)
   */
  private generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  /**
   * Generate refresh token (long-lived)
   */
  private generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }

  /**
   * Hash token for secure storage
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Verify and decode JWT
   */
  public verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      logger.warn('Invalid access token');
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  public verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      logger.warn('Invalid refresh token');
      return null;
    }
  }

  // ============================================
  // SIGNUP / EMAIL AUTH
  // ============================================

  /**
   * Register new user with email/password
   */
  async signup(data: {
    email: string;
    password: string;
    displayName: string;
    phone?: string;
  }): Promise<AuthResponse> {
    // Validate inputs
    if (!this.validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.valid) {
      throw new Error(`Weak password: ${passwordValidation.errors.join(', ')}`);
    }

    // Check if user already exists
    const existingUser = await UserRepository.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await this.hashPassword(data.password);

    // Create user
    const user = await UserRepository.createUser({
      email: data.email.toLowerCase(),
      passwordHash: passwordHash,
      displayName: data.displayName,
      authProvider: 'email',
      phone: data.phone,
    });

    // Log audit event
    await AuditLogRepository.createLog({
      userId: user.id,
      action: 'SIGNUP',
      resource: 'users',
    });

    // Generate tokens
    const tokens = await this.generateAuthTokens(user.id, user.email, user.role);

    return tokens;
  }

  // ============================================
  // LOGIN / EMAIL AUTH
  // ============================================

  /**
   * Login with email/password
   */
  async login(data: {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuthResponse> {
    // Find user by email
    const user = await UserRepository.getUserByEmail(data.email);
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(data.password, user.passwordHash);
    if (!isValidPassword) {
      // Log failed attempt
      await AuditLogRepository.createLog({
        userId: user.id,
        action: 'LOGIN_FAILED',
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
      throw new Error('Invalid credentials');
    }

    // Update last login
    await UserRepository.updateLastLogin(user.id);

    // Log successful login
    await AuditLogRepository.createLog({
      userId: user.id,
      action: 'LOGIN',
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

    // Generate tokens
    const tokens = await this.generateAuthTokens(user.id, user.email, user.role);

    return tokens;
  }

  // ============================================
  // GOOGLE OAUTH
  // ============================================

  /**
   * Verify Google ID token and create/update user
   */
  async verifyGoogleToken(
    idToken: string,
    data?: { ipAddress?: string; userAgent?: string }
  ): Promise<AuthResponse> {
    try {
      // Verify token with Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.sub) {
        throw new Error('Invalid Google token payload');
      }

      const { email, name, sub: googleId } = payload;

      // Check if user exists
      let user = await UserRepository.getUserByEmail(email as string);

      if (user) {
        // Link Google account if not already linked
        if (!user.googleId) {
          user = await UserRepository.updateUser(user.id, {
            googleId: googleId,
            authProvider: 'google',
          } as any);
        }
      } else {
        // Create new user from Google
        user = await UserRepository.createUser({
          email: email as string,
          displayName: name || 'User',
          authProvider: 'google',
          googleId: googleId,
        });

        // Log new signup via Google
        await AuditLogRepository.createLog({
          userId: user.id,
          action: 'SIGNUP_GOOGLE',
          resource: 'users',
          ipAddress: data?.ipAddress,
        });
      }

      // Update last login
      await UserRepository.updateLastLogin(user.id);

      // Log Google login
      await AuditLogRepository.createLog({
        userId: user.id,
        action: 'LOGIN_GOOGLE',
        ipAddress: data?.ipAddress,
        userAgent: data?.userAgent,
      });

      // Generate tokens
      const tokens = await this.generateAuthTokens(user.id, user.email, user.role);

      return tokens;
    } catch (error) {
      logger.error('Google verification failed:', error);
      throw new Error('Google authentication failed');
    }
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  /**
   * Generate access + refresh tokens and create session
   */
  private async generateAuthTokens(
    userId: string,
    email: string,
    role: string
  ): Promise<AuthResponse> {
    const payload: TokenPayload = { userId, email, role };

    // Generate tokens
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(userId);

    // Store refresh token (hashed)
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await SessionRepository.createSession({
      userId: userId,
      refreshTokenHash: tokenHash,
      expiresAt: expiresAt,
    });

    // Get user details
    const user = await UserRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Verify refresh token signature
    const decoded = this.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    // Verify token is in database and not revoked
    const tokenHash = this.hashToken(refreshToken);
    const session = await SessionRepository.getSessionByTokenHash(tokenHash);
    if (!session) {
      throw new Error('Refresh token expired or revoked');
    }

    // Get user details
    const user = await UserRepository.getUserById(session.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new access token
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);

    return { accessToken };
  }

  /**
   * Logout (revoke refresh token)
   */
  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    const session = await SessionRepository.getSessionByTokenHash(tokenHash);
    if (session) {
      await SessionRepository.revokeSession(session.id);
    }
  }

  /**
   * Logout all sessions for a user
   */
  async logoutAll(userId: string): Promise<void> {
    await SessionRepository.revokeAllSessions(userId);

    // Log audit event
    await AuditLogRepository.createLog({
      userId: userId,
      action: 'LOGOUT_ALL',
    });
  }

  // ============================================
  // USER PROFILE
  // ============================================

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<any> {
    const user = await UserRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      preferences: user.preferences,
      createdAt: user.createdAt,
    };
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: { displayName?: string; phone?: string; preferences?: any }
  ): Promise<any> {
    const user = await UserRepository.updateUser(userId, {
      displayName: updates.displayName,
      phone: updates.phone,
      preferences: updates.preferences,
    } as any);

    // Log audit event
    await AuditLogRepository.createLog({
      userId: userId,
      action: 'PROFILE_UPDATE',
      resource: 'users',
      changes: updates,
    });

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      phone: user.phone,
    };
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Get user
    const user = await UserRepository.getUserById(userId);
    if (!user || !user.passwordHash) {
      throw new Error('User not found or password auth not enabled');
    }

    // Verify old password
    const isValid = await this.verifyPassword(oldPassword, user.passwordHash);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    const validation = this.validatePassword(newPassword);
    if (!validation.valid) {
      throw new Error(`Weak password: ${validation.errors.join(', ')}`);
    }

    // Hash and update
    const newHash = await this.hashPassword(newPassword);
    await UserRepository.updateUser(userId, { passwordHash: newHash } as any);

    // Logout all sessions
    await SessionRepository.revokeAllSessions(userId);

    // Log audit event
    await AuditLogRepository.createLog({
      userId: userId,
      action: 'PASSWORD_CHANGED',
    });
  }
}

export default new AuthenticationService();
