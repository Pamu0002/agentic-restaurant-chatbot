# ♿ EPIC 1: ACCESSIBILITY & QUALITY STANDARDS

## 1. WCAG 2.1 COMPLIANCE CHECKLIST

### Level A (Foundation - MUST HAVE)

#### 1.1 Text Alternatives
- [ ] All images have descriptive alt text
- [ ] Decorative images have empty alt text (alt="")
- [ ] Icons have aria-labels or text alternatives
- [ ] Buttons have visible labels
- [ ] Form inputs have associated labels

**Implementation Examples:**
```html
<!-- ✓ Good: Descriptive alt text -->
<img src="logo.png" alt="Restaurant Chatbot Logo" />

<!-- ✓ Good: Decorative image -->
<img src="decorative-line.png" alt="" />

<!-- ✓ Good: Icon with aria-label -->
<button aria-label="Close menu">
  <IconX />
</button>

<!-- ✗ Bad: No alt text -->
<img src="image.png" />
```

#### 1.3 Adaptable
- [ ] Content structure is semantic (headings, lists, etc.)
- [ ] Logical reading order maintained
- [ ] Meaningful sequences preserved
- [ ] No white space conveying meaning
- [ ] Tables have proper headers

**Implementation:**
```jsx
// ✓ Good: Semantic structure
<form>
  <label htmlFor="email">Email:</label>
  <input id="email" type="email" />
</form>

// ✗ Bad: No semantic structure
<div onClick={handleSubmit}>
  <div>Email:</div>
  <div contentEditable>input field</div>
</div>
```

#### 2.1 Keyboard Accessible
- [ ] All functionality available via keyboard
- [ ] Tab order is logical
- [ ] No keyboard trap (except intentional)
- [ ] Keyboard shortcuts don't conflict with assistive tech
- [ ] Focus is visible

**Implementation:**
```typescript
// ✓ Good: Keyboard navigation
<input 
  type="text"
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleSubmit();
  }}
/>

// ✓ Good: Visible focus style
input:focus {
  outline: 2px solid #4ecdc4;
  outline-offset: 2px;
}

// ✗ Bad: Removed focus outline without replacement
input:focus {
  outline: none; // Never do this alone!
}
```

#### 2.4 Distinguishable
- [ ] Text color contrast ≥ 4.5:1 (normal text)
- [ ] Text color contrast ≥ 3:1 (large text)
- [ ] No information conveyed by color alone
- [ ] Audio doesn't autoplay
- [ ] No flashing content (3+ times/second)

**Contrast Ratios:**
```
Accessibility Reference:
- #ff6b6b (primary red) on white: 4.8:1 ✓ Exceeds 4.5:1
- #4ecdc4 (teal) on white: 5.2:1 ✓ Exceeds 4.5:1
- #333333 (dark gray) on white: 12.6:1 ✓ Excellent

Tool: WebAIM Contrast Checker
URL: https://webaim.org/resources/contrastchecker/
```

#### 4.1 Compatible
- [ ] HTML is valid
- [ ] ARIA attributes used correctly
- [ ] Form inputs have descriptive labels
- [ ] Error messages are clear
- [ ] Status updates announced to screen readers

**Implementation:**
```jsx
// ✓ Good: Proper ARIA and form semantics
<form>
  <label htmlFor="password">Password:</label>
  <input 
    id="password"
    type="password"
    required
    aria-describedby="pwd-hint"
  />
  <span id="pwd-hint">Minimum 6 characters</span>
  {error && (
    <div role="alert" aria-live="assertive">
      {error}
    </div>
  )}
</form>

// ✗ Bad: Missing ARIA
<div onClick={} role="button">Click me</div>
```

---

### Level AA (Recommended - SHOULD HAVE)

#### 1.4 Distinguishable (Enhanced)
- [ ] Text color contrast ≥ 7:1 (normal text) - **ENHANCED**
- [ ] Text color contrast ≥ 4.5:1 (large text) - **ENHANCED**
- [ ] Content can be resized up to 200%
- [ ] Text does not justify both edges
- [ ] Text line height ≥ 1.5

