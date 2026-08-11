import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import { useToast } from '../context/ToastContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/admin/dashboard');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      showSuccess('Logged in to Admin Portal!');
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
      showError(result.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col justify-center items-center px-4 relative">

      <Link to="/" className="absolute top-6 left-6 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors">
        <ArrowLeft className="w-4 h-4 text-[#B17F59]" /> Return to CEPSA Website
      </Link>

      <div className="w-full max-w-md bg-white border border-[#E5D7CD] rounded-3xl p-8 shadow-xl space-y-6">

        <div className="text-center space-y-3">
          <Link to="/" className="inline-block mb-1">
            <Logo className="h-12 mx-auto" />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-slate-900">Owner Admin Portal</h1>
          <p className="text-xs text-slate-500 font-medium">Private management access for authorized CEPSA administrators.</p>
        </div>

        {error && (
          <div className="p-3.5 text-xs bg-red-50 border border-red-200 text-red-700 rounded-md font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 bg-[#F8F5F0] border border-[#E5D7CD] rounded-md text-slate-900 focus:outline-none focus:border-[#B17F59] focus:bg-white"
                placeholder="Enter admin username"
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
                className="w-full px-4 py-2.5 pl-10 bg-[#F8F5F0] border border-[#E5D7CD] rounded-md text-slate-900 focus:outline-none focus:border-[#B17F59] focus:bg-white"
                placeholder="Enter password"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="p-3 bg-[#F0E8E1] border border-[#E5D7CD] rounded-md text-[11px] text-[#B17F59] font-semibold">
            Default Credentials: <strong className="text-slate-900">admin</strong> / <strong className="text-slate-900">admin123</strong>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#B17F59] hover:bg-[#986743] disabled:opacity-50 text-white font-bold rounded-md text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Authenticating...' : 'Sign In to Owner Portal'}
          </button>
        </form>

      </div>
    </div>
  );
}
