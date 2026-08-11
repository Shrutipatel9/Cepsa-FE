import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Mail, Phone, MapPin, Search, Trash2, Calendar, Package, MessageSquare, Loader2, ArrowUpDown, Filter, RotateCcw, ChevronDown, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Skeleton, { TableSkeleton } from '../components/Skeleton';

// Helper functions for Date Filtering
const isToday = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
};

const isYesterday = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();
};

const isThisMonth = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
};

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Active Category Tab: 'product' or 'customer'
  const [activeTab, setActiveTab] = useState('product');

  // Single Filter Dropdown Open State
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Search & Filter States
  const [emailSearch, setEmailSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [datePeriodFilter, setDatePeriodFilter] = useState('all'); // 'all' | 'today' | 'yesterday' | 'this_month'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { showSuccess, showError } = useToast();

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/inquiries');
      setInquiries(res.data);
    } catch (err) {
      console.error('Failed to load inquiries', err);
      showError('Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, statusFilter, datePeriodFilter, sortOrder, emailSearch, productSearch]);

  // Compute Active Filter Count
  const activeFilterCount = useMemo(() => {
    return [
      statusFilter !== 'all',
      datePeriodFilter !== 'all',
      sortOrder !== 'newest',
      productSearch.trim() !== ''
    ].filter(Boolean).length;
  }, [statusFilter, datePeriodFilter, sortOrder, productSearch]);

  const handleClearFilters = () => {
    setEmailSearch('');
    setProductSearch('');
    setStatusFilter('all');
    setDatePeriodFilter('all');
    setSortOrder('newest');
    setCurrentPage(1);
    showSuccess('All filters reset to default.');
  };

  // Compute category counts
  const counts = useMemo(() => {
    const productCount = inquiries.filter((inq) => {
      const type = inq.inquiry_type || (inq.product_name || inq.product_code ? 'product' : 'customer');
      return type === 'product';
    }).length;

    const customerCount = inquiries.filter((inq) => {
      const type = inq.inquiry_type || (inq.product_name || inq.product_code ? 'product' : 'customer');
      return type === 'customer';
    }).length;

    return { product: productCount, customer: customerCount };
  }, [inquiries]);

  // Filter & Sort Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((inq) => {
        // Tab type filter
        const type = inq.inquiry_type || (inq.product_name || inq.product_code ? 'product' : 'customer');
        if (type !== activeTab) return false;

        // Email / Customer Name / Product Search filter
        if (emailSearch.trim()) {
          const q = emailSearch.toLowerCase();
          const matchEmail = (inq.email || '').toLowerCase().includes(q);
          const matchName = (inq.customer_name || '').toLowerCase().includes(q);
          const matchProduct = (inq.product_name || inq.product_code || '').toLowerCase().includes(q);
          if (!matchEmail && !matchName && !matchProduct) return false;
        }

        // Product Name Search filter
        if (activeTab === 'product' && productSearch.trim()) {
          const pq = productSearch.toLowerCase();
          const pName = (inq.product_name || inq.product_code || '').toLowerCase();
          if (!pName.includes(pq)) return false;
        }

        // Status Filter
        if (statusFilter !== 'all') {
          if ((inq.status || 'Pending').toLowerCase() !== statusFilter.toLowerCase()) return false;
        }

        // Date Period Filter
        if (datePeriodFilter !== 'all') {
          if (datePeriodFilter === 'today' && !isToday(inq.created_at)) return false;
          if (datePeriodFilter === 'yesterday' && !isYesterday(inq.created_at)) return false;
          if (datePeriodFilter === 'this_month' && !isThisMonth(inq.created_at)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [inquiries, activeTab, emailSearch, productSearch, statusFilter, datePeriodFilter, sortOrder]);

  // Calculate Paginated Inquiries
  const totalItems = filteredInquiries.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInquiries.slice(start, start + pageSize);
  }, [filteredInquiries, currentPage, pageSize]);

  const handleStatusChange = async (id, statusStr) => {
    setUpdatingId(id);
    try {
      await api.put(`/admin/inquiries/${id}/status?status_str=${statusStr}`);
      showSuccess(`Status updated to "${statusStr}"`);
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: statusStr } : item))
      );
    } catch (err) {
      showError('Failed to update inquiry status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteInquiry = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/admin/inquiries/${id}`);
      showSuccess(`Inquiry #${id} deleted successfully.`);
      setDeleteConfirmId(null);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      showError('Failed to delete inquiry.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Page Title & Overview Header */}
        <div>
          <span className="text-[10px] font-mono font-bold text-[#B17F59] uppercase tracking-widest block mb-1">
            CEPSA INQUIRY DESK
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Customer & Product Inquiries
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage quote requests, direct customer messages, and lead conversion status.
          </p>
        </div>

        {/* 1. TOP 2 CATEGORY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Card 1: Product Inquiries */}
          <div
            onClick={() => setActiveTab('product')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden shadow-xs hover:shadow-md hover-shine ${activeTab === 'product'
              ? 'bg-white border-[#B17F59] ring-2 ring-[#B17F59]'
              : 'bg-white border-[#E5D7CD] hover:border-[#B17F59]'
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className={`p-3.5 rounded-2xl ${activeTab === 'product' ? 'bg-[#B17F59] text-white shadow-md' : 'bg-[#F0E8E1] text-[#B17F59]'}`}>
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-extrabold text-slate-950 text-base">Product Inquiries</h3>
                  <p className="text-xs text-slate-500 font-medium">Quotes & product info requests</p>
                </div>
              </div>
              <div className="font-serif text-3xl font-extrabold text-[#8E5832]">
                {counts.product}
              </div>
            </div>
            {activeTab === 'product' && (
              <div className="mt-4 pt-2 border-t border-[#E5D7CD]/60 text-[11px] font-bold text-[#B17F59] flex items-center justify-between">
                <span>● Showing {filteredInquiries.length} items</span>
              </div>
            )}
          </div>

          {/* Card 2: Customer Inquiries */}
          <div
            onClick={() => setActiveTab('customer')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden shadow-xs hover:shadow-md hover-shine ${activeTab === 'customer'
              ? 'bg-white border-[#B17F59] ring-2 ring-[#B17F59]'
              : 'bg-white border-[#E5D7CD] hover:border-[#B17F59]'
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className={`p-3.5 rounded-2xl ${activeTab === 'customer' ? 'bg-[#B17F59] text-white shadow-md' : 'bg-[#F0E8E1] text-[#B17F59]'}`}>
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-extrabold text-slate-950 text-base">Customer Inquiries</h3>
                  <p className="text-xs text-slate-500 font-medium">Messages from Contact Us form</p>
                </div>
              </div>
              <div className="font-serif text-3xl font-extrabold text-[#8E5832]">
                {counts.customer}
              </div>
            </div>
            {activeTab === 'customer' && (
              <div className="mt-4 pt-2 border-t border-[#E5D7CD]/60 text-[11px] font-bold text-[#B17F59] flex items-center justify-between">
                <span>● Showing {filteredInquiries.length} items</span>
              </div>
            )}
          </div>

        </div>

        {/* 2. INLINE SEARCH & FILTER CONTROLS (NO WHITE BACKGROUND BOX) */}
        <div className="flex items-center justify-between gap-3 text-xs relative pt-1">

          {/* Compact Fixed Width Search Input */}
          <div className="relative w-56 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search Email, Name, or Product..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 h-10 bg-white border border-[#E5D7CD] rounded-md text-slate-900 focus:outline-none focus:border-[#B17F59] font-medium text-xs shadow-2xs transition-all"
            />
          </div>

          {/* Single Filter Dropdown Toggle Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-2.5 h-10 rounded-md border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${activeFilterCount > 0 || isFilterOpen
                ? 'bg-[#B17F59] text-white border-[#B17F59] shadow-md hover:bg-[#986743]'
                : 'bg-white text-slate-800 border-[#E5D7CD] hover:border-[#B17F59]'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-md bg-white text-[#B17F59] text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Single Consolidated Dropdown Popover (Compact & Small) */}
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-4 bg-white border border-[#E5D7CD] rounded-2xl shadow-xl z-40 space-y-3 animate-fadeIn text-slate-900">

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-serif font-bold text-xs text-slate-950 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#B17F59]" /> Filter Options
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Date Period */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#B17F59]" /> Date
                    </label>
                    <select
                      value={datePeriodFilter}
                      onChange={(e) => setDatePeriodFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#B17F59] cursor-pointer"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="this_month">This Month</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-[#B17F59]" /> Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#B17F59] cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Sort Order */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <ArrowUpDown className="w-3 h-3 text-[#B17F59]" /> Order
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#B17F59] cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>

                  {/* Product Name (Product Tab Only) */}
                  {activeTab === 'product' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Package className="w-3 h-3 text-[#B17F59]" /> Product
                      </label>
                      <input
                        type="text"
                        placeholder="LETOP..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 text-xs font-medium focus:outline-none focus:border-[#B17F59]"
                      />
                    </div>
                  )}
                </div>

                {/* Popover Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-[11px] text-red-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Filters
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="px-3 py-1 bg-[#B17F59] hover:bg-[#986743] text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* 3. TABLE VIEW FOR INQUIRIES */}
        <div className="bg-white border border-[#E5D7CD] rounded-md shadow-xs overflow-hidden">

          <div className="px-6 py-4 border-b border-[#E5D7CD] flex items-center justify-between bg-[#F0E8E1]/40">
            <h3 className="font-serif font-extrabold text-slate-950 text-sm flex items-center gap-2">
              {activeTab === 'product' ? <Package className="w-4 h-4 text-[#B17F59]" /> : <MessageSquare className="w-4 h-4 text-[#B17F59]" />}
              <span>{activeTab === 'product' ? 'Product Inquiries List' : 'Customer Message Inquiries List'}</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Total Records: {filteredInquiries.length}
            </span>
          </div>

          {loading ? (
            <TableSkeleton rows={6} />
          ) : paginatedInquiries.length === 0 ? (
            <div className="py-16 text-center text-slate-500 font-medium">
              No inquiries found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F5F0] text-slate-700 font-bold border-b border-[#E5D7CD] uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4"># ID</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Customer Name</th>
                    <th className="py-3.5 px-4">Email & Phone</th>
                    <th className="py-3.5 px-4">City</th>
                    {activeTab === 'product' && <th className="py-3.5 px-4">Product Name</th>}
                    <th className="py-3.5 px-4">Message / Requirements</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {paginatedInquiries.map((inq) => {
                    const isUpdating = updatingId === inq.id;
                    const statusVal = inq.status || 'Pending';

                    return (
                      <tr key={inq.id} className="hover:bg-[#F8F5F0]/60 transition-colors">

                        {/* ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                          #{inq.id}
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                          {new Date(inq.created_at).toLocaleDateString()}
                          <div className="text-[10px] text-slate-400 font-mono">
                            {new Date(inq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        {/* Customer Name */}
                        <td className="py-3.5 px-4 font-bold text-slate-950 whitespace-nowrap">
                          {inq.customer_name}
                        </td>

                        {/* Email & Phone */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                            <Mail className="w-3.5 h-3.5 text-[#B17F59] shrink-0" />
                            <span>{inq.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600 text-[11px] mt-0.5">
                            <Phone className="w-3 h-3 text-[#B17F59] shrink-0" />
                            <span>{inq.phone}</span>
                          </div>
                        </td>

                        {/* City */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                          {inq.city || 'N/A'}
                        </td>

                        {/* Product Name (For Product Inquiries Tab) */}
                        {activeTab === 'product' && (
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#8E5832] font-bold rounded-md text-xs">
                              {inq.product_name || inq.product_code || 'General Product'}
                            </span>
                          </td>
                        )}

                        {/* Message / Requirements */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="line-clamp-2 text-slate-700 text-xs">
                            {inq.message || 'No additional notes specified.'}
                          </div>
                        </td>

                        {/* Status Select Dropdown */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B17F59]" />}
                            <select
                              disabled={isUpdating}
                              value={statusVal}
                              onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                              className={`px-3 py-1 text-xs font-bold rounded-md border focus:outline-none cursor-pointer transition-colors ${statusVal === 'Completed' || statusVal === 'Closed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : statusVal === 'In Progress' || statusVal === 'Contacted'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </td>

                        {/* Action (Delete) */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {deleteConfirmId === inq.id ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                disabled={deletingId === inq.id}
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-md transition-colors cursor-pointer flex items-center gap-1"
                              >
                                {deletingId === inq.id && <Loader2 className="w-3 h-3 animate-spin" />}
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-slate-100 text-slate-700 font-bold text-[11px] rounded-md cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(inq.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. PAGINATION FOOTER */}
          {filteredInquiries.length > 0 && (
            <div className="px-6 py-3.5 border-t border-[#E5D7CD] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F0E8E1]/30 text-xs text-slate-600 font-medium">

              {/* Counter Info & Page Size */}
              <div className="flex items-center gap-2">
                <span>
                  Showing <strong className="text-slate-900">{((currentPage - 1) * pageSize) + 1}</strong> to{' '}
                  <strong className="text-slate-900">{Math.min(currentPage * pageSize, totalItems)}</strong> of{' '}
                  <strong className="text-slate-900">{totalItems}</strong> entries
                </span>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="ml-2 px-2 py-1 bg-white border border-[#E5D7CD] rounded-md text-xs font-bold text-slate-800 focus:outline-none focus:border-[#B17F59] cursor-pointer"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 bg-white border border-[#E5D7CD] rounded-md text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                  .map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-md text-xs font-bold transition-all cursor-pointer ${currentPage === pageNum
                        ? 'bg-[#B17F59] text-white shadow-xs'
                        : 'bg-white border border-[#E5D7CD] text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="px-3 py-1.5 bg-white border border-[#E5D7CD] rounded-md text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </AdminLayout>
  );
}
