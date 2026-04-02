"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  ExternalLink,
  Package,
} from "lucide-react";
import { sampleOrders } from "@/data/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";

const statusColor: Record<OrderStatus, string> = {
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const allStatuses: OrderStatus[] = ["processing", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return sampleOrders.filter((order) => {
      const matchesSearch =
        !search ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.items.some((item) =>
          item.product.name.toLowerCase().includes(search.toLowerCase())
        ) ||
        order.trackingNumber.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const orderDate = new Date(order.createdAt);
      const matchesFrom = !dateFrom || orderDate >= new Date(dateFrom);
      const matchesTo = !dateTo || orderDate <= new Date(dateTo + "T23:59:59");

      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [search, statusFilter, dateFrom, dateTo]);

  const handleExportCSV = () => {
    const headers = "Order #,Date,Items,Total,Status,Tracking\n";
    const rows = filtered
      .map(
        (o) =>
          `${o.id},${formatDate(o.createdAt)},"${o.items.map((i) => `${i.product.name} x${i.quantity}`).join("; ")}",${o.total},${o.status},${o.trackingNumber}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all your orders
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order #, product, or tracking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as OrderStatus | "all")
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Statuses</option>
                {allStatuses.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-8" />
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tracking
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    No orders match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleExpand(order.id)}
                  >
                    <td className="pl-6 py-3">
                      {expandedId === order.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {order.items.length} item{order.items.length !== 1 && "s"}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {order.trackingNumber ? (
                        <span className="font-mono text-xs">
                          {order.trackingNumber}
                        </span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(
                            `Reorder placed for ${order.id}. Items added to cart.`
                          );
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Reorder
                      </button>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr>
                      <td colSpan={8} className="bg-gray-50 px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Line Items */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              Order Items
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {item.product.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      SKU: {item.product.sku}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                      {formatCurrency(
                                        item.product.price * item.quantity
                                      )}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {item.quantity.toLocaleString()} x{" "}
                                      {formatCurrency(item.product.price)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Order Summary */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              Order Summary
                            </h4>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-900">
                                  {formatCurrency(order.subtotal)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>
                                <span className="text-gray-900">
                                  {formatCurrency(order.shipping)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Tax</span>
                                <span className="text-gray-900">
                                  {formatCurrency(order.tax)}
                                </span>
                              </div>
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span className="text-gray-900">Total</span>
                                <span className="text-gray-900">
                                  {formatCurrency(order.total)}
                                </span>
                              </div>
                              <div className="pt-3 border-t space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Carrier</span>
                                  <span className="text-gray-900">
                                    {order.shippingOption.carrier} {order.shippingOption.service}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">
                                    Est. Delivery
                                  </span>
                                  <span className="text-gray-900">
                                    {formatDate(order.estimatedDelivery)}
                                  </span>
                                </div>
                                {order.trackingNumber && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Tracking</span>
                                    <a
                                      href="#"
                                      className="text-blue-600 hover:underline inline-flex items-center gap-1 font-mono text-xs"
                                    >
                                      {order.trackingNumber}
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
