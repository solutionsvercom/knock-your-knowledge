import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '@/api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: "local", public_settings: {} }); // kept for compatibility

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setAuthError(null);
      setIsLoadingPublicSettings(false);
      await checkUserAuth();
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    let hadToken = false;
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      try {
        hadToken = !!localStorage.getItem('token');
      } catch {
        hadToken = false;
      }
      // No JWT → skip /api/auth/me (avoids noisy 401 in Network + console when signed out)
      if (!hadToken) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        return;
      }

      const currentUser = await api.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } catch (error) {
      const status = error?.status;
      const isUnauthorized = status === 401 || status === 403;
      // Expected when session expired or token invalid — not a real "error" to log
      if (!isUnauthorized) {
        console.error('User auth check failed:', error);
      }

      setUser(null);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);

      if (isUnauthorized) {
        api.auth.clearSession();
        // Only surface auth hint if they *had* a token (expired / invalid), not plain "signed out"
        if (hadToken) {
          setAuthError({
            type: 'auth_required',
            message: error?.message || 'Session expired. Please sign in again.',
          });
        } else {
          setAuthError(null);
        }
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (shouldRedirect) {
      // Use the SDK's logout method which handles token cleanup and redirect
      api.auth.logout(window.location.href);
    } else {
      // Just remove the token without redirect
      api.auth.logout();
    }
  };

  const navigateToLogin = () => {
    // Use the SDK's redirectToLogin method
    api.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
