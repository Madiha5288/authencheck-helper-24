
import { User, AttendanceRecord } from "./types";

// Mock users data
export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    department: "IT",
    position: "System Administrator",
    registeredOn: new Date("2023-01-15"),
    lastLogin: new Date("2023-06-10"),
    profileImage: "/placeholder.svg",
    hasFaceRegistered: true,
    hasFingerprint: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
    department: "HR",
    position: "HR Manager",
    registeredOn: new Date("2023-02-20"),
    lastLogin: new Date("2023-06-09"),
    profileImage: "/placeholder.svg",
    hasFaceRegistered: true,
    hasFingerprint: true,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    password: "password123",
    role: "user",
    department: "Marketing",
    position: "Marketing Specialist",
    registeredOn: new Date("2023-03-10"),
    lastLogin: new Date("2023-06-08"),
    profileImage: "/placeholder.svg",
    hasFaceRegistered: false,
    hasFingerprint: true,
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    password: "password123",
    role: "user",
    department: "Finance",
    position: "Financial Analyst",
    registeredOn: new Date("2023-04-05"),
    lastLogin: new Date("2023-06-07"),
    profileImage: "/placeholder.svg",
    hasFaceRegistered: true,
    hasFingerprint: false,
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    password: "password123",
    role: "user",
    department: "IT",
    position: "Software Developer",
    registeredOn: new Date("2023-05-15"),
    lastLogin: new Date("2023-06-06"),
    profileImage: "/placeholder.svg",
    hasFaceRegistered: false,
    hasFingerprint: false,
  },
];

// Generate random attendance records
const generateRandomTime = (date: Date, baseHour: number): Date => {
  const newDate = new Date(date);
  newDate.setHours(baseHour, Math.floor(Math.random() * 60));
  return newDate;
};

export const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Generate records for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Generate records for each user
    users.forEach(user => {
      // 90% chance of attendance for each user each day
      if (Math.random() < 0.9) {
        const checkInTime = generateRandomTime(date, 9); // Around 9 AM
        const checkOutTime = generateRandomTime(date, 17); // Around 5 PM
        
        records.push({
          id: `${user.id}-${date.toISOString().split('T')[0]}`,
          userId: user.id,
          userName: user.name,
          date: new Date(date),
          checkInTime,
          checkOutTime,
          verificationMethod: Math.random() > 0.5 ? 'face' : 'fingerprint',
          status: checkInTime.getHours() >= 9 && checkInTime.getMinutes() > 15 ? 'late' : 'on-time',
        });
      }
    });
  }
  
  return records;
};

export const attendanceRecords = generateAttendanceRecords();

// Attendance statistics
export const getAttendanceStats = () => {
  const totalUsers = users.length;
  const today = new Date().toISOString().split('T')[0];
  
  const todayRecords = attendanceRecords.filter(
    record => record.date.toISOString().split('T')[0] === today
  );
  
  const presentToday = todayRecords.length;
  const absentToday = totalUsers - presentToday;
  const lateToday = todayRecords.filter(record => record.status === 'late').length;
  
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });
  
  const last7DaysAttendance = last7Days.map(day => {
    const records = attendanceRecords.filter(
      record => record.date.toISOString().split('T')[0] === day
    );
    return {
      date: day,
      present: records.length,
      absent: totalUsers - records.length,
      late: records.filter(record => record.status === 'late').length,
    };
  });
  
  // Department-wise attendance
  const departments = [...new Set(users.map(user => user.department))];
  const departmentAttendance = departments.map(dept => {
    const deptUsers = users.filter(user => user.department === dept);
    const deptUserIds = deptUsers.map(user => user.id);
    const deptRecords = todayRecords.filter(record => deptUserIds.includes(record.userId));
    
    return {
      department: dept,
      present: deptRecords.length,
      absent: deptUsers.length - deptRecords.length,
      percentage: Math.round((deptRecords.length / deptUsers.length) * 100),
    };
  });
  
  return {
    totalUsers,
    presentToday,
    absentToday,
    lateToday,
    attendancePercentage: Math.round((presentToday / totalUsers) * 100),
    last7DaysAttendance,
    departmentAttendance,
    faceRecognitionCount: todayRecords.filter(r => r.verificationMethod === 'face').length,
    fingerprintCount: todayRecords.filter(r => r.verificationMethod === 'fingerprint').length,
  };
};
