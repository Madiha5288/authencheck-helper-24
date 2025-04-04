import { User, LoginCredentials, AuthState, AttendanceRecord } from './types';
import { users, attendanceRecords } from './mockData';
import { isBiometricSupported, requestBiometricAuth, isFingerPrintAvailable } from './biometricAuth';

// Initial auth state
export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Check if user exists in registered users
export const authenticateUser = (credentials: LoginCredentials): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      // First, check registered users in the main users array
      let user = users.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );
      
      // If not found in main users array, check in registeredUsers array
      if (!user && registeredUsers.length > 0) {
        user = registeredUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );
      }
      
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
  // At least one biometric method needs to be registered
  return user.hasFaceRegistered || user.hasFingerprint;
};

// Enhanced verification process with native biometrics when available
export const verifyBiometric = async (
  type: 'face' | 'fingerprint',
  userId: string
): Promise<boolean> => {
  // For fingerprints, only use native if available and detected
  if (type === 'fingerprint') {
    const isFingerprintAvailable = await isFingerPrintAvailable();
    
    if (isFingerprintAvailable) {
      try {
        console.log('Using native fingerprint authentication');
        return await requestBiometricAuth();
      } catch (error) {
        console.error('Native fingerprint authentication failed:', error);
        // Don't fall back to simulation for fingerprints - require actual hardware
        return false;
      }
    } else {
      console.warn('No fingerprint sensor detected');
      return false;
    }
  }
  
  // For face verification, continue with existing simulation
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

// Check in a user and create an attendance record
export const checkInUser = (userId: string, verificationMethod: 'face' | 'fingerprint'): void => {
  const user = users.find(u => u.id === userId);
  if (!user) return;

  const today = new Date();
  const recordId = `${userId}-${today.toISOString().split('T')[0]}`;
  
  // Check if user already checked in today
  const existingRecord = attendanceRecords.find(record => record.id === recordId);
  if (existingRecord) {
    console.log('User already checked in today');
    return;
  }
  
  const checkInTime = new Date();
  const isLate = checkInTime.getHours() >= 9 && checkInTime.getMinutes() > 15;
  
  // Create a new attendance record
  const newRecord: AttendanceRecord = {
    id: recordId,
    userId: user.id,
    userName: user.name,
    date: today,
    checkInTime: checkInTime,
    checkOutTime: new Date(today.setHours(17, 0, 0)), // Default to 5:00 PM
    verificationMethod: verificationMethod,
    status: isLate ? 'late' : 'on-time',
  };
  
  attendanceRecords.push(newRecord);
  console.log(`User ${user.name} checked in at ${checkInTime.toLocaleTimeString()}`);
};

// Check if a user can log in based on biometric status
export const canUserLogIn = (user: User): boolean => {
  // User must have at least one biometric method registered
  return user.hasFaceRegistered || user.hasFingerprint;
};

// Enhanced check-out functionality
export const checkOutUser = (userId: string, verificationMethod: 'face' | 'fingerprint'): void => {
  const user = users.find(u => u.id === userId);
  if (!user) return;

  const today = new Date();
  const recordId = `${userId}-${today.toISOString().split('T')[0]}`;
  
  // Find the user's record for today
  const existingRecord = attendanceRecords.find(record => record.id === recordId);
  if (!existingRecord) {
    console.log('No check-in record found for today');
    return;
  }
  
  // Update the check-out time
  existingRecord.checkOutTime = new Date();
  
  console.log(`User ${user.name} checked out at ${existingRecord.checkOutTime.toLocaleTimeString()}`);
};

// Array to store newly registered users
export const registeredUsers: User[] = [];

// Function to add a newly registered user to both the registeredUsers array and the main users array
export const addNewUser = (user: User): void => {
  // Add to registered users array
  registeredUsers.push(user);
  
  // Also add to main users array to ensure it's available for authentication
  users.push(user);
  
  console.log(`User ${user.name} added to database`);
}
