
import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, UserCheck, Calendar, BarChart2, Settings, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { clearAuthFromStorage } from '../utils/auth';
import { AuthState } from '../utils/types';

interface LayoutProps {
  children: ReactNode;
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const Layout = ({ children, authState, setAuthState }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Public routes that don't require layout
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Handle logout
  const handleLogout = () => {
    clearAuthFromStorage();
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
    navigate('/login');
  };

  // Handle route protection
  useEffect(() => {
    if (!isPublicRoute && !authState.isAuthenticated) {
      navigate('/login');
    }
  }, [location, authState.isAuthenticated, navigate, isPublicRoute]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Check if current path matches route
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    if (path === '/users' && location.pathname === '/users') {
      return true;
    }
    // For other routes, check if the path is in the location pathname
    return path !== '/dashboard' && path !== '/users' && location.pathname.includes(path.substring(1));
  };

  const menuItems = [
    { name: 'Dashboard', icon: BarChart2, path: '/dashboard' },
    { name: 'Attendance', icon: UserCheck, path: '/attendance' },
    { name: 'Users', icon: User, path: '/users', adminOnly: true },
    { name: 'Schedule', icon: Calendar, path: '/schedule' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top navigation */}
      <header className="w-full glass-morphism backdrop-blur-md sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className="flex items-center justify-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-foreground">
                <UserCheck size={20} />
              </div>
              <span className="font-semibold text-xl ml-2">AttendAI</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-accent overflow-hidden">
                <img 
                  src={authState.user?.profileImage || "/placeholder.svg"} 
                  alt="Profile" 
                  className="object-cover h-full w-full"
                />
              </div>
              <span className="font-medium">{authState.user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:bg-accent flex items-center gap-1"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 h-[calc(100vh-4rem)] sticky top-16 glass-morphism p-4 border-r animate-fade-in">
          <nav className="space-y-2 mt-6">
            {menuItems.map((item) => {
              // Skip admin-only menu items for non-admin users
              if (item.adminOnly && authState.user?.role !== 'admin') return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <item.icon size={18} className="mr-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="absolute bottom-8 px-4 w-full left-0">
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 w-full rounded-lg text-muted-foreground hover:bg-accent transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-background animate-fade-in">
            <div className="pt-20 p-4">
              <div className="flex items-center space-x-2 p-4 mb-6">
                <div className="h-10 w-10 rounded-full bg-accent overflow-hidden">
                  <img 
                    src={authState.user?.profileImage || "/placeholder.svg"} 
                    alt="Profile" 
                    className="object-cover h-full w-full"
                  />
                </div>
                <div>
                  <p className="font-medium">{authState.user?.name}</p>
                  <p className="text-sm text-muted-foreground">{authState.user?.role}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  // Skip admin-only menu items for non-admin users
                  if (item.adminOnly && authState.user?.role !== 'admin') return null;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon size={20} className="mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-accent"
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
