"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Upload,
  Send,
  Clock,
  CheckCircle2,
  MessageSquare,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { RFQItem } from "@/types";

interface RFQFormItem {
  description: string;
  qty: string;
  specs: string;
}

type RFQStatusType = "submitted" | "under_review" | "quoted" | "accepted" | "declined";

interface PreviousRFQ {
  id: string;
  items: RFQItem[];
  status: RFQStatusType;
  createdAt: string;
  response: string | null;
}

const rfqStatusConfig: Record<
  RFQStatusType,
  { label: string; color: string; icon: React.ElementType }
> = {
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800", icon: Send },
  under_review: { label: "Under Review", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  quoted: { label: "Quoted", color: "bg-purple-100 text-purple-800", icon: MessageSquare },
  accepted: { label: "Accepted", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  declined: { label: "Declined", color: "bg-red-100 text-red-800", icon: XCircle },
};

const rfqSteps: { key: RFQStatusType; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "quoted", label: "Quoted" },
  { key: "accepted", label: "Accepted / Declined" },
];

function getStepIndex(status: RFQStatusType): number {
  switch (status) {
    case "submitted":
      return 0;
    case "under_review":
      return 1;
    case "quoted":
      return 2;
    case "accepted":
    case "declined":
      return 3;
    default:
      return 0;
  }
}

const mockHistory: PreviousRFQ[] = [
  {
    id: "RFQ-2026-012",
    items: [
      { description: "Custom M12x1.5 Hex Bolt, 316SS", qty: 10000, specs: "ASTM A193 B8M, length 75mm" },
      { description: "Matching Hex Nut M12x1.5, 316SS", qty: 10000, specs: "ASTM A194 8M" },
    ],
    status: "quoted",
    createdAt: "2026-03-15T10:00:00Z",
    response: "Quoted at $0.82/bolt and $0.35/nut. Lead time: 4 weeks.",
  },
  {
    id: "RFQ-2026-008",
    items: [
      { description: "1/2-13 x 3\" Structural Bolt A325", qty: 25000, specs: "Type 1, Plain finish, with F436 washers" },
    ],
    status: "accepted",
    createdAt: "2026-02-28T14:00:00Z",
    response: "Order placed as ORD-2026-003.",
  },
  {
    id: "RFQ-2026-005",
    items: [
      { description: "Custom Titanium Socket Head M8x1.25", qty: 500, specs: "Grade 5, anodized blue, 30mm length" },
    ],
    status: "declined",
    createdAt: "2026-02-10T09:00:00Z",
    response: "Minimum order quantity for custom titanium is 2,000 pieces.",
  },
  {
    id: "RFQ-2026-001",
    items: [
      { description: "3/8-16 Flange Bolt, Grade 8", qty: 50000, specs: "Zinc plated, serrated flange" },
      { description: "3/8-16 Flange Nut, Grade 8", qty: 50000, specs: "Zinc plated, serrated flange" },
    ],
    status: "accepted",
    createdAt: "2026-01-05T11:00:00Z",
    response: "Order placed as ORD-2026-001.",
  },
];

const emptyItem: RFQFormItem = { description: "", qty: "", specs: "" };

export default function RFQPage() {
  const [items, setItems] = useState<RFQFormItem[]>([{ ...emptyItem }]);
  const [submitted, setSubmitted] = useState(false);
  const [expandedRfq, setExpandedRfq] = useState<string | null>(null);

  const addItem = () => setItems([...items, { ...emptyItem }]);

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof RFQFormItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasContent = items.some((item) => item.description.trim());
    if (!hasContent) {
      alert("Please add at least one item with a description.");
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setItems([{ ...emptyItem }]);
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Request for Quote</h1>
        <p className="text-sm text-gray-500 mt-1">
          Submit a custom quote request for specialty or bulk fasteners
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RFQ Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  RFQ Submitted Successfully
                </h3>
                <p className="text-gray-500 mb-1">
                  Your request has been sent to our quoting team.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Reference: RFQ-2026-{String(mockHistory.length + 13).padStart(3, "0")}
                </p>

                {/* Status tracker */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  {rfqSteps.map((step, idx) => (
                    <React.Fragment key={step.key}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      {idx < rfqSteps.length - 1 && (
                        <div className="w-12 h-0.5 bg-gray-200" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                  {rfqSteps.map((step, idx) => (
                    <span
                      key={step.key}
                      className={`flex-1 text-center text-xs ${
                        idx === 0 ? "text-blue-700 font-medium" : ""
                      }`}
                    >
                      {step.label}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit Another RFQ
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Line Items
                </h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 relative"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Item {index + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Description *
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(index, "description", e.target.value)
                            }
                            placeholder="e.g., M10x1.5 Hex Bolt, 316 Stainless"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) =>
                              updateItem(index, "qty", e.target.value)
                            }
                            placeholder="e.g., 10000"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Specifications / Notes
                          </label>
                          <textarea
                            value={item.specs}
                            onChange={(e) =>
                              updateItem(index, "specs", e.target.value)
                            }
                            placeholder="Material grade, finish, certifications, tolerances..."
                            rows={2}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Line Item
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("File upload dialog would open here.")}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Specs
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Submit RFQ
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Previous RFQs */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Previous Quotes
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {mockHistory.map((rfq) => {
                const cfg = rfqStatusConfig[rfq.status];
                const StatusIcon = cfg.icon;
                const isExpanded = expandedRfq === rfq.id;
                const stepIdx = getStepIndex(rfq.status);

                return (
                  <div key={rfq.id}>
                    <button
                      onClick={() =>
                        setExpandedRfq(isExpanded ? null : rfq.id)
                      }
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {rfq.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(rfq.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-6 pb-4 space-y-3">
                        {/* Progress steps */}
                        <div className="flex items-center gap-1">
                          {rfqSteps.map((step, idx) => (
                            <React.Fragment key={step.key}>
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  idx <= stepIdx
                                    ? rfq.status === "declined" && idx === stepIdx
                                      ? "bg-red-500 text-white"
                                      : "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-400"
                                }`}
                              >
                                {idx + 1}
                              </div>
                              {idx < rfqSteps.length - 1 && (
                                <div
                                  className={`flex-1 h-0.5 ${
                                    idx < stepIdx
                                      ? "bg-blue-600"
                                      : "bg-gray-200"
                                  }`}
                                />
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        {/* Items */}
                        <div className="space-y-1">
                          {rfq.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs bg-gray-50 rounded p-2"
                            >
                              <p className="font-medium text-gray-700">
                                {item.description}
                              </p>
                              <p className="text-gray-500">
                                Qty: {item.qty.toLocaleString()} | {item.specs}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Response */}
                        {rfq.response && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs font-medium text-blue-800 mb-1">
                              Response
                            </p>
                            <p className="text-xs text-blue-700">
                              {rfq.response}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
