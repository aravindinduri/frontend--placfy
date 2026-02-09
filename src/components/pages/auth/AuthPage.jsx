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
    <div className="">
        {showLogin ? (
          <Login onSignupClick={() => setShowLogin(false)} />
        ) : (
          <Signup onLoginClick={() => setShowLogin(true)} />
        )}
    </div>
  );
}