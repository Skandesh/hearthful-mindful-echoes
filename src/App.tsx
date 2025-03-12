import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useEffect, useState, useContext } from "react";
import { Toaster } from "sonner";
import { supabase } from "./integrations/supabase/client";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Navigation from "./components/Navigation";
import Chat from "./components/Chat";

export const AuthContext = createContext<{
  user: any;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

// Protected route component that redirects to /auth if not logged in
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_, session) => {
          setUser(session?.user || null);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
    
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <Router>
        <div className="min-h-screen">
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/app" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/auth" element={
              user ? <Navigate to="/app" /> : <Auth />
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster richColors />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
