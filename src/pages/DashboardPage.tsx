
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
              <p className="text-muted-foreground">
                No attendance records yet. Records will appear here as users check in.
              </p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'users' && authState.user.role === 'admin' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          {registeredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredUsers.map(user => (
                <div key={user.id} className="bg-white rounded-lg shadow border p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-accent overflow-hidden">
                      <img
                        src={user.profileImage || "/placeholder.svg"}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department:</span>
                      <span>{user.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Position:</span>
                      <span>{user.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="capitalize">{user.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Face ID:</span>
                      <span>{user.hasFaceRegistered ? 'Registered' : 'Not Registered'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fingerprint:</span>
                      <span>{user.hasFingerprint ? 'Registered' : 'Not Registered'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border p-6 text-center">
              <p className="text-muted-foreground">
                No users have registered yet. New users will appear here as they register.
              </p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Work Schedule</h1>
          {authState.user?.schedule ? (
            <div className="bg-white rounded-lg shadow border overflow-hidden">
              <div className="p-4 border-b bg-muted/30">
                <h2 className="font-semibold">Your Weekly Schedule</h2>
              </div>
              <div className="divide-y">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const daySchedule = authState.user?.schedule?.[day as keyof WeeklySchedule];
                  const isCurrentDay = getDayOfWeek() === day;

                  return (
                    <div 
                      key={day}
                      className={`p-4 flex justify-between items-center ${isCurrentDay ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-center">
                        <span className="capitalize font-medium">{day}</span>
                        {isCurrentDay && (
                          <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Today</span>
                        )}
                      </div>
                      <div>
                        {daySchedule?.enabled ? (
                          <span className="text-sm">
                            {daySchedule.startTime} - {daySchedule.endTime}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Day Off</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  You can edit your schedule in the settings.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border p-6 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't set up your schedule yet.
              </p>
              <button
                onClick={() => setActiveTab('settings')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
              >
                Set Up Schedule
              </button>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'settings' && (
        <Settings authState={authState} setAuthState={setAuthState} />
      )}
    </Layout>
  );
};

export default DashboardPage;
