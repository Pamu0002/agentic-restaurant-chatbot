/**
 * SIGNIN COMPONENT
 * 
 * USER STORIES:
 * 7. Provide Secure Login Screen
 * 8. Allow Users to Log in using Email and Password
 * 9. Allow Users to Log in using Google Authentication
 * 10. Validate User Credentials before Login
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SignInProps {
  onBack: () => void;
  onSignInSuccess: () => void;
  onSignUpClick: () => void;
}

export default function SignIn({
  onBack,
  onSignInSuccess,
  onSignUpClick,
}: SignInProps) {
  // ============================================
  // STATE
  // ============================================

  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // VALIDATION
  // ============================================

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      if (formData.rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      }
      onSignInSuccess();
    } catch (error) {
      setErrors({ submit: 'Invalid email or password' });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // TODO: Implement Google OAuth signin
      // const credential = await google.auth.signInWithPopup();
      // await login(credential.user.email, '');
      alert('Google Sign In - Coming Soon!');
    } catch (error) {
      setErrors({ submit: 'Google Sign In failed' });
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
          <button className="auth-back-btn" onClick={onBack}>
            ← Back
          </button>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleEmailSignIn} className="auth-form">
          {/* ERROR MESSAGE */}
          {errors.submit && (
            <div className="form-error-message">{errors.submit}</div>
          )}

          {/* EMAIL FIELD */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? 'form-input error' : 'form-input'}
              autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* PASSWORD FIELD */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'form-input error' : 'form-input'}
              autoComplete="current-password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          {/* REMEMBER ME & FORGOT PASSWORD */}
          <div className="form-row">
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <button type="button" className="link-button">
              Forgot Password?
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="auth-divider">
          <span>Or</span>
        </div>

        {/* GOOGLE SIGNIN */}
        <button
          className="btn btn-google"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <span className="google-icon">🔷</span>
          Sign in with Google
        </button>

        {/* SIGNUP LINK */}
        <div className="auth-footer-link">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSignUpClick}
            className="link-button"
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
}
