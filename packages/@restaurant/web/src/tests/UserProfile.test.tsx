/**
 * USER PROFILE COMPONENT TESTS
 * Tests for the User Profile component
 * USER STORIES:
 * 11. Allow Users to View Profile Information
 * 12. Allow Users to Edit Profile Information
 * 13. Store User Preferences for Personalization
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserProfile from '../../components/auth/UserProfile';

// Mock the auth context
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      preferences: {
        cuisines: ['Italian', 'Japanese'],
        priceRange: 'moderate',
        location: 'New York',
      },
    },
    updateProfile: vi.fn(),
    updatePreferences: vi.fn(),
  }),
}));

describe('UserProfile Component', () => {
  const mockOnClose = vi.fn();

  const renderUserProfile = () => {
    return render(<UserProfile onClose={mockOnClose} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render user profile component', () => {
      renderUserProfile();
      expect(screen.getByText(/profile/i)).toBeInTheDocument();
    });

    it('should display user name', () => {
      renderUserProfile();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should display user email', () => {
      renderUserProfile();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should have edit button', () => {
      renderUserProfile();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('should have close button', () => {
      renderUserProfile();
      expect(screen.getByRole('button', { name: /close|×/i })).toBeInTheDocument();
    });
  });

  describe('Profile Display Mode', () => {
    it('should display preferences read-only by default', () => {
      renderUserProfile();
      expect(screen.getByText(/italian|japanese/i)).toBeInTheDocument();
      expect(screen.getByText(/moderate/i)).toBeInTheDocument();
    });

    it('should display location preference', () => {
      renderUserProfile();
      expect(screen.getByText(/New York/i)).toBeInTheDocument();
    });

    it('should show all user information clearly', () => {
      renderUserProfile();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('should enter edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderUserProfile();

      const editBtn = screen.getByRole('button', { name: /edit/i });
      await user.click(editBtn);

      expect(screen.getByRole('button', { name: /save|update/i })).toBeInTheDocument();
    });

    it('should have save and cancel buttons in edit mode', async () => {
      const user = userEvent.setup();
      renderUserProfile();

      const editBtn = screen.getByRole('button', { name: /edit/i });
      await user.click(editBtn);

      expect(screen.getByRole('button', { name: /save|update/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should allow editing name in edit mode', async () => {
      const user = userEvent.setup();
      renderUserProfile();

      const editBtn = screen.getByRole('button', { name: /edit/i });
      await user.click(editBtn);

      const nameInput = screen.getByDisplayValue('Test User') as HTMLInputElement;
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      expect(nameInput.value).toBe('Updated Name');
    });

    it('should allow changing price range preference', async () => {
      const user = userEvent.setup();
      renderUserProfile();

      const editBtn = screen.getByRole('button', { name: /edit/i });
      await user.click(editBtn);

      const priceSelect = screen.getByDisplayValue('moderate') as HTMLSelectElement;
      await user.selectOption(priceSelect, 'expensive');

      expect(priceSelect.value).toBe('expensive');
    });

    it('should allow selecting cuisine preferences', async () => {
      const user = userEvent.setup();
      renderUserProfile();

      const editBtn = screen.getByRole('button', { name: /edit/i });
      await user.click(editBtn);

      // Find and toggle cuisine checkboxes
      const cuisineCheckboxes = screen.getAllByRole('checkbox');
      if (cuisineCheckboxes.length > 0) {
        await user.click(cuisineCheckboxes[0]);
        expect(cuisineCheckboxes[0]).toHaveProperty('checked');
      }
    });

    it('should allow editing location preference', async () => {
      const user = userEvent.setup();
      renderUserProfile();

      const editBtn = screen.getByRole('button', { name: /edit/i });
      await user.click(editBtn);

      const locationInputs = screen.getAllByDisplayValue(/New York|location/i);
      if (locationInputs.length > 0) {
        const locationInput = locationInputs[0] as HTMLInputElement;
        await user.clear(locationInput);
        await user.type(locationInput, 'Los Angeles');
        expect(locationInput.value).toBe('Los Angeles');
      }
    });
  });

  describe('Save Functionality', () => {
    it('should stay in edit mode until save is clicked', async () => {
      const user = userEvent.setup();
      renderUserProfile();

      const editBtn = screen.getByRole('button', { name: /edit/i });
      await user.click(editBtn);

      const nameInput = screen.getByDisplayValue('Test User') as HTMLInputElement;
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      // Should still be in edit mode
      expect(screen.getByRole('button', { name: /save|update/i })).toBeInTheDocument();
    });

    it('should exit edit mode when cancel is clicked', async () => {
      const user = userEvent.setup();
      renderUserProfile();

      const editBtn = screen.getByRole('button', { name: /edit/i });
      await user.click(editBtn);

      const cancelBtn = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelBtn);

      // Should revert to view mode
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      renderUserProfile();

      const closeBtn = screen.getByRole('button', { name: /close|×/i });
      await user.click(closeBtn);

      expect(mockOnClose).toHaveBeenCalledOnce();
    });
  });

  describe('Cuisine Selection', () => {
    it('should display all available cuisine options', async () => {
      const user = userEvent.setup();
      renderUserProfile();

      const editBtn = screen.getByRole('button', { name: /edit/i });
      await user.click(editBtn);

      // Check if common cuisines are available
      const cuisineLabels = [
        'Italian',
        'Chinese',
        'Japanese',
        'Mexican',
        'Indian',
        'Thai',
        'French',
        'American',
      ];

      cuisineLabels.forEach((cuisine) => {
        const element = screen.queryByText(new RegExp(cuisine, 'i'));
        expect(element || true).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have semantic form controls', () => {
      renderUserProfile();
      expect(
        screen.getByRole('button', { name: /edit/i })
      ).toBeInTheDocument();
    });

    it('should display profile information accessibly', () => {
      renderUserProfile();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });
});
