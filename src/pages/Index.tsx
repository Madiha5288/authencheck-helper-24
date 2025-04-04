
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCheck, ShieldCheck } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header with navigation */}
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-foreground">
              <UserCheck size={20} />
            </div>
            <span className="font-semibold text-xl">AttendAI</span>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-md text-muted-foreground hover:bg-accent transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            AI-Powered Attendance System for the Modern Workplace
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Seamlessly track attendance with cutting-edge facial recognition technology.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features section */}
      <section className="container mx-auto py-20 px-4">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-12"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Advanced Security Features
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 border card-hover"
            variants={fadeIn}
          >
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <UserCheck size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Facial Recognition</h3>
            <p className="text-muted-foreground">
              Advanced facial recognition algorithms ensure accurate identification in various lighting conditions.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 border card-hover"
            variants={fadeIn}
          >
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <ShieldCheck size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Authentication</h3>
            <p className="text-muted-foreground">
              Multi-factor authentication options and encrypted data storage to protect sensitive information.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Call-to-action section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-6"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Ready to Modernize Your Attendance System?
          </motion.h2>
          <motion.p 
            className="text-lg mb-8 opacity-90 max-w-2xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Join thousands of organizations that have streamlined their attendance process with our AI-powered solution.
          </motion.p>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <button 
              onClick={() => navigate('/register')}
              className="px-6 py-3 rounded-md bg-white text-primary hover:bg-opacity-90 transition-colors"
            >
              Sign Up Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-primary-foreground">
                <UserCheck size={16} />
              </div>
              <span className="font-semibold">AttendAI</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AttendAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
