
import { useState, useEffect } from 'react';
import { WeeklySchedule, WorkDay, User, AuthState } from '../utils/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface ScheduleManagerProps {
  user: User;
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const defaultWorkDay: WorkDay = {
  enabled: false,
  startTime: '09:00',
  endTime: '17:00',
};

const defaultSchedule: WeeklySchedule = {
  monday: { ...defaultWorkDay, enabled: true },
  tuesday: { ...defaultWorkDay, enabled: true },
  wednesday: { ...defaultWorkDay, enabled: true },
  thursday: { ...defaultWorkDay, enabled: true },
  friday: { ...defaultWorkDay, enabled: true },
  saturday: { ...defaultWorkDay },
  sunday: { ...defaultWorkDay },
};

const ScheduleManager = ({ user, authState, setAuthState }: ScheduleManagerProps) => {
  const [schedule, setSchedule] = useState<WeeklySchedule>(
    user.schedule || defaultSchedule
  );

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ] as const;

  const handleDayToggle = (day: keyof WeeklySchedule, enabled: boolean) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled,
      }
    }));
  };

  const handleTimeChange = (
    day: keyof WeeklySchedule,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      }
    }));
  };

  const handleSaveSchedule = () => {
    if (!authState.user) return;
    
    const updatedUser = {
      ...authState.user,
      schedule,
    };

    setAuthState({
      ...authState,
      user: updatedUser,
    });

    // In a real app, you would save to backend here
    localStorage.setItem('authUser', JSON.stringify(updatedUser));

    toast({
      title: "Schedule updated",
      description: "Your work schedule has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Manage Work Schedule</h3>
      
      <div className="bg-white rounded-lg shadow border p-4">
        <div className="space-y-4">
          {days.map(({ key, label }) => (
            <div key={key} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{label}</div>
                <Switch 
                  checked={schedule[key].enabled} 
                  onCheckedChange={(checked) => handleDayToggle(key, checked)} 
                />
              </div>
              
              {schedule[key].enabled && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-start`}>Start Time</Label>
                    <input
                      id={`${key}-start`}
                      type="time"
                      value={schedule[key].startTime}
                      onChange={(e) => handleTimeChange(key, 'startTime', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-end`}>End Time</Label>
                    <input
                      id={`${key}-end`}
                      type="time"
                      value={schedule[key].endTime}
                      onChange={(e) => handleTimeChange(key, 'endTime', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <button 
            onClick={handleSaveSchedule}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;
