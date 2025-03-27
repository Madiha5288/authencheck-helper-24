
import { User, LoginCredentials, AuthState } from './types';
import { users } from './mockData';

// Initial auth state
export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Check if user exists in mock data
export const authenticateUser = (credentials: LoginCredentials): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      const user = users.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        // Update last login
        user.lastLogin = new Date();
        resolve(user);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800); // Simulate network delay
  });
};

// Save auth data to local storage
export const saveAuthToStorage = (user: User) => {
  localStorage.setItem('authUser', JSON.stringify(user));
  localStorage.setItem('isAuthenticated', 'true');
};

// Clear auth data from local storage
export const clearAuthFromStorage = () => {
  localStorage.removeItem('authUser');
  localStorage.removeItem('isAuthenticated');
};

// Load auth data from local storage
export const loadAuthFromStorage = (): AuthState => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userJson = localStorage.getItem('authUser');
  
  if (isAuthenticated && userJson) {
    try {
      const user = JSON.parse(userJson) as User;
      return {
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      };
    } catch (error) {
      clearAuthFromStorage();
    }
  }
  
  return initialAuthState;
};

// Check if required biometrics are registered
export const areBiometricsRegistered = (user: User): boolean => {
  return user.hasFaceRegistered && user.hasFingerprint;
};

// Simulated verification process with increased success rate
export const verifyBiometric = (
  type: 'face' | 'fingerprint',
  userId: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate verification process
    setTimeout(() => {
      // 95% success rate for simulation purposes
      const success = Math.random() < 0.95;
      console.log(`${type} verification ${success ? 'succeeded' : 'failed'} for user ${userId}`);
      resolve(success);
    }, 2000); // Slightly faster "scan"
  });
};

// Register new biometric with high success rate
export const registerBiometric = (
  type: 'face' | 'fingerprint',
  userId: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Almost always succeed for registration (98%)
      const success = Math.random() < 0.98;
      
      if (success) {
        // Find user and update their biometric status
        const user = users.find(u => u.id === userId);
        if (user) {
          if (type === 'face') {
            user.hasFaceRegistered = true;
          } else {
            user.hasFingerprint = true;
          }
          
          // Update the stored user if this is the current user
          const storedUserJson = localStorage.getItem('authUser');
          if (storedUserJson) {
            try {
              const storedUser = JSON.parse(storedUserJson) as User;
              if (storedUser.id === userId) {
                if (type === 'face') {
                  storedUser.hasFaceRegistered = true;
                } else {
                  storedUser.hasFingerprint = true;
                }
                localStorage.setItem('authUser', JSON.stringify(storedUser));
              }
            } catch (error) {
              console.error('Error updating stored user:', error);
            }
          }
        }
        
        console.log(`${type} registration successful for user ${userId}`);
        resolve(true);
      } else {
        console.log(`${type} registration failed for user ${userId}`);
        resolve(false);
      }
    }, 2500);
  });
};

// Check if a user can log in based on biometric status
export const canUserLogIn = (user: User): boolean => {
  // User must have both face and fingerprint registered
  return user.hasFaceRegistered && user.hasFingerprint;
};
