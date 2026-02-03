import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';

export default function AuthPage() {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(location.pathname === '/login');

  useEffect(() => {
    // Update form based on current URL
    setShowLogin(location.pathname === '/login');
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {showLogin ? (
          <Login onSignupClick={() => setShowLogin(false)} />
        ) : (
          <Signup onLoginClick={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
}
