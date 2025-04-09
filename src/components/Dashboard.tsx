
import { useState } from 'react';
import { User, AttendanceRecord } from '../utils/types';
import { attendanceRecords, getAttendanceStats } from '../utils/mockData';
import { Check, Clock, UserCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import UserCard from './UserCard';
import Stats from './Stats';
import VerificationModal from './VerificationModal';
import { format } from 'date-fns';
import { checkInUser, checkOutUser } from '../utils/auth';

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [showVerification, setShowVerification] = useState<'face' | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Get stats
  const stats = getAttendanceStats();
  
  // Get today's records for the current user
  const today = new Date().toISOString().split('T')[0];
  const userRecordsToday = attendanceRecords.filter(
    record => record.userId === user.id && record.date.toISOString().split('T')[0] === today
  );
  
  // Get recent records for the current user (last 5)
  const userRecords = attendanceRecords
    .filter(record => record.userId === user.id)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, showAllRecords ? undefined : 5);
  
  // Check if the user has already checked in today
  const hasCheckedIn = userRecordsToday.length > 0;
  
  // Handle check in/out
  const handleAttendance = (isCheckOut = false) => {
    setIsCheckingOut(isCheckOut);
    
    // If user has face registered, use that
    if (user.hasFaceRegistered) {
      setShowVerification('face');
    } 
    // If no biometrics are registered, show an error
    else {
      toast.error('Please register your face ID first');
    }
  };
  
  // Handle successful verification
  const handleVerificationSuccess = () => {
    setShowVerification(null);
    
    if (isRegistering) {
      setIsRegistering(false);
      return;
    }
    
    // Record the user's attendance with face recognition
    if (isCheckingOut) {
      checkOutUser(user.id);
      toast.success('Check-out recorded successfully');
    } else {  
      checkInUser(user.id);
      toast.success('Check-in recorded successfully');
    }
    
    setIsCheckingOut(false);
  };
  
  // Handle biometric registration
  const handleRegisterFace = () => {
    setIsRegistering(true);
    setShowVerification('face');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User card */}
        <UserCard 
          user={user}
          onRegisterFace={handleRegisterFace}
        />
        
        {/* Today's attendance */}
        <div className="bg-white rounded-lg shadow border p-6 col-span-1 md:col-span-2 card-hover">
          <h3 className="text-lg font-semibold mb-4">Today's Attendance</h3>
          
          {hasCheckedIn ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">You've already checked in today</p>
                  <p className="text-sm text-muted-foreground">
                    Check in time: {format(userRecordsToday[0].checkInTime, 'h:mm a')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Verification Method</p>
                  <p className="text-sm text-muted-foreground">
                    Face Recognition
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">
                    {userRecordsToday[0].status === 'on-time' ? 'On Time' : 'Late'}
                  </p>
                </div>
              </div>
              
              {/* Add check-out button if already checked in */}
              <div className="pt-2">
                <button
                  onClick={() => handleAttendance(true)}
                  className="w-full px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
                >
                  Check Out
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You haven't checked in yet</p>
              <button
                onClick={() => handleAttendance(false)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Check In Now
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent attendance records */}
      <div className="bg-white rounded-lg shadow border overflow-hidden card-hover">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Your Recent Attendance</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Check In</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Check Out</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {userRecords.map((record: AttendanceRecord) => (
                <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm">{format(record.date, 'PP')}</td>
                  <td className="px-4 py-3 text-sm">{format(record.checkInTime, 'p')}</td>
                  <td className="px-4 py-3 text-sm">{format(record.checkOutTime, 'p')}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      record.status === 'on-time' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {record.status === 'on-time' ? 'On time' : 'Late'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <UserCheck size={14} className="text-primary" />
                      <span>Face</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {attendanceRecords.filter(record => record.userId === user.id).length > 5 && (
          <div className="p-3 border-t">
            <button
              onClick={() => setShowAllRecords(!showAllRecords)}
              className="flex items-center justify-center w-full text-sm text-primary hover:text-primary/80"
            >
              {showAllRecords ? (
                <>
                  <ChevronUp size={16} className="mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="mr-1" />
                  Show All Records
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Stats section */}
      {user.role === 'admin' && (
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Organization Overview</h2>
          <Stats stats={stats} />
        </div>
      )}
      
      {/* Verification modal */}
      {showVerification && (
        <VerificationModal
          user={user}
          type="face"
          isRegister={isRegistering}
          onSuccess={handleVerificationSuccess}
          onCancel={() => {
            setShowVerification(null);
            setIsRegistering(false);
            setIsCheckingOut(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
