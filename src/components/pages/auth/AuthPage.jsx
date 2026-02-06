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
    <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full max-w-md border border-slate-100 animate-in fade-in zoom-in duration-300">
        {showLogin ? (
          <Login onSignupClick={() => setShowLogin(false)} />
        ) : (
          <Signup onLoginClick={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
}