import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { 
  getStoredToken, 
  clearStoredToken, 
  getSessionToken, 
  clearSessionToken,
  getStoredUser,
  getSessionUser,
  storeUser,
  storeSessionUser,
  clearUser,
  clearSessionUser
} from '../utils/authToken.js';
import { useLogoutMutation, useMeQuery } from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 min for non-admin
  const ADMIN_INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour for admin
  const EXEMPT_ROLES = ['admin']; // Don't force auto-logout for admins
  const [token, setToken] = useState(() => getStoredToken() || getSessionToken());
  const [user, setUser] = useState(() => getSessionUser() || getStoredUser() || null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const timerRef = useRef();
  const [logout] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      // ignore logout errors
    } finally {
      clearStoredToken();
      clearSessionToken();
      clearUser();
      clearSessionUser();
      setUser(null);
      setToken(null);
    }
  }, [logout]);

  const { data: meData, refetch: refetchMe, error: meError, isFetching } = useMeQuery(undefined, { skip: !token });

  const updateStoredUser = useCallback((newUser) => {
    setUser(newUser);
    if (newUser) {
      storeUser(newUser);
    } else {
      clearUser();
    }
  }, []);

  const updateSessionUser = useCallback((newUser) => {
    setUser(newUser);
    if (newUser) {
      storeSessionUser(newUser);
    } else {
      clearSessionUser();
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'placfy_user' && !getSessionToken()) {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        updateStoredUser(newUser);
      }
      if (e.key === 'placfy_auth_token' || e.key === 'placfy_session_auth_token') {
        setToken(getStoredToken() || getSessionToken());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateStoredUser, setToken]);



  useEffect(() => {
    if (meData?.user) {
      const sessionToken = getSessionToken();
      if (sessionToken) {
        updateSessionUser(meData.user);
      } else {
        updateStoredUser(meData.user);
      }
      setIsAuthResolved(true);
    } else if (meError) {
      // If me query fails, logout to clear invalid state
      handleLogout();
      setIsAuthResolved(true);
    }
  }, [meData, meError, updateStoredUser, updateSessionUser, handleLogout]);


  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerRef.current);
      if (!user) return;
      const timeout = user?.roles?.some((role) => EXEMPT_ROLES.includes(role)) 
        ? ADMIN_INACTIVITY_TIMEOUT 
        : INACTIVITY_TIMEOUT;
      timerRef.current = setTimeout(() => {
        handleLogout();
      }, timeout);
    };
    function registerActivityListeners() {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('touchstart', resetTimer);
    }
    function unregisterActivityListeners() {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    }
    unregisterActivityListeners();
    if (user && user.roles && !user.roles.some((role) => EXEMPT_ROLES.includes(role))) {
      resetTimer();
      registerActivityListeners();
    } else {
      clearTimeout(timerRef.current);
    }
    return () => {
      unregisterActivityListeners();
      clearTimeout(timerRef.current);
    };
  }, [user, handleLogout]);

  // HANDLE_LOGOUT_PLACEHOLDER

  const isAuthenticated = Boolean(user);
  const isAuthLoading = !isAuthResolved && (token ? isFetching : !user);

  return (
    <AuthContext.Provider value={{ user, updateStoredUser, updateSessionUser, isAuthenticated, isAuthLoading, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

