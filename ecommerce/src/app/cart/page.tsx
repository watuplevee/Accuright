"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  Package,
  Tag,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import {
  formatCurrency,
  calculateBulkPrice,
  getBulkTier,
  getShippingOptions,
} from "@/lib/utils";
import ShippingCalculator from "@/components/shipping/ShippingCalculator";

const TAX_RATE = 0.0825;

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, itemCount, subtotal } =
    useCart();
  const [showShippingCalc, setShowShippingCalc] = useState(false);

  const shippingOptions = items.length > 0 ? getShippingOptions(items) : [];
  const cheapestShipping =
    shippingOptions.length > 0
      ? Math.min(...shippingOptions.map((o) => o.price))
      : 0;
  const tax = subtotal * TAX_RATE;
  const estimatedTotal = subtotal + cheapestShipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-steel-100 rounded-full p-6 mb-6">
          <ShoppingCart className="w-16 h-16 text-steel-400" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-steel-800 mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-steel-500 mb-8 text-center max-w-md">
          Looks like you haven&apos;t added any fasteners yet. Browse our
          catalog to find the precision hardware you need.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          <Package className="w-5 h-5" />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-steel-800">
            Shopping Cart
          </h1>
          <p className="text-steel-500 mt-1">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-700 font-medium self-start sm:self-auto"
        >
          Clear Cart
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4 mb-8 lg:mb-0">
          {/* Table header - desktop */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-steel-500 uppercase tracking-wider border-b border-steel-200">
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Line Total</div>
            <div className="col-span-1" />
          </div>

          {items.map((item) => {
            const bulkPrice = calculateBulkPrice(item.price, item.quantity);
            const hasBulkDiscount = bulkPrice < item.price;
            const bulkTier = getBulkTier(item.quantity);
            const lineTotal = bulkPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="bg-white border border-steel-200 rounded-lg p-4 md:p-4"
              >
                {/* Mobile layout */}
                <div className="md:hidden space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-steel-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-steel-500">SKU: {item.sku}</p>
                      {item.specs && (
                        <p className="text-xs text-steel-400 mt-1">
                          {item.specs}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-steel-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {hasBulkDiscount && (
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                      <Tag className="w-3 h-3" />
                      Bulk Pricing: {bulkTier}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-steel-500">Unit: </span>
                      <span
                        className={`font-medium ${hasBulkDiscount ? "text-green-700" : "text-steel-800"}`}
                      >
                        {formatCurrency(bulkPrice)}
                      </span>
                      {hasBulkDiscount && (
                        <span className="text-xs text-steel-400 line-through ml-2">
                          {formatCurrency(item.price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center border border-steel-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-steel-50 transition-colors rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 text-steel-600" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (val > 0) updateQuantity(item.id, val);
                        }}
                        className="w-16 text-center text-sm font-medium border-x border-steel-300 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-steel-50 transition-colors rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 text-steel-600" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-bold text-steel-800">
                    {formatCurrency(lineTotal)}
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <h3 className="font-semibold text-steel-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-steel-500">SKU: {item.sku}</p>
                    {item.specs && (
                      <p className="text-xs text-steel-400 mt-0.5">
                        {item.specs}
                      </p>
                    )}
                    {hasBulkDiscount && (
                      <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                        <Tag className="w-3 h-3" />
                        Bulk: {bulkTier}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 text-right">
                    <span
                      className={`font-medium ${hasBulkDiscount ? "text-green-700" : "text-steel-800"}`}
                    >
                      {formatCurrency(bulkPrice)}
                    </span>
                    {hasBulkDiscount && (
                      <div className="text-xs text-steel-400 line-through">
                        {formatCurrency(item.price)}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center border border-steel-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1.5 hover:bg-steel-50 transition-colors rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 text-steel-600" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (val > 0) updateQuantity(item.id, val);
                        }}
                        className="w-16 text-center text-sm font-medium border-x border-steel-300 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1.5 hover:bg-steel-50 transition-colors rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 text-steel-600" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right font-bold text-steel-800">
                    {formatCurrency(lineTotal)}
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-steel-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Shipping Calculator Toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowShippingCalc(!showShippingCalc)}
              className="text-sm text-primary-500 hover:text-primary-600 font-medium underline"
            >
              {showShippingCalc
                ? "Hide Shipping Calculator"
                : "Estimate Shipping Cost"}
            </button>
            {showShippingCalc && (
              <div className="mt-4">
                <ShippingCalculator />
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-steel-200 rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-heading font-bold text-steel-800 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-steel-600">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-steel-800">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-steel-600">
                <span>Est. Shipping</span>
                <span className="font-medium text-steel-800">
                  {cheapestShipping === 0
                    ? "FREE"
                    : `from ${formatCurrency(cheapestShipping)}`}
                </span>
              </div>

              <div className="flex justify-between text-steel-600">
                <span>Tax (8.25%)</span>
                <span className="font-medium text-steel-800">
                  {formatCurrency(tax)}
                </span>
              </div>

              <div className="border-t border-steel-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-steel-800">
                    Estimated Total
                  </span>
                  <span className="font-bold text-lg text-steel-900">
                    {formatCurrency(estimatedTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping discount notices */}
            {subtotal < 500 && (
              <div className="mt-4 bg-accent-50 border border-accent-200 rounded-lg p-3 text-xs text-accent-700">
                <p className="font-medium">Save on shipping!</p>
                <p>
                  Spend {formatCurrency(500 - subtotal)} more for 10% off
                  shipping.
                </p>
              </div>
            )}
            {subtotal >= 500 && subtotal < 1000 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
                <p className="font-medium">10% off shipping applied!</p>
                <p>
                  Spend {formatCurrency(1000 - subtotal)} more for free ground
                  shipping.
                </p>
              </div>
            )}
            {subtotal >= 1000 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
                <p className="font-medium">Free ground shipping applied!</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full border border-steel-300 hover:bg-steel-50 text-steel-700 font-medium py-3 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