**CSS Implementation:**
```css
/* ✓ Good: AA compliant text styling */
body {
  font-size: 16px;
  line-height: 1.5;      /* ≥ 1.5 for body text */
  letter-spacing: 0.12em; /* Better readability */
  text-align: left;       /* Not justified */
  color: #333333;         /* High contrast */
}

h1, h2, h3, h4, h5, h6 {
  line-height: 1.3;       /* Good for headings */
  margin-bottom: 1rem;    /* Visual separation */
}

/* Support zoom without horizontal scroll */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 2.4 Navigable (Enhanced)
- [ ] Purpose of each link is clear
- [ ] Heading hierarchy is proper (h1 > h2 > h3)
- [ ] Focus is visible and sufficient
- [ ] Multiple ways to find content
- [ ] Link text is descriptive

**Implementation:**
```jsx
// ✓ Good: Clear link purpose
<a href="/auth/signup">Create account</a>
<a href="/auth/forgot-password">Forgot password?</a>

// ✗ Bad: Generic link text
<a href="/page">Click here</a>

// ✓ Good: Proper heading hierarchy
<h1>Restaurant Chatbot</h1>
<h2>Sign In</h2>
<h3>Email Address</h3>

// ✗ Bad: Skipping heading levels
<h1>Title</h1>
<h4>Subtitle</h4> {/* Should be h2 */}
```

#### 3.2 Predictable
- [ ] Navigation is consistent
- [ ] Components behave consistently
- [ ] No unexpected context changes
- [ ] Form submission requires confirmation if dangerous
- [ ] Error suggestions are provided

#### 3.3 Input Assistance
- [ ] Form labels clearly identify required fields
- [ ] Error messages describe the issue
- [ ] Suggestions provided for corrections
- [ ] Legal commitments require confirmation
- [ ] Input validation happens in real-time with feedback

**Implementation:**
```jsx
// ✓ Good: Clear error messages with suggestions
<FormField 
  label="Email"
  error={emailError}
  hint="Use your work or personal email"
>
  <input 
    type="email"
    aria-describedby="email-hint"
    aria-invalid={!!emailError}
  />
  <div id="email-hint" role="alert">
    {emailError && `Error: ${emailError}. Please check and try again.`}
  </div>
</FormField>

// ✓ Good: Real-time validation feedback
<input 
  type="password"
  onChange={(e) => {
    const strength = checkPasswordStrength(e.target.value);
    setPasswordFeedback(getStrengthMessage(strength));
  }}
/>
<span aria-live="polite" role="status">
  {passwordFeedback}
</span>
```

---

### Level AAA (Enhanced - NICE TO HAVE)

- [ ] Text color contrast ≥ 7:1 (all text)
- [ ] Sign language interpretation for video
- [ ] Extended audio descriptions
- [ ] Full keyboard control with no exceptions
- [ ] Multiple language versions available

---

## 2. TOUCH TARGET SIZING

### Minimum Touch Target Size

```
Mobile/Touch Devices:
- Minimum: 44x44 CSS pixels (44x44dp)
- Recommended: 48x48 CSS pixels
- Applies to: buttons, links, form controls, icon buttons

Spacing Between Targets:
- Minimum: 8px between interactive elements
- Recommended: 12px for comfort

Implementation Examples:
```

```jsx
// ✓ Good: 48x48 button
<button className="btn-primary">
  Sign In
</button>

