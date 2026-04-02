"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Clock,
  DollarSign,
  AlertCircle,
  Plus,
  FileQuestion,
  Truck,
  FileText,
  Phone,
  Mail,
  TrendingUp,
} from "lucide-react";
import { sampleOrders } from "@/data/orders";
import { sampleInvoices } from "@/data/invoices";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatus } from "@/types";

const statusColor: Record<OrderStatus, string> = {
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusBarColor: Record<OrderStatus, string> = {
  processing: "bg-yellow-500",
  shipped: "bg-blue-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function DashboardOverview() {
  const totalOrders = sampleOrders.length;
  const openOrders = sampleOrders.filter(
    (o) => o.status === "processing" || o.status === "shipped"
  ).length;
  const ytdOrders = sampleOrders.filter((o) =>
    o.createdAt.startsWith("2026")
  );
  const totalSpentYTD = ytdOrders.reduce((sum, o) => sum + o.total, 0);
  const outstandingBalance = sampleInvoices
    .filter((inv) => inv.status === "pending" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0);

  const recentOrders = [...sampleOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Order status counts for chart
  const statusCounts: Record<OrderStatus, number> = {
    processing: sampleOrders.filter((o) => o.status === "processing").length,
    shipped: sampleOrders.filter((o) => o.status === "shipped").length,
    delivered: sampleOrders.filter((o) => o.status === "delivered").length,
    cancelled: sampleOrders.filter((o) => o.status === "cancelled").length,
  };
  const maxCount = Math.max(...Object.values(statusCounts), 1);

  const kpis = [
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Open Orders",
      value: openOrders.toString(),
      icon: Clock,
      color: "text-orange-600 bg-orange-50",
    },
    {
      label: "Total Spent (YTD)",
      value: formatCurrency(totalSpentYTD),
      icon: DollarSign,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Outstanding Balance",
      value: formatCurrency(outstandingBalance),
      icon: AlertCircle,
      color: "text-red-600 bg-red-50",
    },
  ];

  const quickActions = [
    { label: "New Order", href: "/products", icon: Plus, color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Request Quote", href: "/dashboard/rfq", icon: FileQuestion, color: "bg-indigo-600 hover:bg-indigo-700" },
    { label: "Track Shipment", href: "/dashboard/tracking", icon: Truck, color: "bg-emerald-600 hover:bg-emerald-700" },
    { label: "View Invoices", href: "/dashboard/invoices", icon: FileText, color: "bg-purple-600 hover:bg-purple-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Apex Manufacturing</h1>
            <p className="text-blue-200 mt-1">
              Here is an overview of your account activity and recent orders.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Full-Time Client</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
            >
              <div className={`p-3 rounded-lg ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{kpi.label}</p>
                <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`${action.color} text-white rounded-xl p-4 flex items-center gap-3 transition-colors`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="font-medium text-sm">{action.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link
              href="/dashboard/orders"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-3 text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-3 text-gray-900 font-medium">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Status Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
            <div className="space-y-3">
              {(Object.entries(statusCounts) as [OrderStatus, number][]).map(
                ([status, count]) => (
                  <div key={status}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize text-gray-700">{status}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className={`${statusBarColor[status]} h-3 rounded-full transition-all`}
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Account Manager */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Account Manager
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                SR
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sarah Reynolds</p>
                <p className="text-sm text-gray-500">Senior Account Executive</p>
              </div>
            </div>
            <div className="space-y-2">
              <a
                href="tel:+18005551234"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                (800) 555-1234 ext. 302
              </a>
              <a
                href="mailto:s.reynolds@accutite.com"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                s.reynolds@accutite.com
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Available Mon-Fri, 8:00 AM - 5:30 PM EST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
