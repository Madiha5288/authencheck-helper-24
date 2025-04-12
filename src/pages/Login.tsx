
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { User, AuthState } from '../utils/types';

interface LoginProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const Login = ({ authState, setAuthState }: LoginProps) => {
  const navigate = useNavigate();
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      navigate('/dashboard');
    }
  }, [authState.isAuthenticated, authState.user, navigate]);
  
  const handleLoginSuccess = (userData: User) => {
    setAuthState({
      isAuthenticated: true,
      user: userData,
      loading: false,
      error: null,
    });
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-accent">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
              >
                <path d="M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                <path d="M16 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                <rect x="2" y="11" width="4" height="4" rx="1"></rect>
                <path d="M4 11V8a4 4 0 0 1 4-4h1"></path>
                <path d="M4 15v3a4 4 0 0 0 4 4h9a4 4 0 0 0 4-4v-3"></path>
                <path d="M18 11V9a4 4 0 0 0-4-4h-1"></path>
                <path d="M14 5l2 2-2 2"></path>
                <path d="M10 19l-2-2 2-2"></path>
              </svg>
            </div>
            <span className="font-semibold text-2xl ml-2">AttendAI</span>
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Login to Your Account</h1>
          <AuthForm type="login" onSuccess={handleLoginSuccess} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Test credentials:
          </p>
          <p>
            Admin: admin@example.com / admin123
          </p>
          <p>
            User: john@example.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
