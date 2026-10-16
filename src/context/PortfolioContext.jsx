import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultData from '../data/portfolioData.json';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(defaultData);
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('kk_owner_token') || localStorage.getItem('kk_owner_token') || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentView, setCurrentView] = useState(() => {
    // Check if URL hash is #/admin
    return window.location.hash === '#/admin' || window.location.pathname === '/admin' ? 'admin' : 'public';
  });

  // Fetch portfolio data from server (or fallback to bundled JSON)
  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const json = await res.json();
        if (json && json.personalInfo) {
          setData(json);
          return;
        }
      }
    } catch (err) {
      console.info('Backend API unavailable, using bundled portfolio JSON data.');
    }
  };

  // Verify stored token on boot
  useEffect(() => {
    fetchPortfolio();

    const checkAuth = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setToken(null);
          sessionStorage.removeItem('kk_owner_token');
          localStorage.removeItem('kk_owner_token');
        }
      } catch (e) {
        // Server offline or proxy unreachable: never grant unverified access to owner portal
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  // Handle hash changes for #/admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#/admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('public');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Login handler
  const login = async (username, password, remember = false) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Authentication failed.');
      }

      setToken(result.token);
      setIsAuthenticated(true);
      if (remember) {
        localStorage.setItem('kk_owner_token', result.token);
      } else {
        sessionStorage.setItem('kk_owner_token', result.token);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('kk_owner_token');
    localStorage.removeItem('kk_owner_token');
    setCurrentView('public');
    window.location.hash = '';
  };

  // Save portfolio data to server
  const savePortfolio = async (updatedData) => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save portfolio data.');
      }
      setData(updatedData);
      return { success: true, savedAt: result.savedAt };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Upload file to server disk
  const uploadFile = async (file, uploadType = 'doc') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadType', uploadType);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'File upload failed.');
      }
      return { success: true, fileUrl: result.fileUrl, fileName: result.fileName };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        setData,
        isAuthenticated,
        authLoading,
        currentView,
        setCurrentView,
        login,
        logout,
        savePortfolio,
        uploadFile,
        refreshPortfolio: fetchPortfolio
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
