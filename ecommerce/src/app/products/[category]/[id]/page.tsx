"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ShoppingCart,
  Package,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  Shield,
  Award,
  Tag,
  Layers,
  Info,
  Table,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { products, categories } from "@/data/products";
import { Product } from "@/types";
import { useCart } from "@/lib/cart-context";
import {
  formatCurrency,
  calculateBulkPrice,
  getBulkTier,
} from "@/lib/utils";

const PLACEHOLDER_COLORS: Record<string, string> = {
  "Bolts & Screws": "from-blue-100 to-blue-300",
  Nuts: "from-orange-100 to-orange-300",
  Washers: "from-green-100 to-green-300",
  Anchors: "from-purple-100 to-purple-300",
  Rivets: "from-red-100 to-red-300",
  "Pins & Clips": "from-teal-100 to-teal-300",
  "Threaded Rod": "from-indigo-100 to-indigo-300",
  "Tools & Accessories": "from-amber-100 to-amber-300",
};

const BULK_TIERS = [
  { minQty: 1, label: "1 - 24", discount: 0 },
  { minQty: 25, label: "25 - 99", discount: 0.05 },
  { minQty: 100, label: "100 - 499", discount: 0.1 },
  { minQty: 500, label: "500 - 999", discount: 0.15 },
  { minQty: 1000, label: "1,000 - 4,999", discount: 0.2 },
  { minQty: 5000, label: "5,000 - 9,999", discount: 0.25 },
  { minQty: 10000, label: "10,000+", discount: 0.3 },
];

type TabKey = "description" | "specifications" | "bulk-pricing";

