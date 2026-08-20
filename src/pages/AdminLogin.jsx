import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, User, KeyRound, ArrowLeft, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import { useToast } from '../context/ToastContext';

import api from '../services/api';

export default function AdminLogin() {
  const showDemoCredentials = import.meta.env.VITE_SHOW_DEMO_CREDENTIALS === 'true';

  const [step, setStep] = useState(1); // 1 = Username & Password, 2 = Security PIN
  const [username, setUsername] = useState(showDemoCredentials ? 'cepsaAdminKS' : '');
  const [password, setPassword] = useState(showDemoCredentials ? 'Cepsa@Master#2026!Secure' : '');
  const [securityPin, setSecurityPin] = useState(showDemoCredentials ? '202688' : '');
  const [verifyingStep1, setVerifyingStep1] = useState(false);

  const { login, loading, isAuthenticated } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/admin/dashboard');
  }

  // STEP 1 HANDLER: Click "Sign In"
  const handleStep1Submit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showError('Please enter username and password.');
      return;
    }

    setVerifyingStep1(true);
    try {
      // Validate Level 1 Username and Password with backend API
      await api.post('/admin/verify-credentials', { username, password });
      // ONLY transition to Step 2 if credentials are valid!
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid username or password.';
      showError(msg);
    } finally {
      setVerifyingStep1(false);
    }
  };

  // STEP 2 HANDLER: Click "Verify"
  const handleStep2Submit = async (e) => {
    e.preventDefault();

    if (!securityPin || securityPin.trim().length < 4) {
      showError('Please enter your 6-digit Security PIN.');
      return;
    }

    const result = await login(username, password, securityPin);
    if (result.success) {
      showSuccess('Security Verified! Welcome to Admin Portal.');
      navigate('/admin/dashboard');
    } else {
      showError(result.message || 'Verification failed. Please check your credentials and PIN.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col justify-center items-center px-4 relative py-12">

      <Link to="/" className="absolute top-6 left-6 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors">
        <ArrowLeft className="w-4 h-4 text-[#B17F59]" /> Return to CEPSA Website
      </Link>

      <div className="w-full max-w-md bg-white border border-[#E5D7CD] rounded-3xl p-8 shadow-xl space-y-6">

        {/* HEADLINE (ONLY ADMIN PORTAL, NO TAG, NO OWNER) */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block mb-1">
            <Logo className="h-12 mx-auto" />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-xs text-slate-500 font-medium">
            {step === 1 ? 'Enter your credentials to sign in.' : 'Enter your 6-digit Security PIN to verify.'}
          </p>
        </div>

        {/* STEP 1: USERNAME & PASSWORD FORM */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4 text-xs animate-fadeIn">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 bg-[#F8F5F0] border border-[#E5D7CD] rounded-xl text-slate-900 focus:outline-none focus:border-[#B17F59] focus:bg-white font-medium"
                  placeholder="Enter username"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 bg-[#F8F5F0] border border-[#E5D7CD] rounded-xl text-slate-900 focus:outline-none focus:border-[#B17F59] focus:bg-white font-medium"
                  placeholder="Enter password"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Display Default Demo Credentials in Local Environment Only */}
            {showDemoCredentials && (
              <div className="p-3 bg-[#F0E8E1] border border-[#E5D7CD] rounded-xl text-[11px] text-[#B17F59] font-medium space-y-0.5 animate-fadeIn">
                <div>Username: <strong className="text-slate-900 font-mono">cepsaAdminKS</strong></div>
                <div>Password: <strong className="text-slate-900 font-mono">Cepsa@Master#2026!Secure</strong></div>
              </div>
            )}

            <button
              type="submit"
              disabled={verifyingStep1}
              className="w-full py-3.5 bg-[#B17F59] hover:bg-[#986743] disabled:opacity-50 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover-shine"
            >
              {verifyingStep1 && <Loader2 className="w-4 h-4 animate-spin" />}
              {verifyingStep1 ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* STEP 2: SECURITY PIN FORM */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4 text-xs animate-fadeIn">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Security PIN</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  maxLength={10}
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 bg-[#F8F5F0] border border-[#E5D7CD] rounded-xl text-slate-900 focus:outline-none focus:border-[#B17F59] focus:bg-white font-mono font-bold tracking-widest text-sm"
                  placeholder="Enter 6-digit Security PIN"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Display Default Demo PIN in Local Environment Only */}
            {showDemoCredentials && (
              <div className="p-3 bg-[#F0E8E1] border border-[#E5D7CD] rounded-xl text-[11px] text-[#B17F59] font-medium animate-fadeIn">
                Default Security PIN: <strong className="text-slate-900 font-mono">202688</strong>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#B17F59] hover:bg-[#986743] disabled:opacity-50 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover-shine"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Verifying PIN...' : 'Verify'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
