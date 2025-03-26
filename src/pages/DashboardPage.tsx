
import { useState } from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import AttendanceList from '../components/AttendanceList';
import { attendanceRecords, users } from '../utils/mockData';
import { AuthState } from '../utils/types';

interface DashboardPageProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const DashboardPage = ({ authState, setAuthState }: DashboardPageProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
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
          <AttendanceList records={filteredRecords} />
        </div>
      )}
      
      {activeTab === 'users' && authState.user.role === 'admin' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
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
        </div>
      )}
      
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Work Schedule</h1>
          <p className="text-muted-foreground">
            This feature will be implemented in a future update.
          </p>
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            This feature will be implemented in a future update.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default DashboardPage;
