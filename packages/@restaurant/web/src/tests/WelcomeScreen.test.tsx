/**
 * WELCOME SCREEN TESTS
 * Tests for the Welcome Screen component
 * USER STORIES:
 * 1. Display Welcome Screen on App Launch for new Users
 * 2. Display system logo and chatbot introduction
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import WelcomeScreen from '../../components/auth/WelcomeScreen';

describe('WelcomeScreen Component', () => {
  const mockOnSignIn = vi.fn();
  const mockOnSignUp = vi.fn();

  const renderWelcome = () => {
    return render(
      <WelcomeScreen onSignIn={mockOnSignIn} onSignUp={mockOnSignUp} />
    );
  };

  describe('Rendering', () => {
    it('should render welcome screen with correct title', () => {
      renderWelcome();
      expect(screen.getByText('DineBot')).toBeInTheDocument();
    });

    it('should display correct subtitle', () => {
      renderWelcome();
      expect(
        screen.getByText(/Your AI-powered restaurant discovery and booking assistant/)
      ).toBeInTheDocument();
    });

    it('should display logo emoji', () => {
      renderWelcome();
      expect(screen.getByText('🍽️')).toBeInTheDocument();
    });

    it('should display all feature items', () => {
      renderWelcome();
      expect(screen.getByText(/AI-powered chatbot assistance/)).toBeInTheDocument();
      expect(screen.getByText(/Personalized recommendations/)).toBeInTheDocument();
      expect(screen.getByText(/Easy reservation & payment/)).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should call onSignUp when Get Started button is clicked', async () => {
      const user = userEvent.setup();
      renderWelcome();

      const getStartedBtn = screen.getByRole('button', { name: /Get Started/i });
      await user.click(getStartedBtn);

      expect(mockOnSignUp).toHaveBeenCalledOnce();
    });

    it('should call onSignIn when Sign In button is clicked', async () => {
      const user = userEvent.setup();
      renderWelcome();

      const signInBtn = screen.getByRole('button', { name: /Sign In/i });
      await user.click(signInBtn);

      expect(mockOnSignIn).toHaveBeenCalledOnce();
    });

    it('should not call handlers on initial render', () => {
      renderWelcome();
      expect(mockOnSignIn).not.toHaveBeenCalled();
      expect(mockOnSignUp).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      renderWelcome();
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('should display copyright information', () => {
      renderWelcome();
      expect(screen.getByText(/© 2024 DineBot/)).toBeInTheDocument();
    });
  });
});
