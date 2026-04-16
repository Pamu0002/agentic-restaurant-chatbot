/**
 * AgentDine Color Palette
 * Professional orange-based theme for web application
 */

export const colors = {
  // Primary Colors (Orange Gradient)
  primary: {
    light: '#FF8C42',      // Light orange for accents
    base: '#FF6B35',       // Main orange for CTAs
    dark: '#E85A2A',       // Darker orange for hover
  },

  // Secondary & Status Colors
  secondary: {
    danger: '#E63946',     // Red for alerts, cancellations
    success: '#2ecc71',    // Green for confirmations
    warning: '#FFD700',    // Gold for ratings, premium
    accent: '#FFB84D',     // Gold accent variant
  },

  // Background Colors
  background: {
    main: '#0F1419',       // Dark main background
    card: '#16202f',       // Slightly lighter card background
    hover: '#1a1f2e',      // Hover state background
    overlay: 'rgba(15, 20, 25, 0.95)', // Overlay with opacity
  },

  // Text Colors
  text: {
    primary: '#ffffff',    // Main white text
    secondary: '#b0b8c1',  // Secondary light gray
    muted: '#64748B',      // Muted gray
    label: '#505a6a',      // Label gray
  },

  // Borders & Dividers
  border: {
    default: 'rgba(255, 140, 66, 0.3)',   // Subtle orange border
    hover: 'rgba(255, 140, 66, 0.6)',     // Highlighted orange border
    light: 'rgba(255, 140, 66, 0.15)',    // Very light divider
  },

  // Gradients
  gradient: {
    primary: 'linear-gradient(135deg, #FF6B35, #FF8C42)',     // Orange primary gradient
    primaryReverse: 'linear-gradient(135deg, #FF8C42, #FF6B35)', // Reverse gradient
    background: 'linear-gradient(180deg, #0F1419 0%, #1a1f2e 50%, #16213e 100%)', // Dark background gradient
    backgroundCard: 'linear-gradient(180deg, rgba(30,41,59,0.8), rgba(15,23,42,0.6))', // Card gradient
  },
};

// Helper function to create linear gradients
export const createGradient = (startColor: string, endColor: string, direction = '135deg') =>
  `linear-gradient(${direction}, ${startColor}, ${endColor})`;

// Export for easy access in components
export default colors;
