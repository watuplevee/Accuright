"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  CreditCard,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { sampleInvoices } from "@/data/invoices";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceStatus } from "@/types";

const statusConfig: Record<
  InvoiceStatus,
  { color: string; icon: React.ElementType }
> = {
  paid: { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  overdue: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
};

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");

  const filtered = useMemo(() => {
    return sampleInvoices.filter((inv) => {
      const matchesSearch =
        !search ||
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.orderId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalInvoiced = sampleInvoices.reduce((s, inv) => s + inv.total, 0);
  const totalPaid = sampleInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((s, inv) => s + inv.total, 0);
  const totalOutstanding = sampleInvoices
    .filter((inv) => inv.status === "pending")
    .reduce((s, inv) => s + inv.total, 0);
  const totalOverdue = sampleInvoices
    .filter((inv) => inv.status === "overdue")
    .reduce((s, inv) => s + inv.total, 0);

  const summaryCards = [
    {
      label: "Total Invoiced",
      value: formatCurrency(totalInvoiced),
      icon: FileText,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Paid",
      value: formatCurrency(totalPaid),
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Outstanding",
      value: formatCurrency(totalOutstanding),
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Overdue",
      value: formatCurrency(totalOverdue),
      icon: AlertTriangle,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all your invoices and payments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
            >
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice # or order #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as InvoiceStatus | "all")
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Issued
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    No invoices match your search.
                  </td>
                </tr>
              )}
              {filtered.map((inv) => {
                const cfg = statusConfig[inv.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {inv.id}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{inv.orderId}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(inv.issuedDate)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cfg.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {(inv.status === "pending" ||
                          inv.status === "overdue") && (
                          <button
                            onClick={() =>
                              alert(
                                `Payment portal opening for ${inv.id}...`
                              )
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            <CreditCard className="w-3 h-3" />
                            Pay Now
                          </button>
                        )}
                        <button
                          onClick={() =>
                            alert(
                              `Downloading PDF for ${inv.id}...`
                            )
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
