
import { User, AttendanceRecord } from "./types";

// Empty initial users array - will be populated with newly registered users
export const users: User[] = [];

// Empty array for attendance records
export const attendanceRecords: AttendanceRecord[] = [];

// Attendance statistics with zero/empty values
export const getAttendanceStats = () => {
  const totalUsers = users.length;
  
  return {
    totalUsers,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    attendancePercentage: 0,
    last7DaysAttendance: [],
    departmentAttendance: [],
    faceRecognitionCount: 0,
    fingerprintCount: 0,
  };
};
