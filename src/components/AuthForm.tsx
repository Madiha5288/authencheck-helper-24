
import { User } from '../utils/types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthFormProps {
  type: 'login' | 'register';
  onSuccess: (userData: User) => void;
}

const AuthForm = ({ type, onSuccess }: AuthFormProps) => {
  return type === 'login' ? (
    <LoginForm onSuccess={onSuccess} />
  ) : (
    <RegisterForm onSuccess={onSuccess} />
  );
};

export default AuthForm;
