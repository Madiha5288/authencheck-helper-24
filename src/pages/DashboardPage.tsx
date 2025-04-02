
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import AttendanceList from '../components/AttendanceList';
import Settings from '../components/Settings';
import { attendanceRecords } from '../utils/mockData';
import { registeredUsers } from '../utils/auth';
import { AuthState } from '../utils/types';

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
          <div className="bg-white rounded-lg shadow border p-6 text-center">
            <p className="text-muted-foreground">
              No schedule data yet. Schedules will appear here as they are created.
            </p>
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
