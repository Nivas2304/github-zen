import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { User } from '@/data/mockData';
import apiService from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginStep: 'idle' | 'redirecting' | 'processing' | 'complete';
  login: () => Promise<void>;
  logout: (queryClient?: QueryClient) => void;
  syncUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<'idle' | 'redirecting' | 'processing' | 'complete'>('idle');
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  // Check if user is already authenticated on mount (DISABLED for fresh auth)
  useEffect(() => {
    const checkAuth = async () => {
      // Only auto-authenticate if explicitly requested (not on fresh page load)
      const shouldAutoAuth = localStorage.getItem('auto_auth_enabled');
      const token = localStorage.getItem('access_token');
      
      if (shouldAutoAuth === 'true' && token) {
        setIsLoading(true);
        try {
          const response = await apiService.getCurrentUser();
          if (response.data) {
            setUser(response.data);
          } else {
            apiService.clearToken();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          apiService.clearToken();
        } finally {
          setIsLoading(false);
        }
      } else {
        // Clear any existing tokens for fresh authentication
        apiService.clearToken();
        localStorage.removeItem('access_token');
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    setIsLoading(true);
    setLoginStep('redirecting');
    try {
      // Clear any existing authentication data
      apiService.clearToken();
      localStorage.removeItem('access_token');
      localStorage.removeItem('auto_auth_enabled');
      
      // Generate a random state parameter for CSRF protection
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Store state in sessionStorage for verification
      sessionStorage.setItem('oauth_state', state);
      
      // Get GitHub OAuth URL with state parameter
      const response = await apiService.getGitHubAuthUrl(state);
      if (response.data?.authorization_url) {
        // Small delay to show redirecting state
        setTimeout(() => {
          window.location.href = response.data.authorization_url;
        }, 500);
      } else {
        throw new Error('Failed to get GitHub OAuth URL');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      setLoginStep('idle');
    }
  };

  const logout = (queryClient?: QueryClient) => {
    setUser(null);
    setLoginStep('idle');
    setIsProcessingCallback(false);
    apiService.clearToken();
    
    // Clear React Query cache if provided
    if (queryClient) {
      queryClient.clear();
      queryClient.removeQueries();
      queryClient.invalidateQueries();
    }
    
    // Clear all localStorage items
    localStorage.removeItem('access_token');
    localStorage.removeItem('github_token');
    localStorage.removeItem('auto_auth_enabled');
    localStorage.clear();
    
    // Clear sessionStorage as well
    sessionStorage.clear();
    
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Clear any cookies (if any)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Clear browser cache and force fresh page load
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    
    // Clear GitHub session if possible
    try {
      // Open a hidden iframe to clear GitHub session
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'https://github.com/logout';
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    } catch (error) {
      console.log('GitHub logout iframe failed:', error);
    }
    
    // Force a hard reload to clear all cached state
    window.location.href = window.location.origin;
  };

  const syncUserData = async () => {
    try {
      await apiService.syncUserData();
      // Refresh user data after sync
      const response = await apiService.getCurrentUser();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');

    if (error) {
      console.error('OAuth error:', error);
      setIsLoading(false);
      // Clear URL parameters immediately
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code && !user && !isLoading && !isProcessingCallback) {
      // Verify state parameter for CSRF protection
      const storedState = sessionStorage.getItem('oauth_state');
      if (state !== storedState) {
        console.error('OAuth state mismatch - possible CSRF attack');
        setIsLoading(false);
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      // Clear the code from URL immediately to prevent re-processing
      window.history.replaceState({}, document.title, window.location.pathname);
      // Clear the state from sessionStorage
      sessionStorage.removeItem('oauth_state');
      handleOAuthCallback(code);
    }
  }, [user, isLoading, isProcessingCallback]);

  const handleOAuthCallback = async (code: string) => {
    setIsLoading(true);
    setIsProcessingCallback(true);
    setLoginStep('processing');
    
    try {
      // Small delay to show processing screen
      await new Promise(resolve => setTimeout(resolve, 1000));
      
              const response = await apiService.githubAuth(code);
              if (response.data) {
                // Enable auto-auth for future sessions
                localStorage.setItem('auto_auth_enabled', 'true');
                
                // Get user data after successful auth
                const userResponse = await apiService.getCurrentUser();
                if (userResponse.data) {
                  setUser(userResponse.data);
                  setLoginStep('complete');
                  
                  // Small delay before redirect to show completion
                  await new Promise(resolve => setTimeout(resolve, 500));
                  
                  // Redirect to dashboard
                  window.location.href = '/dashboard';
                }
              } else {
                throw new Error('Authentication failed');
              }
    } catch (error) {
      console.error('OAuth callback failed:', error);
      setLoginStep('idle');
    } finally {
      setIsLoading(false);
      setIsProcessingCallback(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginStep,
    login,
    logout,
    syncUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};