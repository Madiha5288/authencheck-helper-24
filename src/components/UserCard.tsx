
import { User } from '../utils/types';
import { Fingerprint, UserCheck } from 'lucide-react';

interface UserCardProps {
  user: User;
  onRegisterFace: () => void;
  onRegisterFingerprint: () => void;
}

const UserCard = ({ user, onRegisterFace, onRegisterFingerprint }: UserCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow border p-6 animate-fade-in card-hover">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-full bg-accent overflow-hidden">
          <img
            src={user.profileImage || "/placeholder.svg"}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.position}</p>
          <p className="text-sm text-muted-foreground">{user.department}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserCheck size={18} className="text-primary" />
              <span className="text-sm font-medium">Face Recognition</span>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              user.hasFaceRegistered
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {user.hasFaceRegistered ? 'Registered' : 'Not Registered'}
            </span>
          </div>
          
          <button
            onClick={onRegisterFace}
            className={`mt-3 px-3 py-1.5 text-sm w-full rounded-md ${
              user.hasFaceRegistered
                ? 'border hover:bg-accent'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {user.hasFaceRegistered ? 'Update Face ID' : 'Register Face ID'}
          </button>
        </div>
        
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Fingerprint size={18} className="text-primary" />
              <span className="text-sm font-medium">Fingerprint</span>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              user.hasFingerprint
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {user.hasFingerprint ? 'Registered' : 'Not Registered'}
            </span>
          </div>
          
          <button
            onClick={onRegisterFingerprint}
            className={`mt-3 px-3 py-1.5 text-sm w-full rounded-md ${
              user.hasFingerprint
                ? 'border hover:bg-accent'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {user.hasFingerprint ? 'Update Fingerprint' : 'Register Fingerprint'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
