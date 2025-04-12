
import { AttendanceRecord, User } from './types';

// Mock user database
export const users: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
    department: 'IT',
    position: 'System Administrator',
    registeredOn: new Date('2023-01-01'),
    lastLogin: new Date(),
    profileImage: '/placeholder.svg',
    hasFaceRegistered: true,
  },
  {
    id: 'user-2',
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password',
    role: 'user',
    department: 'HR',
    position: 'HR Specialist',
    registeredOn: new Date('2023-02-15'),
    lastLogin: new Date(),
    profileImage: '/placeholder.svg',
    hasFaceRegistered: true,
  },
  {
    id: 'user-3',
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password',
    role: 'user',
    department: 'Finance',
    position: 'Financial Analyst',
    registeredOn: new Date('2023-03-10'),
    lastLogin: new Date(),
    profileImage: '/placeholder.svg',
    hasFaceRegistered: false,
  }
];

// Generate mock attendance records
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'record-1',
    userId: 'user-1',
    userName: 'Admin User',
    date: new Date('2023-05-01'),
    checkInTime: new Date('2023-05-01T08:55:00'),
    checkOutTime: new Date('2023-05-01T17:05:00'),
    status: 'on-time',
    verificationMethod: 'face',
  },
  {
    id: 'record-2',
    userId: 'user-1',
    userName: 'Admin User',
    date: new Date('2023-05-02'),
    checkInTime: new Date('2023-05-02T09:02:00'),
    checkOutTime: new Date('2023-05-02T17:10:00'),
    status: 'on-time',
    verificationMethod: 'face',
  },
  {
    id: 'record-3',
    userId: 'user-1',
    userName: 'Admin User',
    date: new Date('2023-05-03'),
    checkInTime: new Date('2023-05-03T09:30:00'),
    checkOutTime: new Date('2023-05-03T17:30:00'),
    status: 'late',
    verificationMethod: 'face',
  },
  {
    id: 'record-4',
    userId: 'user-1',
    userName: 'Admin User',
    date: new Date('2023-05-04'),
    checkInTime: new Date('2023-05-04T08:50:00'),
    checkOutTime: new Date('2023-05-04T17:00:00'),
    status: 'on-time',
    verificationMethod: 'face',
  },
  {
    id: 'record-5',
    userId: 'user-1',
    userName: 'Admin User',
    date: new Date('2023-05-05'),
    checkInTime: new Date('2023-05-05T08:45:00'),
    checkOutTime: new Date('2023-05-05T16:50:00'),
    status: 'on-time',
    verificationMethod: 'face',
  },
  {
    id: 'record-6',
    userId: 'user-2',
    userName: 'John Smith',
    date: new Date('2023-05-01'),
    checkInTime: new Date('2023-05-01T09:05:00'),
    checkOutTime: new Date('2023-05-01T17:30:00'),
    status: 'on-time',
    verificationMethod: 'face',
  },
  {
    id: 'record-7',
    userId: 'user-2',
    userName: 'John Smith',
    date: new Date('2023-05-02'),
    checkInTime: new Date('2023-05-02T09:20:00'),
    checkOutTime: new Date('2023-05-02T17:15:00'),
    status: 'late',
    verificationMethod: 'face',
  },
  {
    id: 'record-8',
    userId: 'user-2',
    userName: 'John Smith',
    date: new Date('2023-05-03'),
    checkInTime: new Date('2023-05-03T08:55:00'),
    checkOutTime: new Date('2023-05-03T17:05:00'),
    status: 'on-time',
    verificationMethod: 'face',
  },
  {
    id: 'record-9',
    userId: 'user-2',
    userName: 'John Smith',
    date: new Date('2023-05-04'),
    checkInTime: new Date('2023-05-04T09:30:00'),
    checkOutTime: new Date('2023-05-04T17:40:00'),
    status: 'late',
    verificationMethod: 'face',
  },
  {
    id: 'record-10',
    userId: 'user-2',
    userName: 'John Smith',
    date: new Date('2023-05-05'),
    checkInTime: new Date('2023-05-05T08:50:00'),
    checkOutTime: new Date('2023-05-05T17:00:00'),
    status: 'on-time',
    verificationMethod: 'face',
  },
];

// Today's records (current date)
export const todayRecords: AttendanceRecord[] = [
  {
    id: 'today-1',
    userId: 'user-1',
    userName: 'Admin User',
    date: new Date(),
    checkInTime: new Date(new Date().setHours(8, 55, 0, 0)),
    checkOutTime: new Date(new Date().setHours(17, 5, 0, 0)),
    status: 'on-time',
    verificationMethod: 'face',
  },
  {
    id: 'today-2',
    userId: 'user-2',
    userName: 'John Smith',
    date: new Date(),
    checkInTime: new Date(new Date().setHours(9, 15, 0, 0)),
    checkOutTime: new Date(new Date().setHours(17, 30, 0, 0)),
    status: 'late',
    verificationMethod: 'face',
  },
];

// Get attendance statistics for the dashboard
export const getAttendanceStats = () => {
  return {
    totalUsers: 10,
    presentToday: 8,
    absentToday: 2,
    lateToday: 2,
    attendancePercentage: 80,
    
    // Last 7 days attendance
    last7DaysAttendance: [
      {
        date: '2023-05-01',
        present: 8,
        absent: 2,
        late: 2,
      },
      {
        date: '2023-05-02',
        present: 9,
        absent: 1,
        late: 3,
      },
      {
        date: '2023-05-03',
        present: 7,
        absent: 3,
        late: 2,
      },
      {
        date: '2023-05-04',
        present: 10,
        absent: 0,
        late: 1,
      },
      {
        date: '2023-05-05',
        present: 8,
        absent: 2,
        late: 0,
      },
      {
        date: '2023-05-06',
        present: 9,
        absent: 1,
        late: 2,
      },
      {
        date: '2023-05-07',
        present: 8,
        absent: 2,
        late: 1,
      },
    ],
    
    // Department attendance
    departmentAttendance: [
      {
        department: 'IT',
        present: 4,
        absent: 0,
        percentage: 100,
      },
      {
        department: 'HR',
        present: 2,
        absent: 1,
        percentage: 67,
      },
      {
        department: 'Finance',
        present: 3,
        absent: 0,
        percentage: 100,
      },
      {
        department: 'Marketing',
        present: 1,
        absent: 1,
        percentage: 50,
      },
    ],
    
    // Verification methods
    faceRecognitionCount: 8,
    fingerprintCount: 0,
  };
};
