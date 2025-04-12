
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthState, User } from '../utils/types';
import ScheduleManager from './ScheduleManager';

interface SettingsProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const Settings = ({ authState, setAuthState }: SettingsProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricAuthEnabled, setBiometricAuthEnabled] = useState(true);
  const [name, setName] = useState(authState.user?.name || '');
  const [email, setEmail] = useState(authState.user?.email || '');
  const [department, setDepartment] = useState(authState.user?.department || '');
  const [position, setPosition] = useState(authState.user?.position || '');
  const [bio, setBio] = useState('');

  const handleSaveProfile = () => {
    if (!authState.user) return;
    
    // Update the user in the state
    const updatedUser: User = {
      ...authState.user,
      name,
      email,
      department,
      position,
    };

    setAuthState({
      ...authState,
      user: updatedUser,
    });

    // Update localStorage
    localStorage.setItem('authUser', JSON.stringify(updatedUser));

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleToggleSetting = (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotificationsEnabled(value);
        toast({
          title: `Notifications ${value ? 'enabled' : 'disabled'}`,
          description: `You have ${value ? 'enabled' : 'disabled'} notifications.`,
        });
        break;
      case 'darkMode':
        setDarkModeEnabled(value);
        toast({
          title: `Dark mode ${value ? 'enabled' : 'disabled'}`,
          description: `You have ${value ? 'enabled' : 'disabled'} dark mode.`,
        });
        break;
      case 'biometricAuth':
        setBiometricAuthEnabled(value);
        toast({
          title: `Biometric authentication ${value ? 'enabled' : 'disabled'}`,
          description: `You have ${value ? 'enabled' : 'disabled'} biometric authentication.`,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-accent overflow-hidden">
                  <img
                    src={authState.user?.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <button className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Software Developer"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a little bit about yourself..."
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </TabsContent>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          {authState.user && (
            <ScheduleManager
              user={authState.user}
              authState={authState}
              setAuthState={setAuthState}
            />
          )}
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about attendance status and reminders.
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={(checked) => handleToggleSetting('notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes.
                </p>
              </div>
              <Switch
                id="darkMode"
                checked={darkModeEnabled}
                onCheckedChange={(checked) => handleToggleSetting('darkMode', checked)}
              />
            </div>
          </div>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="biometricAuth">Biometric Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Use Face ID or Fingerprint for faster login.
                </p>
              </div>
              <Switch
                id="biometricAuth"
                checked={biometricAuthEnabled}
                onCheckedChange={(checked) => handleToggleSetting('biometricAuth', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Change Password</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
