"use client";

import { useState, useMemo } from "react";
import {
  Truck,
  CreditCard,
  ClipboardCheck,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
  Package,
  Shield,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import {
  formatCurrency,
  getShippingOptions,
  getShippingRates,
} from "@/lib/utils";

interface ShippingInfo {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiry: string;
  cvv: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  poNumber: string;
  usePO: boolean;
  sameAsShipping: boolean;
}

interface ShippingOption {
  carrier: string;
  service: string;
  estimatedDays: number;
  price: number;
  tracking: string;
}

const STEPS = [
  { label: "Shipping Info", icon: MapPin },
  { label: "Shipping Method", icon: Truck },
  { label: "Payment", icon: CreditCard },
  { label: "Review", icon: ClipboardCheck },
];

const TAX_RATE = 0.0825;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loadingRates, setLoadingRates] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    poNumber: "",
    usePO: false,
    sameAsShipping: true,
  });

  const totalWeight = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.weight || 0.1) * item.quantity,
        0
      ),
    [items]
  );

  const shippingCost = selectedShipping?.price ?? 0;
  const taxAmount = subtotal * TAX_RATE;
  const orderTotal = subtotal + shippingCost + taxAmount;

  const groupedShipping = useMemo(() => {
    const groups: Record<string, ShippingOption[]> = {};
    shippingOptions.forEach((opt) => {
      if (!groups[opt.carrier]) groups[opt.carrier] = [];
      groups[opt.carrier].push(opt);
    });
    return groups;
  }, [shippingOptions]);

  async function fetchShippingRates() {
    setLoadingRates(true);
    try {
      const rates = getShippingRates(shippingInfo.zip, totalWeight);
      const options = getShippingOptions(items);
      const allOptions = rates.length > 0 ? rates : options;

      const adjusted = allOptions.map((opt: ShippingOption) => {
        let price = opt.price;
        if (
          subtotal >= 1000 &&
          (opt.service.toLowerCase().includes("ground") ||
            opt.service.toLowerCase().includes("ecommerce"))
        ) {
          price = 0;
        } else if (subtotal >= 500) {
          price = Math.round(price * 0.9 * 100) / 100;
        }
        return { ...opt, price };
      });

      setShippingOptions(adjusted);
    } catch {
      const options = getShippingOptions(items);
      setShippingOptions(options);
    } finally {
      setLoadingRates(false);
    }
  }

  function handleNextStep() {
    if (currentStep === 0) {
      fetchShippingRates();
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  }

  function handlePrevStep() {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  function handlePlaceOrder() {
    const mockOrder = `AT-${Date.now().toString().slice(-8)}`;
    const mockTracking = `1Z${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setOrderNumber(mockOrder);
    setTrackingNumber(mockTracking);
    setOrderPlaced(true);
    clearCart();
  }

  function isStep1Valid() {
    return (
      shippingInfo.companyName.trim() !== "" &&
      shippingInfo.contactName.trim() !== "" &&
      shippingInfo.email.trim() !== "" &&
      shippingInfo.phone.trim() !== "" &&
      shippingInfo.address.trim() !== "" &&
      shippingInfo.city.trim() !== "" &&
      shippingInfo.state.trim() !== "" &&
      shippingInfo.zip.trim() !== ""
    );
  }

  function isStep2Valid() {
    return selectedShipping !== null;
  }

  function isStep3Valid() {
    if (paymentInfo.usePO) return paymentInfo.poNumber.length > 0;
    return (
      paymentInfo.cardNumber.length >= 15 &&
      paymentInfo.expiry.length >= 4 &&
      paymentInfo.cvv.length >= 3
    );
  }

  // Order Confirmation
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. A confirmation email has been sent.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Number</span>
              <span className="font-semibold text-gray-900">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tracking Number</span>
              <span className="font-semibold text-gray-900">
                {trackingNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Delivery</span>
              <span className="font-semibold text-gray-900">
                {selectedShipping
                  ? `${selectedShipping.estimatedDays} business days`
                  : "3-7 business days"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(orderTotal)}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
            >
              Continue Shopping
            </a>
            <a
              href="/account/orders"
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition text-center"
            >
              View Orders
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-6">
            Add items to your cart before proceeding to checkout.
          </p>
          <a
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Step Indicator Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isComplete = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div key={step.label} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition ${
                        isComplete
                          ? "bg-green-500 text-white"
                          : isCurrent
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isComplete ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium hidden sm:block ${
                        isCurrent
                          ? "text-blue-600"
                          : isComplete
                            ? "text-green-600"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-3 ${
                        idx < currentStep ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Shipping Info */}
        {currentStep === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={shippingInfo.companyName}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      companyName: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="Acme Manufacturing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={shippingInfo.contactName}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      contactName: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, email: e.target.value })
                  }
                  className={inputClass}
                  placeholder="john@acme.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, phone: e.target.value })
                  }
                  className={inputClass}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={shippingInfo.address}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      address: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="123 Industrial Blvd, Suite 100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, city: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Los Angeles"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.state}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        state: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="CA"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.zip}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, zip: e.target.value })
                    }
                    className={inputClass}
                    placeholder="90001"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNextStep}
                disabled={!isStep1Valid()}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Shipping
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Shipping Method */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Shipping Method
            </h2>
            {subtotal >= 1000 && (
              <p className="text-green-600 text-sm font-medium mb-2">
                Free ground shipping on orders over $1,000!
              </p>
            )}
            {subtotal >= 500 && subtotal < 1000 && (
              <p className="text-blue-600 text-sm font-medium mb-2">
                10% off shipping on orders over $500!
              </p>
            )}
            <p className="text-gray-500 text-sm mb-6">
              Shipping to {shippingInfo.city}, {shippingInfo.state}{" "}
              {shippingInfo.zip}
            </p>

            {loadingRates ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
                <span className="text-gray-500">
                  Calculating shipping rates...
                </span>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedShipping).map(([carrier, options]) => (
                  <div key={carrier}>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      {carrier}
                    </h3>
                    <div className="space-y-2">
                      {options.map((opt, idx) => {
                        const key = `${carrier}-${idx}`;
                        const isSelected =
                          selectedShipping?.carrier === opt.carrier &&
                          selectedShipping?.service === opt.service;
                        return (
                          <label
                            key={key}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shipping"
                                checked={isSelected}
                                onChange={() => setSelectedShipping(opt)}
                                className="w-4 h-4 text-blue-600"
                              />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {opt.service}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {opt.estimatedDays} business day
                                  {opt.estimatedDays !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {opt.price === 0 ? (
                                <span className="text-green-600">FREE</span>
                              ) : (
                                formatCurrency(opt.price)
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={!isStep2Valid()}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Payment Information
            </h2>

            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentInfo.usePO}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      usePO: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Pay with Purchase Order (PO)
                  </span>
                </div>
              </label>
            </div>

            {paymentInfo.usePO ? (
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PO Number *
                </label>
                <input
                  type="text"
                  value={paymentInfo.poNumber}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      poNumber: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="PO-12345"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Net 30 terms. Subject to credit approval.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardNumber: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="4111 1111 1111 1111"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.expiry}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            expiry: e.target.value,
                          })
                        }
                        className={inputClass}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cvv: e.target.value,
                          })
                        }
                        className={inputClass}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t pt-6">
                  <label className="flex items-center gap-2 mb-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentInfo.sameAsShipping}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          sameAsShipping: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Billing address same as shipping
                    </span>
                  </label>

                  {!paymentInfo.sameAsShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Billing Address
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.billingAddress}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              billingAddress: e.target.value,
                            })
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.billingCity}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              billingCity: e.target.value,
                            })
                          }
                          className={inputClass}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.billingState}
                            onChange={(e) =>
                              setPaymentInfo({
                                ...paymentInfo,
                                billingState: e.target.value,
                              })
                            }
                            className={inputClass}
                            maxLength={2}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Zip
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.billingZip}
                            onChange={(e) =>
                              setPaymentInfo({
                                ...paymentInfo,
                                billingZip: e.target.value,
                              })
                            }
                            className={inputClass}
                            maxLength={10}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Your payment information is encrypted and secure.</span>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={!isStep3Valid()}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Order
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
              Order Review
            </h2>

            {/* Items */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Items ({items.length})
              </h3>
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        SKU: {item.sku} &middot; Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info Summary */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Ship To
                </h3>
                <p className="text-gray-900 font-medium">
                  {shippingInfo.companyName}
                </p>
                <p className="text-gray-600 text-sm">
                  {shippingInfo.contactName}
                </p>
                <p className="text-gray-600 text-sm">{shippingInfo.address}</p>
                <p className="text-gray-600 text-sm">
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {shippingInfo.email} | {shippingInfo.phone}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Shipping Method
                </h3>
                {selectedShipping && (
                  <>
                    <p className="text-gray-900 font-medium">
                      {selectedShipping.carrier} {selectedShipping.service}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedShipping.estimatedDays} business days
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedShipping.price === 0
                        ? "FREE"
                        : formatCurrency(selectedShipping.price)}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Payment
              </h3>
              {paymentInfo.usePO ? (
                <p className="text-gray-900 font-medium">
                  Purchase Order: {paymentInfo.poNumber}
                </p>
              ) : (
                <p className="text-gray-900 font-medium">
                  Card ending in {paymentInfo.cardNumber.slice(-4)}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    formatCurrency(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8.25%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(orderTotal)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <Package className="w-5 h-5" />
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
