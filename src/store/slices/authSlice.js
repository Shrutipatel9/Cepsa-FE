import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Initial Auth State
const initialState = {
  token: localStorage.getItem('cepsa_token') || null,
  user: localStorage.getItem('cepsa_user') || null,
  isAuthenticated: !!localStorage.getItem('cepsa_token'),
  loading: false,
  error: null,
};

// Async Thunk for Admin Login
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ username, password, security_pin }, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/login', { username, password, security_pin });
      const { access_token, username: uName } = response.data;
      
      // Store in localStorage as backup session persistence
      localStorage.setItem('cepsa_token', access_token);
      localStorage.setItem('cepsa_user', uName);

      return { token: access_token, user: uName };
    } catch (error) {
      const message = error.response?.data?.detail || 'Invalid credentials or security PIN';
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for Token Verification
export const verifyAdminAuth = createAsyncThunk(
  'auth/verifyAdminAuth',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token || localStorage.getItem('cepsa_token');
    if (!token) return rejectWithValue('No token found');

    try {
      const response = await api.get('/admin/verify-token');
      return response.data;
    } catch (error) {
      return rejectWithValue('Token verification failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.error = null;
      if (token) localStorage.setItem('cepsa_token', token);
      if (user) localStorage.setItem('cepsa_user', user);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('cepsa_token');
      localStorage.removeItem('cepsa_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginAdmin handlers
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
      })
      // verifyAdminAuth handlers
      .addCase(verifyAdminAuth.fulfilled, (state, action) => {
        state.user = action.payload.username || state.user;
        state.isAuthenticated = true;
      })
      .addCase(verifyAdminAuth.rejected, (state) => {
        // If verify fails explicitly from backend
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('cepsa_token');
        localStorage.removeItem('cepsa_user');
      });
  },
});

export const { setCredentials, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
