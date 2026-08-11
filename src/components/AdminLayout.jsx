import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Layers, Inbox, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function AdminLayout({ children }) {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Products', path: '/admin/products', icon: Layers },
    { label: 'Customer Inquires', path: '/admin/inquiries', icon: Inbox },
  ];

  return (
    <div className="h-screen bg-[#F8F5F0] text-slate-900 flex flex-col md:flex-row font-sans overflow-hidden selection:bg-[#B17F59] selection:text-white">

      {/* LEFT VERTICAL SIDEBAR */}
      <aside className="w-full md:w-64 md:h-screen bg-white border-r border-[#E5D7CD] p-6 flex flex-col justify-between shrink-0 shadow-sm overflow-y-auto z-20">

        <div className="space-y-8">

          {/* Logo Centered inside Sidebar Header */}
          <div className="space-y-4 text-center border-b border-[#E5D7CD]/60 pb-5">
            <Link to="/admin/dashboard" className="inline-flex justify-center w-full">
              <Logo className="h-10 mx-auto" />
            </Link>
            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#F0E8E1] border border-[#E5D7CD] rounded-md text-xs text-slate-700 font-semibold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#B17F59]" />
              <span>Admin: <strong className="text-slate-950">{user || 'Owner'}</strong></span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-xs font-bold transition-all ${active
                    ? 'bg-[#B17F59] text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-[#F0E8E1]'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#B17F59]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom System & Sleek Logout Button */}
        <div className="pt-6 border-t border-[#E5D7CD] space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-slate-700 font-semibold hover:text-[#B17F59] px-3 py-2 rounded-md hover:bg-[#F0E8E1] transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#B17F59]" />
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 rounded-md text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-2xs hover:shadow-md cursor-pointer group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto p-6 sm:p-10 space-y-6">
        {children}
      </main>

    </div>
  );
}
