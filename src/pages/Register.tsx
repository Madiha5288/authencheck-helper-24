
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { AuthState, User } from '../utils/types';
import { motion } from 'framer-motion';
import { UserCheck, Camera, Fingerprint } from 'lucide-react';
import VerificationModal from '../components/VerificationModal';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { registeredUsers } from '../utils/auth';

interface RegisterProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const Register = ({ authState, setAuthState }: RegisterProps) => {
  const navigate = useNavigate();
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);
  const [showVerification, setShowVerification] = useState<'face' | 'fingerprint' | null>(null);
  const [biometricChoice, setBiometricChoice] = useState<'face' | 'fingerprint'>('face');
  const [biometricState, setBiometricState] = useState({
    faceRegistered: false,
    fingerprintRegistered: false
  });
  const [verificationAttempts, setVerificationAttempts] = useState({
    face: 0,
    fingerprint: 0
  });

  const handleRegisterSuccess = (userData: User) => {
    setRegisteredUser(userData);
    // Show chosen biometric verification
    setShowVerification(biometricChoice);
    toast.success('Account created! Please set up your chosen biometric to continue');
  };

  const handleBiometricVerificationSuccess = () => {
    setShowVerification(null);
    
    if (biometricChoice === 'face') {
      setBiometricState(prev => ({ ...prev, faceRegistered: true }));
    } else {
      setBiometricState(prev => ({ ...prev, fingerprintRegistered: true }));
    }
    
    // Complete registration after the chosen biometric is registered
    if (registeredUser) {
      const updatedUser = {
        ...registeredUser,
        hasFaceRegistered: biometricChoice === 'face',
        hasFingerprint: biometricChoice === 'fingerprint'
      };
      
      // Add user to registered users list
      registeredUsers.push(updatedUser);
      
      setAuthState({
        isAuthenticated: true,
        user: updatedUser,
        loading: false,
        error: null
      });
      
      toast.success('Registration complete! You are now logged in');
      navigate('/dashboard');
    }
  };

  const handleVerificationCancel = () => {
    setShowVerification(null);
    
    // If they've canceled, increment attempt counter
    if (biometricChoice === 'face' && !biometricState.faceRegistered) {
      toast.error('Face ID registration is required to continue');
      setVerificationAttempts(prev => ({
        ...prev,
        face: prev.face + 1
      }));
      
      if (verificationAttempts.face >= 2) {
        toast('Try moving to a well-lit area and ensure your face is clearly visible', {
          duration: 5000,
        });
      }
      
      setTimeout(() => setShowVerification('face'), 1000);
    } else if (biometricChoice === 'fingerprint' && !biometricState.fingerprintRegistered) {
      toast.error('Fingerprint registration is required to continue');
      setVerificationAttempts(prev => ({
        ...prev,
        fingerprint: prev.fingerprint + 1
      }));
      
      if (verificationAttempts.fingerprint >= 2) {
        toast('Make sure your fingerprint sensor is clean and try again', {
          duration: 5000,
        });
      }
      
      setTimeout(() => setShowVerification('fingerprint'), 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div 
                className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <UserCheck size={24} />
              </motion.div>
              <motion.h1 
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                Create an Account
              </motion.h1>
              <motion.p 
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Join the next generation of attendance management
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <AuthForm type="register" onSuccess={handleRegisterSuccess} />
              
              {/* Biometric choice */}
              <div className="mt-6 space-y-3">
                <p className="text-sm font-medium">Choose your biometric verification method:</p>
                
                <RadioGroup 
                  value={biometricChoice} 
                  onValueChange={(value) => setBiometricChoice(value as 'face' | 'fingerprint')}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="face" id="face" />
                    <label htmlFor="face" className="flex items-center cursor-pointer">
                      <Camera size={16} className="mr-1 text-primary" />
                      <span>Face ID</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fingerprint" id="fingerprint" />
                    <label htmlFor="fingerprint" className="flex items-center cursor-pointer">
                      <Fingerprint size={16} className="mr-1 text-primary" />
                      <span>Fingerprint</span>
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </motion.div>

            <motion.div 
              className="mt-6 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </motion.div>
          </div>

          <motion.div 
            className="px-8 py-4 bg-muted/30 border-t text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <p className="text-sm text-muted-foreground mb-2">You'll need to set up:</p>
            <div className="flex items-center justify-center space-x-6">
              {biometricChoice === 'face' ? (
                <div className="flex items-center">
                  <Camera size={16} className={`mr-2 ${biometricState.faceRegistered ? 'text-green-500' : 'text-primary'}`} />
                  <span className="text-xs">Face ID {biometricState.faceRegistered && '✓'}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Fingerprint size={16} className={`mr-2 ${biometricState.fingerprintRegistered ? 'text-green-500' : 'text-primary'}`} />
                  <span className="text-xs">Fingerprint {biometricState.fingerprintRegistered && '✓'}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Biometric verification modal */}
      {showVerification && registeredUser && (
        <VerificationModal 
          user={registeredUser}
          type={showVerification}
          isRegister={true}
          required={true}
          onSuccess={handleBiometricVerificationSuccess}
          onCancel={handleVerificationCancel}
        />
      )}
    </div>
  );
};

export default Register;
