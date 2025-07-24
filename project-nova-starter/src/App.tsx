import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AppLayout from './components/layout/AppLayout';
import { useAuthStore } from './stores/auth.store';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// This component replaces the old ProtectedRoute
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuthStore();
  
  // This check is important to prevent a flash of the login page
  // while the store is rehydrating from localStorage.
  const [isHydrated, setIsHydrated] = useState(false);

  // THE FIX IS HERE: This useEffect is now using the correct, type-safe async/await syntax.
  useEffect(() => {
    const rehydrate = async () => {
      await useAuthStore.persist.rehydrate();
      setIsHydrated(true);
    };
    rehydrate();
  }, []);

  if (!isHydrated) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function App() {
    return (
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  {/* Pass the actual routes as children to the layout */}
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      );
}

export default App;