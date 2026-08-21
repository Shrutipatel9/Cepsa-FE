import React, { createContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginAdmin, logout, verifyAdminAuth } from '../store/slices/authSlice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated, authChecked, loading, error } = useSelector((state) => state.auth);
  const verifiedOnce = useRef(false);

  useEffect(() => {
    if (!token) return;
    if (verifiedOnce.current) return;
    verifiedOnce.current = true;
    dispatch(verifyAdminAuth());
  }, [dispatch, token]);

  const handleLogin = async (username, password, security_pin) => {
    const resultAction = await dispatch(loginAdmin({ username, password, security_pin }));
    if (loginAdmin.fulfilled.match(resultAction)) {
      return { success: true };
    }
    return {
      success: false,
      message: resultAction.payload || 'Invalid credentials or security PIN',
    };
  };

  const handleLogout = () => {
    verifiedOnce.current = false;
    dispatch(logout());
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        authChecked,
        isAuthenticated: !!token && isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
