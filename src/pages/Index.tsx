
import { useNavigate } from 'react-router-dom';
import { Check, Shield, Clock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Hero section */}
      <header className="w-full bg-white pt-6 pb-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-foreground">
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
                  className="h-6 w-6"
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
              <span className="font-semibold text-xl">AttendAI</span>
            </div>
            <div className="space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-md border hover:bg-accent transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Register
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Secure Attendance Tracking with Facial Recognition
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                AttendAI makes workplace attendance tracking secure, reliable and easy using advanced facial recognition technology.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </button>
                <button className="px-6 py-3 rounded-md border hover:bg-accent transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Facial recognition illustration" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Features section */}
      <section className="w-full py-20 px-4 bg-accent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AttendAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
              <p className="text-muted-foreground">
                State-of-the-art facial recognition ensures only authorized individuals can check in, eliminating buddy punching.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Time Efficiency</h3>
              <p className="text-muted-foreground">
                Quick check-in and check-out process saves time and increases productivity in the workplace.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accurate Reporting</h3>
              <p className="text-muted-foreground">
                Comprehensive attendance reports and analytics help managers make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="w-full py-16 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to modernize your attendance system?</h2>
          <p className="text-primary-foreground/90 mb-8">
            Join thousands of companies that trust AttendAI for secure and reliable attendance tracking.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-white text-primary rounded-md hover:bg-white/90 transition-colors"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-12 px-4 bg-white border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-primary-foreground">
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
                  className="h-5 w-5"
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
              <span className="font-semibold">AttendAI</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AttendAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
