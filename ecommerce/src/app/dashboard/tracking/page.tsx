"use client";

import React, { useState } from "react";
import {
  Search,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Circle,
  ExternalLink,
  Calendar,
  Map,
} from "lucide-react";
import { sampleOrders } from "@/data/orders";
import { formatDate } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";

interface TrackingStep {
  label: string;
  description: string;
  icon: React.ElementType;
}

const trackingSteps: TrackingStep[] = [
  { label: "Order Placed", description: "Order confirmed and processing", icon: Package },
  { label: "Picked Up", description: "Package collected by carrier", icon: Package },
  { label: "In Transit", description: "On the way to destination", icon: Truck },
  { label: "Out for Delivery", description: "With local delivery driver", icon: MapPin },
  { label: "Delivered", description: "Package delivered", icon: CheckCircle2 },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case "processing":
      return 0;
    case "shipped":
      return 2;
    case "delivered":
      return 4;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
}

function carrierTrackingUrl(carrier: string, tracking: string): string {
  switch (carrier) {
    case "UPS":
      return `https://www.ups.com/track?tracknum=${tracking}`;
    case "FEDEX":
      return `https://www.fedex.com/fedextrack/?trknbr=${tracking}`;
    case "DHL":
      return `https://www.dhl.com/en/express/tracking.html?AWB=${tracking}`;
    default:
      return "#";
  }
}

function ShipmentCard({ order }: { order: Order }) {
  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {order.items.map((i) => i.product.name).join(", ")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {order.trackingNumber && (
            <a
              href={carrierTrackingUrl(
                String(order.shippingOption.carrier),
                order.trackingNumber
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              {order.shippingOption.carrier} {order.trackingNumber}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
            <Calendar className="w-3.5 h-3.5" />
            Est. {formatDate(order.estimatedDelivery)}
          </div>
        </div>
      </div>

      {isCancelled ? (
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-red-700 font-medium">This order has been cancelled.</p>
        </div>
      ) : (
        <>
          {/* Visual Timeline */}
          <div className="relative">
            {/* Desktop timeline */}
            <div className="hidden md:flex items-center justify-between">
              {trackingSteps.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="flex flex-col items-center relative z-10 flex-1"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <p
                      className={`text-xs font-medium mt-2 text-center ${
                        isCompleted ? "text-blue-700" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400 text-center hidden lg:block">
                      {step.description}
                    </p>
                  </div>
                );
              })}
              {/* Progress bar behind circles */}
              <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-0">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${(currentStep / (trackingSteps.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Mobile timeline */}
            <div className="md:hidden space-y-4">
              {trackingSteps.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={step.label} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
                          isCompleted
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      {idx < trackingSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-6 ${
                            isCompleted ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-1">
                      <p
                        className={`text-sm font-medium ${
                          isCompleted ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Map Placeholder */}
      {!isCancelled && order.trackingNumber && (
        <div className="mt-6 bg-gray-100 rounded-lg border border-gray-200 h-40 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Map className="w-8 h-8 mx-auto mb-1" />
            <p className="text-sm">Live tracking map</p>
            <p className="text-xs">Carrier integration required</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  const [query, setQuery] = useState("");

  const activeShipments = sampleOrders.filter(
    (o) => o.status === "shipped" || o.status === "processing"
  );

  const searchResults = query.trim()
    ? sampleOrders.filter(
        (o) =>
          o.id.toLowerCase().includes(query.toLowerCase()) ||
          o.trackingNumber.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  const displayOrders = searchResults ?? activeShipments;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shipment Tracking</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your orders and shipments in real time
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order # or tracking number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Truck className="w-5 h-5 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900">
          {searchResults ? "Search Results" : "Active Shipments"}
        </h2>
        <span className="text-sm text-gray-500">
          ({displayOrders.length})
        </span>
      </div>

      {/* Shipment Cards */}
      {displayOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p className="text-gray-500">
            {searchResults
              ? "No shipments match your search."
              : "No active shipments at this time."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((order) => (
            <ShipmentCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
