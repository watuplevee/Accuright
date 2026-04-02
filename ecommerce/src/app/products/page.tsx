"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ShoppingCart,
  Package,
  X,
  ChevronRight,
  Filter,
  Grid3X3,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
} from "lucide-react";
import { products, categories } from "@/data/products";
import { Product } from "@/types";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, calculateBulkPrice } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  "Bolts & Screws": "bg-blue-500",
  Nuts: "bg-orange-500",
  Washers: "bg-green-500",
  Anchors: "bg-purple-500",
  Rivets: "bg-red-500",
  "Pins & Clips": "bg-teal-500",
  "Threaded Rod": "bg-indigo-500",
  "Tools & Accessories": "bg-amber-500",
};

const CATEGORY_BG: Record<string, string> = {
  "Bolts & Screws": "bg-blue-50 border-blue-200 hover:border-blue-400",
  Nuts: "bg-orange-50 border-orange-200 hover:border-orange-400",
  Washers: "bg-green-50 border-green-200 hover:border-green-400",
  Anchors: "bg-purple-50 border-purple-200 hover:border-purple-400",
  Rivets: "bg-red-50 border-red-200 hover:border-red-400",
  "Pins & Clips": "bg-teal-50 border-teal-200 hover:border-teal-400",
  "Threaded Rod": "bg-indigo-50 border-indigo-200 hover:border-indigo-400",
  "Tools & Accessories": "bg-amber-50 border-amber-200 hover:border-amber-400",
};

type SortOption = "price-asc" | "price-desc" | "name-asc";

export default function ProductsPage() {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const isSearchActive = searchQuery.trim().length > 0;

  const allMaterials = useMemo(
    () => [...new Set(products.map((p) => p.material).filter(Boolean))].sort(),
    []
  );
  const allGrades = useMemo(
    () => [...new Set(products.map((p) => p.grade).filter(Boolean))].sort(),
    []
  );

  const filteredProducts = useMemo(() => {
    if (!isSearchActive) return [];

    const query = searchQuery.toLowerCase();
    let result = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
    );

    if (selectedMaterials.length > 0) {
      result = result.filter((p) => selectedMaterials.includes(p.material));
    }
    if (selectedGrades.length > 0) {
      result = result.filter((p) => selectedGrades.includes(p.grade));
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [searchQuery, selectedMaterials, selectedGrades, sortBy, isSearchActive]);

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const toggleGrade = (grade: string) => {
    setSelectedGrades((prev) =>
      prev.includes(grade)
        ? prev.filter((g) => g !== grade)
        : [...prev, grade]
    );
  };

  const getQuantity = (id: string) => quantities[id] || 1;

  const setQuantity = (id: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = getQuantity(product.id);
    addItem({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: qty,
      weight: product.weight,
    });
  };

  const getCategorySlug = (name: string) => {
    const cat = categories.find((c) => c.name === name);
    return cat?.slug || name.toLowerCase().replace(/[&\s]+/g, "-");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Products
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Browse our complete catalog of industrial fasteners
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium">Products</span>
        </nav>

        {!isSearchActive ? (
          /* Category Cards Grid */
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products/${cat.slug}`}
                  className={`group relative border rounded-xl p-6 transition-all duration-200 ${
                    CATEGORY_BG[cat.name] || "bg-gray-50 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      CATEGORY_COLORS[cat.name] || "bg-gray-500"
                    }`}
                  >
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      {cat.count} products
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
              {(selectedMaterials.length + selectedGrades.length) > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {selectedMaterials.length + selectedGrades.length}
                </span>
              )}
            </button>

            {/* Filter Sidebar */}
            <aside
              className={`w-full lg:w-64 flex-shrink-0 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              <div className="bg-white rounded-xl border p-5 sticky top-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </h3>
                  {(selectedMaterials.length + selectedGrades.length) > 0 && (
                    <button
                      onClick={() => {
                        setSelectedMaterials([]);
                        setSelectedGrades([]);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Material Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Material
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allMaterials.map((material) => (
                      <label
                        key={material}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(material)}
                          onChange={() => toggleMaterial(material)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {material}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Grade Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allGrades.map((grade) => (
                      <label
                        key={grade}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGrades.includes(grade)}
                          onChange={() => toggleGrade(grade)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {grade}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  result{filteredProducts.length !== 1 ? "s" : ""} for &quot;
                  {searchQuery}&quot;
                </p>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="name-asc">Name A-Z</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl border p-12 text-center">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No products found
                  </h3>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => {
                    const qty = getQuantity(product.id);
                    const bulkPrice = calculateBulkPrice(product.price, qty);
                    const categorySlug = getCategorySlug(product.category);

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl border hover:shadow-md transition-shadow"
                      >
                        {/* Placeholder Image */}
                        <Link href={`/products/${categorySlug}/${product.id}`}>
                          <div
                            className={`h-40 rounded-t-xl flex items-center justify-center ${
                              CATEGORY_COLORS[product.category] || "bg-gray-400"
                            } bg-opacity-10`}
                          >
                            <Package
                              className={`h-16 w-16 ${
                                CATEGORY_COLORS[product.category] || "text-gray-400"
                              } opacity-30`}
                            />
                          </div>
                        </Link>

                        <div className="p-4">
                          <Link href={`/products/${categorySlug}/${product.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">
                            SKU: {product.sku}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              {product.material}
                            </span>
                            {product.inStock ? (
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

                          <div className="mt-3">
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(bulkPrice)}
                            </span>
                            {product.bulkPricing.length > 0 && (
                              <span className="text-xs text-gray-400 ml-1">
                                Starting at{" "}
                                {formatCurrency(
                                  product.bulkPricing[product.bulkPricing.length - 1]?.price ??
                                    product.price
                                )}
                              </span>
                            )}
                          </div>

                          {/* Quantity + Add to Cart */}
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => setQuantity(product.id, qty - 1)}
                                className="p-1.5 hover:bg-gray-100 rounded-l-lg"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <input
                                type="number"
                                min={1}
                                value={qty}
                                onChange={(e) =>
                                  setQuantity(product.id, parseInt(e.target.value) || 1)
                                }
                                className="w-12 text-center text-sm border-x py-1 focus:outline-none"
                              />
                              <button
                                onClick={() => setQuantity(product.id, qty + 1)}
                                className="p-1.5 hover:bg-gray-100 rounded-r-lg"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
