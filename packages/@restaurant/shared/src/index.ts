// Export all shared types
export * from './types/auth';
export * from './types/profile';

// Export all shared services
export * from './services/firebaseService';
export { userProfileService } from './services/userProfileService';

// Export all shared contexts
export { AuthProvider, useAuth } from './contexts/AuthContext';
export type { AuthContextType } from './contexts/AuthContext';
export { UserProfileProvider, useUserProfile } from './contexts/UserProfileContext';
export type { UserProfileContextType } from './contexts/UserProfileContext';

// Export all shared components
export { Header } from './components/Header';
export { Logo } from './components/Logo';

