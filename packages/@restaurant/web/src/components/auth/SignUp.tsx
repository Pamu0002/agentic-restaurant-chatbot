/**
 * SIGNUP COMPONENT
 * 
 * USER STORIES:
 * 3. Provide User Registration Screen
 * 4. Allow Users to Register using Email and Password
 * 5. Allow Users to Register using Google Authentication
 * 6. Store User Details Securely in Database
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { initializeGoogleAuth } from '../../services/firebaseService';

interface SignUpProps {
  onBack: () => void;
  onSignUpSuccess: () => void;
}

export default function SignUp({ onBack, onSignUpSuccess }: SignUpProps) {
  // ============================================
  // STATE
  // ============================================

  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // VALIDATION
  // ============================================

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to terms and conditions';
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

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      onSignUpSuccess();
    } catch (error) {
      setErrors({ submit: 'Sign up failed. Please try again.' });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      // Initiate Google OAuth flow for signup
      // The same OAuth flow handles both signup and signin
      const googleAuthUrl = initializeGoogleAuth();
      window.location.href = googleAuthUrl;
    } catch (error) {
      setErrors({ submit: 'Google Sign Up failed. Please check your configuration.' });
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
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us to discover amazing restaurants</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleEmailSignUp} className="auth-form">
          {/* ERROR MESSAGE */}
          {errors.submit && (
            <div className="form-error-message">{errors.submit}</div>
          )}

          {/* NAME FIELD */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={errors.name ? 'form-input error' : 'form-input'}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

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
              placeholder="At least 6 characters"
              className={errors.password ? 'form-input error' : 'form-input'}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          {/* CONFIRM PASSWORD FIELD */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={errors.confirmPassword ? 'form-input error' : 'form-input'}
            />
            {errors.confirmPassword && (
              <p className="form-error">{errors.confirmPassword}</p>
            )}
          </div>

          {/* TERMS & CONDITIONS */}
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeToTerms">
              I agree to the Terms and Conditions
            </label>
            {errors.agreeToTerms && (
              <p className="form-error">{errors.agreeToTerms}</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="auth-divider">
          <span>Or</span>
        </div>

        {/* GOOGLE SIGNUP */}
        <button
          type="button"
          className="btn btn-google"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <span className="google-icon">🔷</span>
          Sign up with Google
        </button>

        {/* LOGIN LINK */}
        <div className="auth-footer-link">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onBack}
            className="link-button"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
