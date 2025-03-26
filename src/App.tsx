
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthState } from "./utils/types";
import { loadAuthFromStorage, initialAuthState } from "./utils/auth";

// Import pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";

// Import framer-motion for animations
import { motion, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => {
  // Global auth state
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  
  // Load auth state from storage on initial load
  useEffect(() => {
    const storedAuth = loadAuthFromStorage();
    setAuthState(storedAuth);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/login" 
                element={<Login authState={authState} setAuthState={setAuthState} />} 
              />
              <Route 
                path="/register" 
                element={<Register authState={authState} setAuthState={setAuthState} />} 
              />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={<DashboardPage authState={authState} setAuthState={setAuthState} />} 
              />
              <Route 
                path="/attendance" 
                element={<DashboardPage authState={authState} setAuthState={setAuthState} />} 
              />
              <Route 
                path="/users" 
                element={<DashboardPage authState={authState} setAuthState={setAuthState} />} 
              />
              <Route 
                path="/schedule" 
                element={<DashboardPage authState={authState} setAuthState={setAuthState} />} 
              />
              <Route 
                path="/settings" 
                element={<DashboardPage authState={authState} setAuthState={setAuthState} />} 
              />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
