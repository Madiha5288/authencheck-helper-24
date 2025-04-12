
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import AttendanceList from '../components/AttendanceList';
import Settings from '../components/Settings';
import { attendanceRecords } from '../utils/mockData';
import { registeredUsers } from '../utils/auth';
import { AuthState, User, WeeklySchedule } from '../utils/types';

interface DashboardPageProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const DashboardPage = ({ authState, setAuthState }: DashboardPageProps) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Update active tab based on the current route
  useEffect(() => {
    const path = location.pathname.split('/')[1];
    if (path) {
      setActiveTab(path);
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);
  
  if (!authState.user) return null;
  
  // Filter attendance records for admins to see all, and for users to see only their own
  const filteredRecords = authState.user.role === 'admin'
    ? attendanceRecords
    : attendanceRecords.filter(record => record.userId === authState.user?.id);
  
  // Get current day of week
  const getDayOfWeek = (): keyof WeeklySchedule | null => {
    const days: (keyof WeeklySchedule)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIndex = new Date().getDay();
    return days[dayIndex];
  };

  // Get today's schedule if available
  const getTodaySchedule = () => {
    if (!authState.user?.schedule) return null;
    
    const today = getDayOfWeek();
    if (!today) return null;
    
    const daySchedule = authState.user.schedule[today];
    return daySchedule.enabled ? daySchedule : null;
  };
  
  const todaySchedule = getTodaySchedule();
  
  return (
    <Layout authState={authState} setAuthState={setAuthState}>
      {activeTab === 'dashboard' && (
        <Dashboard user={authState.user} />
      )}
      
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Attendance Records</h1>
          {filteredRecords.length > 0 ? (
            <AttendanceList records={filteredRecords} />
          ) : (
            <div className="bg-white rounded-lg shadow border p-6 text-center">
              <p className="text-muted-foreground">No attendance records found.</p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'users' && authState.user.role === 'admin' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Registered Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Face ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {registeredUsers.map((user: User) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm">{user.name}</td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">{user.department}</td>
                      <td className="px-4 py-3 text-sm capitalize">{user.role}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.hasFaceRegistered
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {user.hasFaceRegistered ? 'Registered' : 'Not Registered'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Work Schedule</h1>
          <div className="bg-white rounded-lg shadow border p-6">
            <p className="text-muted-foreground mb-4">Manage your work schedule in the settings.</p>
            {todaySchedule ? (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Today's Schedule</h3>
                <p>Start Time: {todaySchedule.startTime}</p>
                <p>End Time: {todaySchedule.endTime}</p>
              </div>
            ) : (
              <p>No schedule set for today.</p>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'settings' && (
        <Settings authState={authState} setAuthState={setAuthState} />
      )}
    </Layout>
  );
};

export default DashboardPage;
