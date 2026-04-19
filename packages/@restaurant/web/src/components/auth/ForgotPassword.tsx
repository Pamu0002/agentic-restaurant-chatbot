/**
 * FORGOT PASSWORD COMPONENT
 * 
 * USER STORIES:
 * Provide password reset functionality
 * Allow users to reset forgotten passwords via email
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordState {
  email: string;
  step: 'email' | 'verification' | 'reset' | 'success';
  loading: boolean;
  error: string | null;
  message: string | null;
}

export default function ForgotPassword(): JSX.Element {
  const navigate = useNavigate();
  const [state, setState] = useState<ForgotPasswordState>({
    email: '',
    step: 'email',
    loading: false,
    error: null,
    message: null,
  });

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    verificationCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // STEP 1: REQUEST PASSWORD RESET EMAIL
  // ============================================

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate email
    if (!state.email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      setErrors({ email: 'Invalid email format' });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setState((prev) => ({
        ...prev,
        step: 'verification',
        message: 'Check your email for the verification code',
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send reset email',
        loading: false,
      }));
    }
  };

  // ============================================
  // STEP 2: VERIFY CODE & SET NEW PASSWORD
  // ============================================

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.verificationCode.trim()) {
      newErrors.verificationCode = 'Verification code is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordErrors: string[] = [];
      if (formData.newPassword.length < 8) {
        passwordErrors.push('At least 8 characters');
      }
      if (!/[a-z]/.test(formData.newPassword)) {
        passwordErrors.push('Lowercase letters');
      }
      if (!/[A-Z]/.test(formData.newPassword)) {
        passwordErrors.push('Uppercase letters');
      }
      if (!/\d/.test(formData.newPassword)) {
        passwordErrors.push('Numbers');
      }
      if (!/[@$!%*?&]/.test(formData.newPassword)) {
        passwordErrors.push('Special characters (@$!%*?&)');
      }

      if (passwordErrors.length > 0) {
        newErrors.newPassword = `Password must include: ${passwordErrors.join(', ')}`;
      }
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.email,
          verificationCode: formData.verificationCode,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setState((prev) => ({
        ...prev,
        step: 'success',
        message: 'Password reset successful!',
        loading: false,
      }));

      // Redirect to sign-in after 2 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to reset password',
        loading: false,
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* HEADER */}
        <div className="auth-header">
          <button className="auth-back-btn" onClick={() => navigate('/')}>
            ← Back
          </button>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">
            {state.step === 'email' && 'Enter your email to receive reset instructions'}
            {state.step === 'verification' && 'Enter verification code and new password'}
            {state.step === 'success' && 'Password reset successful!'}
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {state.error && (
          <div className="form-error-message">{state.error}</div>
        )}

        {/* SUCCESS MESSAGE */}
        {state.message && state.step !== 'success' && (
          <div className="form-success-message">{state.message}</div>
        )}

        {/* STEP 1: EMAIL ENTRY */}
        {state.step === 'email' && (
          <form onSubmit={handleRequestReset} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={state.email}
                onChange={(e) => {
                  setState((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.email;
                      return newErrors;
                    });
                  }
                }}
                placeholder="you@example.com"
                className={errors.email ? 'form-input error' : 'form-input'}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={state.loading}
            >
              {state.loading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFICATION & NEW PASSWORD */}
        {state.step === 'verification' && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                value={formData.verificationCode}
                onChange={(e) => handleInputChange(e, 'verificationCode')}
                placeholder="Enter code from email"
                className={errors.verificationCode ? 'form-input error' : 'form-input'}
              />
              {errors.verificationCode && (
                <p className="form-error">{errors.verificationCode}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => handleInputChange(e, 'newPassword')}
                placeholder="Enter new password"
                className={errors.newPassword ? 'form-input error' : 'form-input'}
              />
              {errors.newPassword && (
                <p className="form-error">{errors.newPassword}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange(e, 'confirmPassword')}
                placeholder="Re-enter new password"
                className={errors.confirmPassword ? 'form-input error' : 'form-input'}
              />
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={state.loading}
            >
              {state.loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* SUCCESS STATE */}
        {state.step === 'success' && (
          <div className="reset-success">
            <div className="success-icon">✅</div>
            <p className="success-text">Your password has been reset successfully!</p>
            <p className="redirect-text">Redirecting to sign in...</p>
          </div>
        )}

        {/* BACK TO SIGNIN */}
        <div className="auth-footer-link">
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="link-button"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
