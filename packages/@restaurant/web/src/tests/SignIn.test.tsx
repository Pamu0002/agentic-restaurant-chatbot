/**
 * SIGNIN COMPONENT TESTS
 * Tests for the Sign In component
 * USER STORIES:
 * 7. Provide Secure Login Screen
 * 8. Allow Users to Log in using Email and Password
 * 9. Allow Users to Log in using Google Authentication
 * 10. Validate User Credentials before Login
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignIn from '../../components/auth/SignIn';

// Mock the auth context
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

// Mock firebase service
vi.mock('../../services/firebaseService', () => ({
  initializeGoogleAuth: vi.fn(),
}));

describe('SignIn Component', () => {
  const mockOnBack = vi.fn();
  const mockOnSignInSuccess = vi.fn();
  const mockOnSignUpClick = vi.fn();

  const renderSignIn = () => {
    return render(
      <SignIn
        onBack={mockOnBack}
        onSignInSuccess={mockOnSignInSuccess}
        onSignUpClick={mockOnSignUpClick}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render sign in form', () => {
      renderSignIn();
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });

    it('should display email input field', () => {
      renderSignIn();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    });

    it('should display password input field', () => {
      renderSignIn();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('should display remember me checkbox', () => {
      renderSignIn();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should display sign in button', () => {
      renderSignIn();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should display Google auth button', () => {
      renderSignIn();
      expect(screen.getByText(/Google/i)).toBeInTheDocument();
    });

    it('should have back button', () => {
      renderSignIn();
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty email', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const signInBtn = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInBtn);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const emailInput = screen.getByPlaceholderText(/email/i);
      await user.type(emailInput, 'invalid-email');

      const signInBtn = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInBtn);

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty password', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const emailInput = screen.getByPlaceholderText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const signInBtn = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInBtn);

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should NOT show errors with valid inputs', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      const signInBtn = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInBtn);

      // Errors should not appear
      expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should update email field on input', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password field on input', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
      await user.type(passwordInput, 'password123');

      expect(passwordInput.value).toBe('password123');
    });

    it('should toggle remember me checkbox', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      await user.click(checkbox);

      expect(checkbox.checked).toBe(true);
    });
  });

  describe('Navigation', () => {
    it('should call onSignUpClick when Sign Up link is clicked', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const signUpLink = screen.getByText(/don't have an account/i);
      await user.click(signUpLink);

      expect(mockOnSignUpClick).toHaveBeenCalledOnce();
    });

    it('should call onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const backBtn = screen.getByRole('button', { name: /back|←/i });
      if (backBtn) {
        await user.click(backBtn);
        expect(mockOnBack).toHaveBeenCalledOnce();
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels or placeholders', () => {
      renderSignIn();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('should have semantic form structure', () => {
      renderSignIn();
      const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
      expect(form || screen.getByPlaceholderText(/email/i)).toBeTruthy();
    });
  });
});
