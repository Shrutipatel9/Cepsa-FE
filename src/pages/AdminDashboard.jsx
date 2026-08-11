import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Package, Layers, Inbox, TrendingUp, PieChart, CheckCircle2, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';

import Skeleton, { StatCardSkeleton, TableSkeleton } from '../components/Skeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_categories: 0,
    total_products: 0,
    total_inquiries: 0,
  });
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, inquiriesRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/inquiries')
        ]);
        setStats(statsRes.data);
        setInquiries(inquiriesRes.data);
      } catch (err) {
        console.error('Failed to load admin dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 1. Calculate Status Breakdown
  const statusStats = useMemo(() => {
    let pending = 0;
    let inProgress = 0;
    let completed = 0;

    inquiries.forEach((inq) => {
      const st = (inq.status || 'Pending').toLowerCase();
      if (st === 'completed' || st === 'closed') completed++;
      else if (st === 'in progress' || st === 'contacted') inProgress++;
      else pending++;
    });

    const total = inquiries.length || 1;
    return {
      pending,
      inProgress,
      completed,
      total: inquiries.length,
      pendingPct: Math.round((pending / total) * 100),
      inProgressPct: Math.round((inProgress / total) * 100),
      completedPct: Math.round((completed / total) * 100),
    };
  }, [inquiries]);

  // 2. Calculate Last 7 Days Inquiry Trends
  const trendData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      days.push({ dateStr, dayLabel, productCount: 0, customerCount: 0 });
    }

    inquiries.forEach((inq) => {
      if (!inq.created_at) return;
      const inqDateStr = new Date(inq.created_at).toISOString().split('T')[0];
      const targetDay = days.find((d) => d.dateStr === inqDateStr);
      if (targetDay) {
        const isProduct = inq.inquiry_type === 'product' || Boolean(inq.product_name || inq.product_code);
        if (isProduct) targetDay.productCount++;
        else targetDay.customerCount++;
      }
    });

    const maxCount = Math.max(...days.map((d) => d.productCount + d.customerCount), 5);
    return { days, maxCount };
  }, [inquiries]);

  // 3. Category Breakdown (Product vs Customer)
  const categoryStats = useMemo(() => {
    let productCount = 0;
    let customerCount = 0;

    inquiries.forEach((inq) => {
      const isProduct = inq.inquiry_type === 'product' || Boolean(inq.product_name || inq.product_code);
      if (isProduct) productCount++;
      else customerCount++;
    });

    return { productCount, customerCount };
  }, [inquiries]);

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#B17F59] uppercase tracking-widest block mb-1">
              ANALYTICS & METRICS
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Inquiry & Sales Dashboard
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Live customer lead analytics, quote trends, and catalog distribution.
            </p>
          </div>

          <Link
            to="/admin/inquiries"
            className="px-4 py-2.5 bg-[#B17F59] hover:bg-[#986743] text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>Manage All Inquiries</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Overview Metric Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* 1. Total Categories */}
            <div className="bg-white border border-[#E5D7CD] p-6 rounded-md space-y-3 relative overflow-hidden shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
                <span>Total Categories</span>
                <div className="p-2.5 bg-[#F0E8E1] rounded-md text-[#B17F59]">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif text-4xl font-extrabold text-[#8E5832]">
                {stats.total_categories}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Active product categories listed
              </p>
            </div>

            {/* 2. Total Products */}
            <div className="bg-white border border-[#E5D7CD] p-6 rounded-md space-y-3 relative overflow-hidden shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
                <span>Total Products</span>
                <div className="p-2.5 bg-[#F0E8E1] rounded-md text-[#B17F59]">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif text-4xl font-extrabold text-[#8E5832]">
                {stats.total_products}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Products across all categories
              </p>
            </div>

            {/* 3. Number of Customer Inquiries */}
            <div className="bg-white border border-[#E5D7CD] p-6 rounded-md space-y-3 relative overflow-hidden shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
                <span>Total Inquiries</span>
                <div className="p-2.5 bg-[#F0E8E1] rounded-md text-[#B17F59]">
                  <Inbox className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif text-4xl font-extrabold text-[#8E5832]">
                {stats.total_inquiries}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="text-[#B17F59] font-bold">📦 {categoryStats.productCount} Product</span>
                <span>•</span>
                <span className="text-slate-700 font-bold">💬 {categoryStats.customerCount} Direct</span>
              </div>
            </div>

          </div>
        )}

        {/* GRAPH SECTION: 2 COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* GRAPH 1: Inquiry Growth Trend (7-Day Bar Graph) - 7 Columns */}
          <div className="lg:col-span-7 bg-white border border-[#E5D7CD] p-6 rounded-md shadow-xs space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#E5D7CD]/50 pb-4">
              <div>
                <h3 className="font-serif font-extrabold text-slate-950 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#B17F59]" /> Weekly Inquiry Volume Trend
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Daily breakdown of product quotes vs customer contact messages
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-xs bg-[#B17F59]"></div>
                  <span className="text-slate-700">Product Quote</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-xs bg-slate-800"></div>
                  <span className="text-slate-700">Customer Direct</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive Dual Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-200">
              {trendData.days.map((d, idx) => {
                const total = d.productCount + d.customerCount;
                const pHeightPct = Math.round((d.productCount / trendData.maxCount) * 100);
                const cHeightPct = Math.round((d.customerCount / trendData.maxCount) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    
                    {/* Hover Tooltip */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-md shadow-xl whitespace-nowrap z-20 pointer-events-none font-medium">
                      <div>{d.dayLabel}</div>
                      <div>📦 Product: <strong>{d.productCount}</strong> | 💬 Direct: <strong>{d.customerCount}</strong></div>
                    </div>

                    {/* Dual Stacked Bar Column */}
                    <div className="w-full max-w-[40px] flex flex-col justify-end gap-1 items-center h-full">
                      {total === 0 ? (
                        <div className="w-full bg-slate-100 h-2 rounded-xs"></div>
                      ) : (
                        <div className="w-full flex flex-col gap-1 items-center justify-end h-full">
                          {d.productCount > 0 && (
                            <div
                              style={{ height: `${Math.max(pHeightPct, 12)}%` }}
                              className="w-full bg-[#B17F59] hover:bg-[#986743] transition-all rounded-t-xs shadow-xs"
                            ></div>
                          )}
                          {d.customerCount > 0 && (
                            <div
                              style={{ height: `${Math.max(cHeightPct, 12)}%` }}
                              className="w-full bg-slate-800 hover:bg-slate-950 transition-all rounded-xs shadow-xs"
                            ></div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Day X-Axis Label */}
                    <span className="text-[11px] font-bold text-slate-600 mt-1 whitespace-nowrap">
                      {d.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
              <span>* Hover on any column to inspect daily breakdown</span>
              <span className="font-bold text-[#B17F59]">Total Past 7 Days: {trendData.days.reduce((acc, d) => acc + d.productCount + d.customerCount, 0)} Inquiries</span>
            </div>

          </div>

          {/* GRAPH 2: Inquiry Lead Status Breakdown - 5 Columns */}
          <div className="lg:col-span-5 bg-white border border-[#E5D7CD] p-6 rounded-md shadow-xs space-y-6">
            
            <div className="border-b border-[#E5D7CD]/50 pb-4">
              <h3 className="font-serif font-extrabold text-slate-950 text-base flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#B17F59]" /> Lead Status Distribution
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Overall fulfillment and inquiry conversion status
              </p>
            </div>

            {/* Status Breakdown Progress Cards */}
            <div className="space-y-4 pt-2">
              
              {/* 1. Pending Status */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-amber-800">
                    <Clock className="w-4 h-4 text-amber-600" /> Pending Review
                  </span>
                  <span className="font-mono text-slate-900">
                    {statusStats.pending} <span className="text-slate-400 font-normal">({statusStats.pendingPct}%)</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${statusStats.pendingPct}%` }}
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>

              {/* 2. In Progress Status */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-blue-800">
                    <AlertCircle className="w-4 h-4 text-blue-600" /> In Progress / Contacted
                  </span>
                  <span className="font-mono text-slate-900">
                    {statusStats.inProgress} <span className="text-slate-400 font-normal">({statusStats.inProgressPct}%)</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${statusStats.inProgressPct}%` }}
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>

              {/* 3. Completed Status */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed & Resolved
                  </span>
                  <span className="font-mono text-slate-900">
                    {statusStats.completed} <span className="text-slate-400 font-normal">({statusStats.completedPct}%)</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${statusStats.completedPct}%` }}
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>

            </div>

            {/* Quick Link to Inquiries */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Conversion Rate: <strong className="text-slate-900">{statusStats.completedPct}%</strong></span>
              <Link
                to="/admin/inquiries"
                className="text-[#B17F59] font-bold hover:underline flex items-center gap-1"
              >
                Update Statuses →
              </Link>
            </div>

          </div>

        </div>

        {/* 3. RECENT INQUIRIES PREVIEW TABLE */}
        <div className="bg-white border border-[#E5D7CD] rounded-md shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5D7CD] flex items-center justify-between bg-[#F0E8E1]/30">
            <h3 className="font-serif font-extrabold text-slate-950 text-sm flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#B17F59]" /> Recent Inquiries Feed
            </h3>
            <Link
              to="/admin/inquiries"
              className="text-xs font-bold text-[#B17F59] hover:underline"
            >
              View All Inquiries ({inquiries.length}) →
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs font-medium">
              No inquiries recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4"># ID</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Product / Detail</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {inquiries.slice(0, 5).map((inq) => {
                    const isProduct = inq.inquiry_type === 'product' || Boolean(inq.product_name || inq.product_code);
                    const st = inq.status || 'Pending';

                    return (
                      <tr key={inq.id} className="hover:bg-amber-50/20 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-600">#{inq.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-950">{inq.customer_name}</td>
                        <td className="py-3 px-4 text-slate-700">{inq.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isProduct ? 'bg-amber-50 text-[#8E5832] border border-amber-200' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {isProduct ? '📦 Product Quote' : '💬 Direct Message'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {inq.product_name || inq.product_code || (inq.message ? inq.message.slice(0, 30) + '...' : 'General')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            st === 'Completed' || st === 'Closed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : st === 'In Progress' || st === 'Contacted'
                              ? 'bg-blue-50 text-blue-800 border border-blue-300'
                              : 'bg-amber-50 text-amber-800 border border-amber-300'
                          }`}>
                            {st}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
