import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('cepsa_token') || null);
  const [user, setUser] = useState(localStorage.getItem('cepsa_user') || null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/login', { username, password });
      const { access_token, username: uName } = response.data;
      
      setToken(access_token);
      setUser(uName);
      localStorage.setItem('cepsa_token', access_token);
      localStorage.setItem('cepsa_user', uName);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Invalid username or password' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cepsa_token');
    localStorage.removeItem('cepsa_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
