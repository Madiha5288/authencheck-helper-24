
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
  profileImage?: string;
  hasFaceRegistered: boolean;
  schedule?: WeeklySchedule;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: Date;
  checkInTime: Date;
  checkOutTime: Date;
  status: 'on-time' | 'late';
  verificationMethod: 'face' | 'fingerprint';
}

export interface WorkDay {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface WeeklySchedule {
  monday: WorkDay;
  tuesday: WorkDay;
  wednesday: WorkDay;
  thursday: WorkDay;
  friday: WorkDay;
  saturday: WorkDay;
  sunday: WorkDay;
}
