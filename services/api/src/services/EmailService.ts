/**
 * EMAIL SERVICE
 * Handles sending emails for password resets and notifications
 * 
 * This service integrates with SendGrid or Email.js for SMTP functionality
 * For development, it logs emails to console
 */

import logger from '../utils/logger';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface PasswordResetEmailData {
  email: string;
  displayName: string;
  resetCode: string;
  expiryMinutes?: number;
}

class EmailService {
  private isProduction = process.env.NODE_ENV === 'production';
  private senderEmail = process.env.SENDER_EMAIL || 'noreply@agentdine.com';

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    try {
      logger.info(`Sending password reset email to: ${data.email}`);

      const expiryMinutes = data.expiryMinutes || 15;
      
      const emailTemplate = this.getPasswordResetTemplate(
        data.displayName,
        data.resetCode,
        expiryMinutes,
      );

      await this.sendEmail({
        to: data.email,
        subject: 'Reset Your AgentDine Password',
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      logger.info(`Password reset email sent successfully to: ${data.email}`);
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send email
   * In production, uses SendGrid. In development, logs to console.
   */
  private async sendEmail(options: EmailOptions): Promise<void> {
    try {
      if (this.isProduction) {
        // TODO: Implement SendGrid integration
        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // await sgMail.send({
        //   to: options.to,
        //   from: this.senderEmail,
        //   subject: options.subject,
        //   html: options.html,
        //   text: options.text,
        // });
        logger.warn('[PRODUCTION] Using placeholder SendGrid implementation');
        logger.info('Email would be sent via SendGrid:', options);
      } else {
        // Development: log to console
        logger.info('📧 [DEV EMAIL] Sending email:');
        logger.info(`   To: ${options.to}`);
        logger.info(`   Subject: ${options.subject}`);
        logger.info(`   Body:\n${options.html}`);
      }
    } catch (error) {
      logger.error('Email service error:', error);
      throw error;
    }
  }

  /**
   * Generate password reset email template
   */
  private getPasswordResetTemplate(
    displayName: string,
    resetCode: string,
    expiryMinutes: number,
  ): { html: string; text: string } {
    const displayNameFormatted = displayName || 'User';
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -1px;
    }
    .header .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: white;
      font-weight: 900;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
      color: #0F1419;
    }
    .message {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
      line-height: 1.8;
    }
    .code-box {
      background: #f9f9f9;
      border: 2px solid #FF6B35;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-size: 32px;
      font-weight: 700;
      color: #FF6B35;
      letter-spacing: 4px;
      font-family: 'Courier New', monospace;
      margin: 10px 0;
    }
    .expiry {
      font-size: 12px;
      color: #999;
      margin-top: 10px;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #FF6B35;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 13px;
      color: #856404;
    }
    .footer {
      background: #f5f5f5;
      padding: 20px 30px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    .footer-link {
      color: #FF6B35;
      text-decoration: none;
    }
    .footer-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        🍽️ AgentDine
      </div>
      <h1>Reset Your Password</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Hi ${displayNameFormatted},</p>
      
      <p class="message">
        We received a request to reset the password for your AgentDine account. 
        Use the verification code below to proceed with your password reset.
      </p>
      
      <div class="code-box">
        <p style="margin: 0 0 10px 0; color: #666; font-size: 13px;">Your Verification Code</p>
        <div class="code">${resetCode}</div>
        <p class="expiry">This code expires in ${expiryMinutes} minutes</p>
      </div>
      
      <p class="message">
        1. Go to the password reset page on AgentDine<br>
        2. Enter your email address<br>
        3. Paste the verification code above<br>
        4. Create a new password and confirm<br>
        5. Sign in with your new password
      </p>
      
      <div class="warning">
        <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, 
        please ignore this email. Your account will remain secure. If you have concerns, 
        please contact our support team.
      </div>
      
      <p class="message" style="margin-top: 30px; color: #999; font-size: 12px;">
        For security reasons, never share this code with anyone. 
        AgentDine staff will never ask for this code via email or phone.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        © 2026 AgentDine. All rights reserved.
      </p>
      <p style="margin: 0;">
        <a href="https://agentdine.com" class="footer-link">Visit Website</a> • 
        <a href="https://agentdine.com/help" class="footer-link">Help Center</a> • 
        <a href="https://agentdine.com/privacy" class="footer-link">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
Reset Your AgentDine Password

Hi ${displayNameFormatted},

We received a request to reset the password for your AgentDine account. 
Use the verification code below to proceed with your password reset.

Verification Code: ${resetCode}
This code expires in ${expiryMinutes} minutes

Steps to reset your password:
1. Go to the password reset page on AgentDine
2. Enter your email address
3. Paste the verification code above
4. Create a new password and confirm
5. Sign in with your new password

⚠️  Security Notice: If you didn't request this password reset, 
please ignore this email. Your account will remain secure.

For security reasons, never share this code with anyone.
AgentDine staff will never ask for this code via email or phone.

© 2026 AgentDine. All rights reserved.
Visit: https://agentdine.com
Help: https://agentdine.com/help
Privacy: https://agentdine.com/privacy
    `;

    return { html, text };
  }
}

export default new EmailService();