// CSS
.btn-primary {
  min-width: 48px;
  min-height: 48px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// ✓ Good: Proper spacing
<div className="button-group">
  <button>Sign In</button>
  <button>Sign Up</button>
</div>

.button-group button {
  margin-right: 12px; /* 12px spacing */
}

// ✗ Bad: Too small
<button style={{ width: '30px', height: '30px' }}>X</button>
```

### Component Touch Target Guidelines

| Component | Min Size | Recommended | Example |
|-----------|----------|-------------|---------|
| Button | 40x40 | 48x48 | Sign In, Upload |
| Icon Button | 40x40 | 48x48 | Close, Menu |
| Text Link | 40x44 | 48x48 | Forgot Password |
| Form Input | 40x44 | 48x48 | Email, Password |
| Checkbox | 40x40 | 48x48 | Terms checkbox |
| Radio Button | 40x40 | 48x48 | Price range |
| Toggle | 40x24 | 48x28 | Preferences |

---

## 3. KEYBOARD NAVIGATION SPECIFICATION

### Tab Order (Authentication Flow)

```
Welcome Screen:
1. Sign In Button
2. Create Account Button
3. (Optional: Help link)

Sign In Form:
1. Email input
2. Password input
3. Remember me checkbox
4. Sign In button
5. Forgot Password link
6. (Don't have account) Sign Up link

Sign Up Form:
1. Name input
2. Email input
3. Password input
4. Confirm Password input
5. Terms checkbox
6. Sign Up button
7. Already have account? Sign In link

User Profile Modal:
1. Edit button
2. Cuisine preference checkboxes (10 items)
3. Price range radio buttons (3 options)
4. Location input
5. Save button
6. Cancel button
7. Close modal button (X)
```

### Keyboard Shortcuts

```typescript
/**
 * KEYBOARD SHORTCUTS IMPLEMENTATION
 * 
 * Standard shortcuts don't conflict with assistive tech
 */

const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape: Close modal/dialog
      if (e.key === 'Escape') {
        closeModal();
      }

      // Enter: Submit form (when focused on form)
      if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
        const form = e.target.closest('form');
        if (form) {
          form.dispatchEvent(new Event('submit'));
        }
      }

      // Tab: Navigate forward (default behavior)
      // Shift+Tab: Navigate backward (default behavior)
      
      // Never intercept screen reader shortcuts:
      // - NVDA: Insert+arrow keys
      // - JAWS: Insert+arrow keys
      // - VoiceOver: Control+Option+arrow keys
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

### Focus Management

```jsx
// ✓ Good: Focus moves to modal when opened
const [isModalOpen, setIsModalOpen] = useState(false);
const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isModalOpen) {
    // Move focus to modal
    modalRef.current?.focus();
  }
}, [isModalOpen]);

return (
  <>
    <button onClick={() => setIsModalOpen(true)}>Edit Profile</button>
    
    {isModalOpen && (
      <dialog 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsModalOpen(false);
        }}
      >
        <h2 id="modal-title">Edit Profile</h2>
        {/* Form content */}
      </dialog>
    )}
  </>
);

// ✓ Good: Focus returns to button when modal closes
const handleClose = () => {
  setIsModalOpen(false);
  triggerRef.current?.focus(); // Return focus
};
```

---

## 4. SCREEN READER CONSIDERATIONS

### ARIA Attributes for Authentication

```jsx
/**
 * Welcome Screen
 */
<section aria-label="Welcome to Restaurant Chatbot">
  <h1>Welcome to Restaurant Chatbot</h1>
  <ul>
    <li>🤖 AI-Powered Recommendations</li>
    <li>🍽️ Easy Restaurant Reservations</li>
    <li>⭐ Personalized Experience</li>
    <li>💳 Secure Payments</li>
  </ul>
  <div className="action-buttons">
    <button aria-label="Sign in to existing account">Sign In</button>
    <button aria-label="Create new account">Create Account</button>
  </div>
</section>

/**
 * Form Sections
 */
<form aria-label="Sign in form">
  <fieldset>
    <legend>Email Credentials</legend>
    
    <label htmlFor="email">
      Email Address
      <span aria-label="required">*</span>
    </label>
    <input 
      id="email"
      type="email"
      required
      aria-describedby="email-help"
      aria-invalid={!!emailError}
    />
    {emailError && (
      <div id="email-help" role="alert" className="error-message">
        {emailError}
      </div>
    )}
  </fieldset>

  <fieldset>
    <legend>Password</legend>
    <label htmlFor="password">
      Password
      <span aria-label="required">*</span>
    </label>
    <input 
      id="password"
      type="password"
      required
      aria-describedby="password-help"
      aria-invalid={!!passwordError}
    />
    {passwordError && (
      <div id="password-help" role="alert">
        {passwordError}
      </div>
    )}
  </fieldset>

  <button type="submit" aria-label="Submit sign in form">
    Sign In
  </button>
</form>

/**
 * Profile Edit Modal
 */
<dialog 
  aria-modal="true"
  aria-labelledby="profile-modal-title"
>
  <h2 id="profile-modal-title">Edit Your Profile</h2>
  
  <fieldset>
    <legend>Cuisine Preferences</legend>
    <p aria-live="polite" role="status">
      {selectedCuisines.length} cuisines selected
    </p>
    
    {cuisines.map(cuisine => (
      <label key={cuisine}>
        <input 
          type="checkbox"
          checked={selectedCuisines.includes(cuisine)}
          onChange={() => toggleCuisine(cuisine)}
          aria-label={`Select ${cuisine} cuisine`}
        />
        {cuisine}
      </label>
    ))}
  </fieldset>

  <fieldset>
    <legend>Price Range</legend>
    {['budget', 'moderate', 'expensive'].map(range => (
      <label key={range}>
        <input 
          type="radio"
          name="priceRange"
          value={range}
          checked={preferences.priceRange === range}
          onChange={(e) => updatePrice(e.target.value)}
          aria-label={`${range} price range (${getPriceDescription(range)})`}
        />
        {capitalize(range)}
      </label>
    ))}
  </fieldset>

  <button type="submit">Save Changes</button>
  <button type="button" onClick={handleClose} aria-label="Close profile editor">
    Cancel
  </button>
</dialog>

/**
 * Live Regions for Dynamic Content
 */
<div aria-live="assertive" aria-atomic="true" className="sr-only">
  {/* Announcements only for screen readers */}
  {loginAttempts > 2 && "Account locked due to multiple failed attempts"}
</div>

<div aria-live="polite" role="status">
  {/* Less urgent updates */}
  {isSaving && "Saving preferences..."}
  {saveSuccess && "Preferences saved successfully"}
</div>
```

### Screen Reader Testing Checklist

- [ ] All form fields have proper labels
- [ ] Error messages are announced with `role="alert"`
- [ ] Status updates use `aria-live="polite"`
- [ ] Buttons and links have descriptive text
- [ ] Images have appropriate alt text
- [ ] Headings convey document structure
- [ ] Icon-only buttons have `aria-label`
- [ ] Modals are marked with `aria-modal="true"`
- [ ] Skip links for keyboard (optional but helpful)
- [ ] Form validation errors are clear

---

## 5. TESTING SCENARIOS

### Automated Testing

```typescript
/**
 * Unit Tests with Testing Library
 */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('SignIn Component - Accessibility', () => {
  test('form has accessible label and input', () => {
    render(<SignIn />);
    
    // Labels should be properly associated
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    
    // Input should have proper attributes
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
  });

  test('error messages are announced to screen readers', async () => {
    const user = userEvent.setup();
    render(<SignIn />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    // Error should be in alert role
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveTextContent(/email is required/i);
  });

  test('tab order is logical', async () => {
    const user = userEvent.setup();
    const { container } = render(<SignIn />);
    
    // Start at first focusable element
    await user.tab();
    expect(screen.getByLabelText(/email/i)).toHaveFocus();
    
    // Tab to password
    await user.tab();
    expect(screen.getByLabelText(/password/i)).toHaveFocus();
    
    // Tab to remember me
    await user.tab();
    expect(screen.getByRole('checkbox')).toHaveFocus();
    
    // Tab to submit button
    await user.tab();
    expect(screen.getByRole('button', { name: /sign in/i })).toHaveFocus();
  });
});

/**
 * Contrast Testing
 */
import { getContrast } from 'polished';

describe('Color Contrast', () => {
  test('primary button has sufficient contrast', () => {
    const foreground = '#ffffff'; // Button text
    const background = '#ff6b6b'; // Primary red
    const contrast = getContrast(foreground, background);
    
    expect(contrast).toBeGreaterThanOrEqual(4.5); // AA standard
  });
});
```

### Manual Testing Checklist

```markdown
## Keyboard Navigation Testing

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical (left to right, top to bottom)
- [ ] Focus is always visible
- [ ] No keyboard traps
- [ ] Escape closes modals
- [ ] Enter submits forms

## Screen Reader Testing

- [ ] Test with NVDA (Windows) / JAWS
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] All content is announced
- [ ] Form labels are properly associated
- [ ] Error messages are announced as alerts
- [ ] Buttons have clear purpose
- [ ] Images have alt text

## Visual Testing

- [ ] Colors have sufficient contrast (use WebAIM checker)
- [ ] Content is readable at 200% zoom
- [ ] Text line height is at least 1.5
- [ ] Color is not the only conveyor of information
- [ ] Buttons are at least 44x44 pixels

## Mobile/Touch Testing

- [ ] Touch targets are at least 44x44 CSS pixels
- [ ] Spacing between targets is adequate
- [ ] Mobile zoom is not disabled
- [ ] Viewport meta tag is proper
- [ ] Responsive layout works correctly

## Automated Accessibility Testing

```javascript
// Using axe-core library
import { axe, toHaveNoViolations } from 'jest-axe';

test('SignIn has no accessibility violations', async () => {
  const { container } = render(<SignIn />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 6. QUALITY ASSURANCE CHECKLIST

### Code Quality

- [ ] No console errors or warnings
- [ ] No unused imports or variables
- [ ] Code follows project style guide
- [ ] Comments explain complex logic
- [ ] No hardcoded secrets or API keys
- [ ] Error handling is comprehensive
- [ ] Loading states are handled
- [ ] Empty states are handled

### Functional Testing

#### Sign In Flow
- [ ] Email validation works (valid/invalid formats)
- [ ] Password field is masked
- [ ] Remember me checkbox persists on return
- [ ] Error messages appear for invalid credentials
- [ ] Successful login redirects to chatbot
- [ ] Token is stored in localStorage
- [ ] Concurrent login prevents duplicate sessions

#### Sign Up Flow
- [ ] All form fields are required
- [ ] Email must be in valid format
- [ ] Password must be minimum 6 characters
- [ ] Confirm password must match
- [ ] Terms checkbox must be checked
- [ ] Email uniqueness is validated
- [ ] Successful signup logs in user
- [ ] Preferences are initialized with defaults

#### Profile Management
- [ ] Profile modal opens/closes properly
- [ ] Edit mode allows field changes
- [ ] Cuisine selection works (multi-select)
- [ ] Price range selection works (single)
- [ ] Location input accepts text
- [ ] Save button persists changes
- [ ] Cancel discards changes
- [ ] Profile displays updated info

### Performance Testing

```typescript
/**
 * Performance Metrics
 */

// Lighthouse scores (target)
const performanceTargets = {
  performance: 90,      // Page speed
  accessibility: 95,    // A11y compliance
  bestPractices: 90,    // Security & best practices
  seo: 90,              // Search engine optimization
};

// Key metrics
const webVitals = {
  'Largest Contentful Paint (LCP)': '< 2.5s',
  'First Input Delay (FID)': '< 100ms',
  'Cumulative Layout Shift (CLS)': '< 0.1',
};

// Bundle size targets
const bundleSizeTargets = {
  main: '< 100kb', // Gzipped
  vendor: '< 200kb',
  total: '< 300kb',
};
```

### Visual Regression Testing

```typescript
/**
 * Visual snapshots for regression detection
 */

describe('SignIn Component Visual Regression', () => {
  test('renders correctly in default state', () => {
    const { container } = render(<SignIn />);
    expect(container).toMatchSnapshot();
  });

  test('renders correctly with error state', () => {
    const { container } = render(
      <SignIn initialError="Invalid credentials" />
    );
    expect(container).toMatchSnapshot();
  });

  test('renders correctly with loading state', () => {
    const { container } = render(<SignIn isLoading={true} />);
    expect(container).toMatchSnapshot();
  });
});
```

### Cross-Browser Testing

- [ ] Chrome/Edge (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Responsive Design Testing

```
Breakpoints to test:
- 320px (mobile)
- 375px (iPhone SE)
- 768px (tablet)
- 1024px (desktop)
- 1440px (large desktop)
- 2560px (ultra-wide)

Orientations:
- Portrait
- Landscape
```

---

## 7. ACCESSIBILITY RESOURCES

### Tools

| Tool | Purpose | Link |
|------|---------|------|
| axe DevTools | Automated accessibility testing | https://www.deque.com/axe/devtools/ |
| WAVE | Visual feedback for accessibility | https://wave.webaim.org/ |
| WebAIM Contrast | Color contrast checker | https://webaim.org/resources/contrastchecker/ |
| NVDA | Screen reader (free, Windows) | https://www.nvaccess.org/ |
| JAWS | Screen reader (paid, industry standard) | https://www.freedomscientific.com/products/software/jaws/ |
| Lighthouse | Built-in Chrome DevTools audit | https://developers.google.com/web/tools/lighthouse |
| VoiceOver | Screen reader (built-in macOS/iOS) | https://www.apple.com/accessibility/voiceover/ |

### References

- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- WAI-ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- A11y Project Checklist: https://www.a11yproject.com/checklist/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility

### Learning Resources

- WebAIM Articles: https://webaim.org/articles/
- a11y Project Resources: https://www.a11yproject.com/resources/
- Accessibility Testing Guide: https://www.accessibility-developer-guide.com/

---

## 8. ACCESSIBILITY STATEMENT

```
Restaurant Chatbot Accessibility Commitment:

We are committed to making this application accessible to everyone, 
including people with disabilities.

Accessibility Features:
✓ WCAG 2.1 Level AA compliance
✓ Keyboard navigation support
✓ Screen reader compatibility
✓ Color contrast compliance (4.5:1 minimum)
✓ Resizable text (up to 200%)
✓ Mobile-friendly design
✓ Touch target sizing (44x44 minimum)

If you encounter accessibility issues, please:
1. Report the issue via our feedback form
2. Email: accessibility@restaurantchatbot.com
3. Include: browser, device, screen reader, reproduction steps

We aim to respond within 24 hours.

Last Updated: 2024
Next Review: Quarterly
```

---

This comprehensive accessibility framework ensures the application is usable by everyone! 🎉
