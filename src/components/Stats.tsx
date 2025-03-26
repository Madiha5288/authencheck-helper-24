
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Fingerprint, UserCheck, User } from 'lucide-react';

interface StatsProps {
  stats: {
    totalUsers: number;
    presentToday: number;
    absentToday: number;
    lateToday: number;
    attendancePercentage: number;
    last7DaysAttendance: Array<{
      date: string;
      present: number;
      absent: number;
      late: number;
    }>;
    departmentAttendance: Array<{
      department: string;
      present: number;
      absent: number;
      percentage: number;
    }>;
    faceRecognitionCount: number;
    fingerprintCount: number;
  };
}

const Stats = ({ stats }: StatsProps) => {
  const [chartWidth, setChartWidth] = useState(500);
  
  // Update chart width based on window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartWidth(300);
      } else {
        setChartWidth(500);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Format chart data
  const formatAttendanceData = () => {
    return stats.last7DaysAttendance.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Present: day.present,
      Absent: day.absent,
      Late: day.late,
    })).reverse();
  };
  
  // Colors for pie chart
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];
  
  // Verification method data
  const verificationData = [
    { name: 'Face Recognition', value: stats.faceRecognitionCount },
    { name: 'Fingerprint', value: stats.fingerprintCount },
  ];
  
  // Status data
  const statusData = [
    { name: 'Present', value: stats.presentToday },
    { name: 'Absent', value: stats.absentToday },
    { name: 'Late', value: stats.lateToday },
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border p-4 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Present Today</p>
              <h3 className="text-2xl font-bold mt-1">{stats.presentToday}</h3>
              <p className="text-xs text-green-600 mt-1">
                {stats.attendancePercentage}% Attendance Rate
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <UserCheck size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border p-4 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Absent Today</p>
              <h3 className="text-2xl font-bold mt-1">{stats.absentToday}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-600">
                <path d="M16 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"></path>
                <path d="M12 8v4"></path>
                <path d="M16 16v-4h4"></path>
                <line x1="12" y1="16" x2="12" y2="16"></line>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border p-4 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Late Today</p>
              <h3 className="text-2xl font-bold mt-1">{stats.lateToday}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-600">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly attendance chart */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={formatAttendanceData()}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Present" fill="#3B82F6" stackId="a" />
              <Bar dataKey="Late" fill="#F59E0B" stackId="a" />
              <Bar dataKey="Absent" fill="#EF4444" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Verification methods and status pie charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold mb-2">Verification Methods</h3>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={verificationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {verificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                  <span className="text-xs">Face ({stats.faceRecognitionCount})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs">Fingerprint ({stats.fingerprintCount})</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold mb-2">Today's Status</h3>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                  <span className="text-xs">Present ({stats.presentToday})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs">Absent ({stats.absentToday})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs">Late ({stats.lateToday})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Department attendance */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold mb-4">Department Attendance</h3>
        <div className="grid grid-cols-1 gap-4">
          {stats.departmentAttendance.map((dept) => (
            <div key={dept.department} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{dept.department}</h4>
                <span className="text-sm text-muted-foreground">
                  {dept.percentage}% Present
                </span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${dept.percentage}%` }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Present: {dept.present}</span>
                <span>Absent: {dept.absent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
