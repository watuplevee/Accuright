"use client";

import { useState } from "react";
import {
  Calculator,
  Truck,
  Zap,
  DollarSign,
  Loader2,
  MapPin,
  Weight,
} from "lucide-react";
import { formatCurrency, getShippingRates } from "@/lib/utils";

interface ShippingRate {
  carrier: string;
  service: string;
  estimatedDays: number;
  price: number;
  tracking: string;
}

export default function ShippingCalculator() {
  const [zipCode, setZipCode] = useState("");
  const [weight, setWeight] = useState("");
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const cheapest =
    rates.length > 0
      ? rates.reduce((min, r) => (r.price < min.price ? r : min), rates[0])
      : null;

  const fastest =
    rates.length > 0
      ? rates.reduce(
          (min, r) => (r.estimatedDays < min.estimatedDays ? r : min),
          rates[0]
        )
      : null;

  function handleCalculate() {
    if (!zipCode.trim() || !weight.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const results = getShippingRates(zipCode, parseFloat(weight) || 1);
      setRates(results);
      setCalculated(true);
      setLoading(false);
    }, 500);
  }

  const grouped: Record<string, ShippingRate[]> = {};
  rates.forEach((r) => {
    if (!grouped[r.carrier]) grouped[r.carrier] = [];
    grouped[r.carrier].push(r);
  });

  const carriers = Object.keys(grouped);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Shipping Calculator
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Estimate shipping costs for your order
        </p>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              Destination Zip Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="90001"
              maxLength={10}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Weight className="w-3.5 h-3.5 inline mr-1" />
              Total Weight (lbs)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="5.0"
              min="0.1"
              step="0.1"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCalculate}
              disabled={!zipCode.trim() || !weight.trim() || loading}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  Calculate
                </>
              )}
            </button>
          </div>
        </div>

        {calculated && rates.length > 0 && (
          <>
            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {cheapest && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">
                      Cheapest Option
                    </span>
                  </div>
                  <p className="text-green-900 font-medium">
                    {cheapest.carrier} {cheapest.service}
                  </p>
                  <p className="text-green-700 text-sm">
                    {formatCurrency(cheapest.price)} &middot;{" "}
                    {cheapest.estimatedDays} day
                    {cheapest.estimatedDays !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
              {fastest && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">
                      Fastest Option
                    </span>
                  </div>
                  <p className="text-blue-900 font-medium">
                    {fastest.carrier} {fastest.service}
                  </p>
                  <p className="text-blue-700 text-sm">
                    {formatCurrency(fastest.price)} &middot;{" "}
                    {fastest.estimatedDays} day
                    {fastest.estimatedDays !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-500 uppercase tracking-wide text-xs">
                      Carrier
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-500 uppercase tracking-wide text-xs">
                      Service
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-500 uppercase tracking-wide text-xs">
                      Est. Days
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-500 uppercase tracking-wide text-xs">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {carriers.map((carrier) =>
                    grouped[carrier].map((rate, idx) => {
                      const isCheapest =
                        cheapest &&
                        rate.carrier === cheapest.carrier &&
                        rate.service === cheapest.service;
                      const isFastest =
                        fastest &&
                        rate.carrier === fastest.carrier &&
                        rate.service === fastest.service;
                      return (
                        <tr
                          key={`${carrier}-${idx}`}
                          className={`border-b border-gray-100 ${
                            isCheapest
                              ? "bg-green-50"
                              : isFastest
                                ? "bg-blue-50"
                                : ""
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">
                                {rate.carrier}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {rate.service}
                            {isCheapest && (
                              <span className="ml-2 inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                Cheapest
                              </span>
                            )}
                            {isFastest && !isCheapest && (
                              <span className="ml-2 inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                Fastest
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-700">
                            {rate.estimatedDays}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">
                            {formatCurrency(rate.price)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Rates are estimates based on destination zip code and weight.
              Actual rates may vary. Orders over $1,000 qualify for free ground
              shipping. Orders over $500 receive 10% off shipping.
            </p>
          </>
        )}

        {calculated && rates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Truck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No shipping rates available for this destination.</p>
          </div>
        )}
      </div>
    </div>
  );
}
