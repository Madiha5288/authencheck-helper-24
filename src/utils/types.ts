
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  department: string;
  position: string;
  registeredOn: Date;
  lastLogin: Date;
  profileImage: string;
  hasFaceRegistered: boolean;
  hasFingerprint: boolean;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: Date;
  checkInTime: Date;
  checkOutTime: Date;
  verificationMethod: 'face' | 'fingerprint';
  status: 'on-time' | 'late' | 'absent';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface VerificationMethod {
  type: 'face' | 'fingerprint';
  status: 'not-registered' | 'registered' | 'in-progress' | 'success' | 'failure';
}
