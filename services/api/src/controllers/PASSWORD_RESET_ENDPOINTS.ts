/**
 * PASSWORD RESET ENDPOINTS
 * Add these functions to: services/api/src/controllers/authController.ts
 * 
 * These functions handle:
 * 1. POST /api/auth/forgot-password - Request password reset email
 * 2. POST /api/auth/reset-password - Verify code and set new password
 */

/**
 * POST /api/auth/forgot-password
 * Request password reset email with verification code
 *
 * Body:
 * - email: string (required, must be registered)
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: AuthErrorType.INVALID_EMAIL,
        message: 'Email is required',
      });
      return;
    }

    // Rate limiting check (max 3 attempts per hour)
    // This should be enforced by middleware `resetPasswordLimiter`
    
    logger.info(`Password reset request for email: ${email.toLowerCase()}`);

    // Generate verification code and send email
    await authService.requestPasswordReset(email.toLowerCase());

    logger.info(`Password reset email sent to: ${email.toLowerCase()}`);

    res.json({
      success: true,
      message: 'Check your email for password reset instructions',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn(`Password reset request failed: ${error.type}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    logger.error('Password reset request error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Failed to send reset email. Please try again.',
    });
  }
};

/**
 * POST /api/auth/reset-password
 * Verify reset code and set new password
 *
 * Body:
 * - email: string (required)
 * - verificationCode: string (required, from email)
 * - newPassword: string (required, must be strong)
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, verificationCode, newPassword } = req.body;

    // Validate required fields
    if (!email || !verificationCode || !newPassword) {
      res.status(400).json({
        success: false,
        error: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Email, verification code, and new password are required',
      });
      return;
    }

    logger.info(`Password reset attempt for: ${email.toLowerCase()}`);

    // Reset password with verification code
    await authService.resetPassword(
      email.toLowerCase(),
      verificationCode,
      newPassword,
    );

    logger.info(`Password reset successful for: ${email.toLowerCase()}`);

    res.json({
      success: true,
      message: 'Password reset successful. Please sign in with your new password.',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn(`Password reset failed: ${error.type}`);
      res.status(error.statusCode).json({
        success: false,
        error: error.type,
        message: error.message,
      });
      return;
    }

    logger.error('Password reset error', error);
    res.status(500).json({
      success: false,
      error: AuthErrorType.UNKNOWN,
      message: 'Failed to reset password. Please try again.',
    });
  }
};
