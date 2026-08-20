import React, { createContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginAdmin, logout, verifyAdminAuth } from '../store/slices/authSlice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(verifyAdminAuth());
    }
  }, [dispatch, token]);

  const handleLogin = async (username, password, security_pin) => {
    const resultAction = await dispatch(loginAdmin({ username, password, security_pin }));
    if (loginAdmin.fulfilled.match(resultAction)) {
      return { success: true };
    } else {
      return {
        success: false,
        message: resultAction.payload || 'Invalid credentials or security PIN',
      };
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        isAuthenticated: !!token && isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
