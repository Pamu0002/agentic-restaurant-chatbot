/**
 * SIGNUP COMPONENT TESTS
 * Tests for the Sign Up component
 * USER STORIES:
 * 3. Provide User Registration Screen
 * 4. Allow Users to Register using Email and Password
 * 5. Allow Users to Register using Google Authentication
 * 6. Store User Details Securely in Database
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignUp from '../../components/auth/SignUp';

// Mock the auth context
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signup: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

// Mock firebase service
vi.mock('../../services/firebaseService', () => ({
  initializeGoogleAuth: vi.fn(),
}));

describe('SignUp Component', () => {
  const mockOnBack = vi.fn();
  const mockOnSignUpSuccess = vi.fn();

  const renderSignUp = () => {
    return render(
      <SignUp onBack={mockOnBack} onSignUpSuccess={mockOnSignUpSuccess} />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render sign up form', () => {
      renderSignUp();
      expect(screen.getByText(/create account|sign up/i)).toBeInTheDocument();
    });

    it('should display name input field', () => {
      renderSignUp();
      expect(screen.getByPlaceholderText(/name|full name/i)).toBeInTheDocument();
    });

    it('should display email input field', () => {
      renderSignUp();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    });

    it('should display password input field', () => {
      renderSignUp();
      const passwordInputs = screen.getAllByPlaceholderText(/password/i);
      expect(passwordInputs.length).toBeGreaterThanOrEqual(1);
    });

    it('should display confirm password field', () => {
      renderSignUp();
      const passwordInputs = screen.getAllByPlaceholderText(/password|confirm/i);
      expect(passwordInputs.length).toBeGreaterThanOrEqual(2);
    });

    it('should display terms agreement checkbox', () => {
      renderSignUp();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should display sign up button', () => {
      renderSignUp();
      expect(screen.getByRole('button', { name: /sign up|create account/i })).toBeInTheDocument();
    });

    it('should display Google auth button', () => {
      renderSignUp();
      expect(screen.getByText(/Google/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty name', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const signUpBtn = screen.getByRole('button', { name: /sign up|create account/i });
      await user.click(signUpBtn);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty email', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const nameInput = screen.getByPlaceholderText(/name|full name/i);
      await user.type(nameInput, 'John Doe');

      const signUpBtn = screen.getByRole('button', { name: /sign up|create account/i });
      await user.click(signUpBtn);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const nameInput = screen.getByPlaceholderText(/name|full name/i);
      const emailInput = screen.getByPlaceholderText(/email/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'invalid-email');

      const signUpBtn = screen.getByRole('button', { name: /sign up|create account/i });
      await user.click(signUpBtn);

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should show error for password less than 6 characters', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const nameInput = screen.getByPlaceholderText(/name|full name/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInputs = screen.getAllByPlaceholderText(/password/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInputs[0], '123');

      const signUpBtn = screen.getByRole('button', { name: /sign up|create account/i });
      await user.click(signUpBtn);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error if passwords do not match', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const nameInput = screen.getByPlaceholderText(/name|full name/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInputs = screen.getAllByPlaceholderText(/password|confirm/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInputs[0], 'password123');
      await user.type(passwordInputs[1], 'password456');

      const signUpBtn = screen.getByRole('button', { name: /sign up|create account/i });
      await user.click(signUpBtn);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should show error if terms are not agreed', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const nameInput = screen.getByPlaceholderText(/name|full name/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInputs = screen.getAllByPlaceholderText(/password|confirm/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInputs[0], 'password123');
      await user.type(passwordInputs[1], 'password123');

      const signUpBtn = screen.getByRole('button', { name: /sign up|create account/i });
      await user.click(signUpBtn);

      await waitFor(() => {
        expect(screen.getByText(/must agree to|terms/i)).toBeInTheDocument();
      });
    });

    it('should NOT show errors with valid complete form', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const nameInput = screen.getByPlaceholderText(/name|full name/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInputs = screen.getAllByPlaceholderText(/password|confirm/i);
      const checkbox = screen.getByRole('checkbox');

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInputs[0], 'password123');
      await user.type(passwordInputs[1], 'password123');
      await user.click(checkbox);

      const signUpBtn = screen.getByRole('button', { name: /sign up|create account/i });
      await user.click(signUpBtn);

      // Errors should not appear
      expect(screen.queryByText(/required|must be|do not match/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should update all form fields on input', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const nameInput = screen.getByPlaceholderText(/name|full name/i) as HTMLInputElement;
      const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
      const passwordInputs = screen.getAllByPlaceholderText(/password|confirm/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInputs[0], 'password123');
      await user.type(passwordInputs[1], 'password123');

      expect(nameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('john@example.com');
      expect((passwordInputs[0] as HTMLInputElement).value).toBe('password123');
      expect((passwordInputs[1] as HTMLInputElement).value).toBe('password123');
    });

    it('should toggle terms checkbox', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      await user.click(checkbox);

      expect(checkbox.checked).toBe(true);
    });
  });

  describe('Navigation', () => {
    it('should show login link', () => {
      renderSignUp();
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    });

    it('should call onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const backBtn = screen.getByRole('button', { name: /back|←/i });
      if (backBtn) {
        await user.click(backBtn);
        expect(mockOnBack).toHaveBeenCalledOnce();
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure with placeholders', () => {
      renderSignUp();
      expect(screen.getByPlaceholderText(/name|full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });
  });
});
