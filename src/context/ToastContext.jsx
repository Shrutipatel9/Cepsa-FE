import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showSuccess = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  const showError = useCallback((msg) => showToast(msg, 'error'), [showToast]);
  const showInfo = useCallback((msg) => showToast(msg, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      {children}

      {/* TOP RIGHT TOAST NOTIFICATIONS CONTAINER */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform animate-slideInRight ${toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/40 text-white'
              : toast.type === 'error'
                ? 'bg-slate-900/95 border-red-500/40 text-white'
                : 'bg-slate-900/95 border-[#B17F59]/40 text-white'
              }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && (
                <div className="w-8 h-8 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-8 h-8 rounded-md bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-8 h-8 rounded-md bg-[#B17F59]/20 border border-[#B17F59]/40 flex items-center justify-center text-[#D8A279] shrink-0">
                  <Info className="w-5 h-5" />
                </div>
              )}

              <div className="space-y-0.5">
                <h4 className="text-xs font-serif font-bold tracking-wide uppercase text-slate-300">
                  {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notice'}
                </h4>
                <p className="text-xs font-medium text-slate-100 leading-snug">{toast.message}</p>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 transition-colors rounded-md hover:bg-white/10 shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
