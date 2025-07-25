import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth.store';
import WelcomePage from './pages/WelcomePage'; // The new public landing/login/register page
import HomePage from './pages/HomePage'; // The main app feed
import AppLayout from './components/layout/AppLayout';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
// Import all your other pages here as you build them
// import MyNetworkPage from './pages/MyNetworkPage';

// ProtectedRoute now guards the entire authenticated app space
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const rehydrate = async () => {
      await useAuthStore.persist.rehydrate();
      setIsHydrated(true);
    };
    rehydrate();
  }, []);

  if (!isHydrated) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  if (!user) {
    return <Navigate to="/" replace />; // If not logged in, send to the public Welcome Page
  }
  return children;
}

function App() {
    return (
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<WelcomePage showLogin={true} />} />
            <Route path="/register" element={<WelcomePage showLogin={false} />} />

            {/* Protected Application Routes */}
            <Route
              path="/app/*" // All app routes now live under /app
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      {/* <Route path="/network" element={<MyNetworkPage />} /> */}
                      {/* Add other app routes here */}
                      <Route path="*" element={<Navigate to="/app" replace />} />
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
