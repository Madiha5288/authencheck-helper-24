
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, User } from '../utils/types';
import { authenticateUser, saveAuthToStorage, canUserLogIn } from '../utils/auth';
import { Eye, EyeOff, UserCheck, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';

interface AuthFormProps {
  type: 'login' | 'register';
  onSuccess: (userData: any) => void;
}

const AuthForm = ({ type, onSuccess }: AuthFormProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'IT',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = await authenticateUser(formData);
      
      // Check if user has registered both biometrics
      if (!canUserLogIn(userData)) {
        toast.error('You must register both Face ID and Fingerprint to log in');
        setIsLoading(false);
        return;
      }
      
      saveAuthToStorage(userData);
      onSuccess(userData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Password validation
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Simulate registration - create a mock user
    setTimeout(() => {
      // Create a new user
      const newUser: User = {
        id: `user-${Date.now()}`, // Generate a unique ID
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: 'user', // Default role
        department: registerData.department,
        position: 'Employee', // Default position
        registeredOn: new Date(),
        lastLogin: new Date(),
        profileImage: '/placeholder.svg',
        hasFaceRegistered: false, // Will be registered in the next step
        hasFingerprint: false, // Will be registered in the next step
      };
      
      onSuccess(newUser);
      setIsLoading(false);
    }, 1000);
  };

  if (type === 'login') {
    return (
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleLoginChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="example@company.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleLoginChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        {/* Login notice about biometrics */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <div className="flex items-center space-x-2 mb-2">
            <UserCheck size={16} className="text-primary" />
            <span className="font-medium">Face ID verification required</span>
          </div>
          <div className="flex items-center space-x-2">
            <Fingerprint size={16} className="text-primary" />
            <span className="font-medium">Fingerprint verification required</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white bg-primary hover:bg-primary/90 transition-colors ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleRegisterSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={registerData.name}
          onChange={handleRegisterChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="John Doe"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={registerData.email}
          onChange={handleRegisterChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="example@company.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="department" className="block text-sm font-medium">
          Department
        </label>
        <select
          id="department"
          name="department"
          required
          value={registerData.department}
          onChange={handleRegisterChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Operations">Operations</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={registerData.password}
            onChange={handleRegisterChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          required
          value={registerData.confirmPassword}
          onChange={handleRegisterChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="••••••••"
        />
      </div>
      
      {/* Biometric notice */}
      <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
        <p className="mb-2 font-medium">After registration, you'll need to set up:</p>
        <div className="flex items-center space-x-2 mb-1">
          <UserCheck size={16} className="text-primary" />
          <span>Face ID for verification</span>
        </div>
        <div className="flex items-center space-x-2">
          <Fingerprint size={16} className="text-primary" />
          <span>Fingerprint for verification</span>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md text-white bg-primary hover:bg-primary/90 transition-colors ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Registering...' : 'Register & Set Up Biometrics'}
      </button>
    </form>
  );
};

export default AuthForm;
