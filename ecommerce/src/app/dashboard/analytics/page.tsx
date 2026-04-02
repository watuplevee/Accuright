"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  ShoppingBag,
  Layers,
  Calendar,
} from "lucide-react";
import { sampleOrders } from "@/data/orders";
import { formatCurrency } from "@/lib/utils";

// Build monthly spending data from orders
function buildMonthlyData() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Current year (2026)
  const current: number[] = new Array(12).fill(0);
  // Previous year (2025)
  const previous: number[] = new Array(12).fill(0);

  sampleOrders.forEach((order) => {
    if (order.status === "cancelled") return;
    const date = new Date(order.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();
    if (year === 2026) current[month] += order.total;
    if (year === 2025) previous[month] += order.total;
  });

  // Add some mock previous year data for chart interest
  const mockPrev = [8200, 6800, 9500, 7200, 11000, 8400, 9800, 7600, 10200, 6900, 12500, 9100];
  const prevWithMock = previous.map((val, idx) => val || mockPrev[idx]);

  return { months, current, previous: prevWithMock };
}

function buildTopProducts() {
  const productMap = new Map<string, { name: string; category: string; quantity: number; revenue: number }>();
  sampleOrders.forEach((order) => {
    if (order.status === "cancelled") return;
    order.items.forEach((item) => {
      const existing = productMap.get(item.product.id);
      const revenue = item.product.price * item.quantity;
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += revenue;
      } else {
        productMap.set(item.product.id, {
          name: item.product.name,
          category: item.product.category,
          quantity: item.quantity,
          revenue,
        });
      }
    });
  });
  return Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

function buildCategoryBreakdown() {
  const catMap = new Map<string, number>();
  sampleOrders.forEach((order) => {
    if (order.status === "cancelled") return;
    order.items.forEach((item) => {
      const cat = item.product.category;
      catMap.set(cat, (catMap.get(cat) || 0) + item.product.price * item.quantity);
    });
  });
  const entries = Array.from(catMap.entries()).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  return entries.map(([category, amount]) => ({
    category,
    amount,
    percentage: total > 0 ? (amount / total) * 100 : 0,
  }));
}

const categoryColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
];

export default function AnalyticsPage() {
  const { months, current, previous } = buildMonthlyData();
  const topProducts = buildTopProducts();
  const categories = buildCategoryBreakdown();

  const maxMonthly = Math.max(...current, ...previous, 1);
  const currentMonthIdx = 2; // March (0-indexed)

  // YTD totals
  const ytdCurrent = current.reduce((s, v) => s + v, 0);
  const ytdPrevious = previous.slice(0, currentMonthIdx + 1).reduce((s, v) => s + v, 0);
  const ytdChange = ytdPrevious > 0 ? ((ytdCurrent - ytdPrevious) / ytdPrevious) * 100 : 0;

  // Order frequency
  const activeOrders = sampleOrders.filter((o) => o.status !== "cancelled" && o.createdAt.startsWith("2026"));
  const ordersPerMonth = activeOrders.length / (currentMonthIdx + 1);
  const avgOrderValue = activeOrders.length > 0
    ? activeOrders.reduce((s, o) => s + o.total, 0) / activeOrders.length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Spending Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your purchasing trends and spending patterns
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">YTD Spending</p>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(ytdCurrent)}
          </p>
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${ytdChange >= 0 ? "text-green-600" : "text-red-600"}`}>
            {ytdChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(ytdChange).toFixed(1)}% vs last year
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Orders This Year</p>
            <ShoppingBag className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {activeOrders.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {ordersPerMonth.toFixed(1)} per month avg
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Avg Order Value</p>
            <Layers className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(avgOrderValue)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Across all 2026 orders</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Product Categories</p>
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {categories.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Active purchasing categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Spending Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Monthly Spending
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-gray-500">2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gray-300 rounded" />
                <span className="text-gray-500">2025</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end gap-2 h-56">
            {months.map((month, idx) => {
              const curHeight = maxMonthly > 0 ? (current[idx] / maxMonthly) * 100 : 0;
              const prevHeight = maxMonthly > 0 ? (previous[idx] / maxMonthly) * 100 : 0;
              const isFuture = idx > currentMonthIdx;
              return (
                <div
                  key={month}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <div className="relative flex items-end gap-0.5 w-full h-48">
                    {/* Previous year bar */}
                    <div
                      className={`flex-1 rounded-t transition-all ${isFuture ? "bg-gray-100" : "bg-gray-200 group-hover:bg-gray-300"}`}
                      style={{ height: `${isFuture ? 0 : prevHeight}%` }}
                      title={`2025 ${month}: ${formatCurrency(previous[idx])}`}
                    />
                    {/* Current year bar */}
                    <div
                      className={`flex-1 rounded-t transition-all ${isFuture ? "bg-blue-100" : "bg-blue-500 group-hover:bg-blue-600"}`}
                      style={{ height: `${curHeight}%` }}
                      title={`2026 ${month}: ${formatCurrency(current[idx])}`}
                    />
                  </div>
                  <span
                    className={`text-xs ${
                      idx === currentMonthIdx
                        ? "text-blue-700 font-semibold"
                        : "text-gray-400"
                    }`}
                  >
                    {month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Spending by Category
          </h2>
          <div className="space-y-4">
            {categories.map((cat, idx) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">{cat.category}</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`${categoryColors[idx % categoryColors.length]} h-2.5 rounded-full transition-all`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {cat.percentage.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Purchased Products */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Top Purchased Products
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">
                  #
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Qty Ordered
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topProducts.map((product, idx) => (
                <tr key={product.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-400 font-medium">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{product.category}</td>
                  <td className="px-6 py-3 text-right text-gray-900">
                    {product.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Frequency Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Order Frequency
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-3xl font-bold text-blue-700">
              {ordersPerMonth.toFixed(1)}
            </p>
            <p className="text-sm text-blue-600 mt-1">Orders / Month</p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-xl">
            <p className="text-3xl font-bold text-emerald-700">
              {activeOrders.length > 0
                ? Math.round(
                    (currentMonthIdx + 1) * 30 / activeOrders.length
                  )
                : 0}
            </p>
            <p className="text-sm text-emerald-600 mt-1">Days Between Orders</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-3xl font-bold text-purple-700">
              {activeOrders.length > 0
                ? Math.round(
                    activeOrders.reduce(
                      (s, o) =>
                        s +
                        o.items.reduce((si, i) => si + i.quantity, 0),
                      0
                    ) / activeOrders.length
                  ).toLocaleString()
                : 0}
            </p>
            <p className="text-sm text-purple-600 mt-1">Avg Units / Order</p>
          </div>
        </div>
      </div>
    </div>
  );
}