export default function ProductDetailPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const productId = params.id as string;
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const product = products.find((p) => p.id === productId);
  const category = categories.find((c) => c.slug === categorySlug);
  const categoryName = category?.name || product?.category || categorySlug;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const bulkPrice = calculateBulkPrice(product.price, quantity);
  const bulkTier = getBulkTier(quantity);
  const totalPrice = bulkPrice * quantity;
  const placeholderGradient =
    PLACEHOLDER_COLORS[product.category] || "from-gray-100 to-gray-300";

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity,
      weight: product.weight,
    });
  };

  const getCategorySlug = (name: string) => {
    const cat = categories.find((c) => c.name === name);
    return cat?.slug || name.toLowerCase().replace(/[&\s]+/g, "-");
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "description", label: "Description", icon: <Info className="h-4 w-4" /> },
    { key: "specifications", label: "Specifications", icon: <Table className="h-4 w-4" /> },
    { key: "bulk-pricing", label: "Bulk Pricing", icon: <DollarSign className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-gray-500 flex-wrap gap-y-1">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
            <Link href="/products" className="hover:text-blue-600">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
            <Link
              href={`/products/${categorySlug}`}
              className="hover:text-blue-600"
            >
              {categoryName}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Main Section */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image / Placeholder */}
            <div
              className={`bg-gradient-to-br ${placeholderGradient} flex items-center justify-center min-h-[300px] lg:min-h-[500px] relative`}
            >
              <Package className="h-32 w-32 text-gray-400 opacity-30" />
              {!product.inStock && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-8 flex flex-col">
              <div className="flex-1">
                {/* Name & SKU */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-400 mt-1">SKU: {product.sku}</p>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.material && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      <Layers className="h-3 w-3" />
                      {product.material}
                    </span>
                  )}
                  {product.finish && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      <Shield className="h-3 w-3" />
                      {product.finish}
                    </span>
                  )}
                  {product.grade && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                      <Award className="h-3 w-3" />
                      Grade {product.grade}
                    </span>
                  )}
                  {product.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {cert}
                    </span>
                  ))}
                </div>

                {/* Stock Status */}
                <div className="mt-4 flex items-center gap-2">
                  {product.inStock ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-700">
                        In Stock
                      </span>
                      <span className="text-sm text-gray-400">
                        ({product.stockQty.toLocaleString()} available)
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium text-red-600">
                        Out of Stock
                      </span>
                    </>
                  )}
                </div>

                {/* Bulk Pricing Table (compact) */}
                <div className="mt-5 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-blue-600" />
                    Bulk Pricing
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BULK_TIERS.map((tier) => {
                      const tierPrice = product.price * (1 - tier.discount);
                      const isActive =
                        quantity >= tier.minQty &&
                        (tier.minQty === 10000 ||
                          quantity <
                            (BULK_TIERS.find((t) => t.minQty > tier.minQty)
                              ?.minQty ?? Infinity));
                      return (
                        <div
                          key={tier.minQty}
                          className={`text-center p-2 rounded-lg border text-xs ${
                            isActive
                              ? "bg-blue-50 border-blue-300"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <p className="text-gray-500">{tier.label}</p>
                          <p className="font-bold text-gray-900 mt-0.5">
                            {formatCurrency(tierPrice)}
                          </p>
                          {tier.discount > 0 && (
                            <p className="text-green-600 font-medium">
                              {(tier.discount * 100).toFixed(0)}% off
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Specifications Preview */}
                {Object.keys(product.specs).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Key Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {Object.entries(product.specs)
                        .slice(0, 6)
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs py-1 border-b border-gray-100">
                            <span className="text-gray-500">{key}</span>
                            <span className="text-gray-900 font-medium">{value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Add to Cart */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(bulkPrice)}
                  </span>
                  <span className="text-sm text-gray-400">
                    / {product.unitOfMeasure || "ea"}
                  </span>
                  {bulkTier && (
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {bulkTier}
                    </span>
                  )}
                </div>
                {quantity > 1 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Total: {formatCurrency(totalPrice)} for {quantity} units
                  </p>
                )}

                <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Quantity Input */}
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-3 hover:bg-gray-100 rounded-l-lg"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={product.stockQty || undefined}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-20 text-center text-sm font-medium border-x py-3 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-3 hover:bg-gray-100 rounded-r-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 bg-white rounded-xl border overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.threadSize && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Thread Size</p>
                        <p className="text-sm text-gray-500">{product.threadSize}</p>
                      </div>
                    </div>
                  )}
                  {product.length && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Length</p>
                        <p className="text-sm text-gray-500">{product.length}</p>
                      </div>
                    </div>
                  )}
                  {product.diameter && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Diameter</p>
                        <p className="text-sm text-gray-500">{product.diameter}</p>
                      </div>
                    </div>
                  )}
                  {product.headType && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Head Type</p>
                        <p className="text-sm text-gray-500">{product.headType}</p>
                      </div>
                    </div>
                  )}
                  {product.driveType && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Drive Type</p>
                        <p className="text-sm text-gray-500">{product.driveType}</p>
                      </div>
                    </div>
                  )}
                  {product.weight > 0 && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Weight</p>
                        <p className="text-sm text-gray-500">
                          {product.weight} lbs per {product.unitOfMeasure || "unit"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                {Object.keys(product.specs).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left text-sm font-semibold text-gray-900 py-3 pr-4">
                            Property
                          </th>
                          <th className="text-left text-sm font-semibold text-gray-900 py-3">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(product.specs).map(
                          ([key, value], idx) => (
                            <tr
                              key={key}
                              className={
                                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
                            >
                              <td className="text-sm text-gray-600 py-3 pr-4 pl-3 font-medium">
                                {key}
                              </td>
                              <td className="text-sm text-gray-900 py-3 pl-3">
                                {value}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No specifications available for this product.
                  </p>
                )}
              </div>
            )}

            {activeTab === "bulk-pricing" && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Save more when you buy in bulk. Discounts are automatically
                  applied based on quantity.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left text-sm font-semibold text-gray-900 py-3 pr-4">
                          Quantity
                        </th>
                        <th className="text-left text-sm font-semibold text-gray-900 py-3 pr-4">
                          Unit Price
                        </th>
                        <th className="text-left text-sm font-semibold text-gray-900 py-3 pr-4">
                          Discount
                        </th>
                        <th className="text-left text-sm font-semibold text-gray-900 py-3">
                          Savings per Unit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {BULK_TIERS.map((tier, idx) => {
                        const tierPrice =
                          product.price * (1 - tier.discount);
                        const savings = product.price - tierPrice;
                        return (
                          <tr
                            key={tier.minQty}
                            className={
                              idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }
                          >
                            <td className="text-sm text-gray-900 py-3 pr-4 pl-3 font-medium">
                              {tier.label}
                            </td>
                            <td className="text-sm text-gray-900 py-3 pr-4 pl-3 font-semibold">
                              {formatCurrency(tierPrice)}
                            </td>
                            <td className="text-sm py-3 pr-4 pl-3">
                              {tier.discount > 0 ? (
                                <span className="text-green-600 font-medium">
                                  {(tier.discount * 100).toFixed(0)}% off
                                </span>
                              ) : (
                                <span className="text-gray-400">
                                  Base price
                                </span>
                              )}
                            </td>
                            <td className="text-sm py-3 pl-3">
                              {savings > 0 ? (
                                <span className="text-green-600 font-medium">
                                  {formatCurrency(savings)}
                                </span>
                              ) : (
                                <span className="text-gray-400">--</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${getCategorySlug(related.category)}/${related.id}`}
                  className="bg-white rounded-xl border hover:shadow-md transition-shadow group"
                >
                  <div
                    className={`h-36 rounded-t-xl bg-gradient-to-br ${
                      PLACEHOLDER_COLORS[related.category] ||
                      "from-gray-100 to-gray-300"
                    } flex items-center justify-center`}
                  >
                    <Package className="h-12 w-12 text-gray-400 opacity-30" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {related.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      SKU: {related.sku}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">
                        {formatCurrency(related.price)}
                      </span>
                      {related.inStock ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle2 className="h-3 w-3" />
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
