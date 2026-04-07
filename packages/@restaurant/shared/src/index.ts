// Export all shared types
export * from './types/auth';

// Export all shared services
export * from './services/firebaseService';

// Export all shared contexts
export { AuthProvider, useAuth } from './contexts/AuthContext';
export type { AuthContextType } from './contexts/AuthContext';

