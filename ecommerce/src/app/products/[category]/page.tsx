"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  Package,
  Filter,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { products, categories } from "@/data/products";
import { Product } from "@/types";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, calculateBulkPrice } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

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

const PLACEHOLDER_COLORS: Record<string, string> = {
  "Bolts & Screws": "from-blue-100 to-blue-200",
  Nuts: "from-orange-100 to-orange-200",
  Washers: "from-green-100 to-green-200",
  Anchors: "from-purple-100 to-purple-200",
  Rivets: "from-red-100 to-red-200",
  "Pins & Clips": "from-teal-100 to-teal-200",
  "Threaded Rod": "from-indigo-100 to-indigo-200",
  "Tools & Accessories": "from-amber-100 to-amber-200",
};

type SortOption = "price-asc" | "price-desc" | "name-asc";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const { addItem } = useCart();

  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const category = categories.find((c) => c.slug === categorySlug);
  const categoryName = category?.name || categorySlug;

  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === categoryName),
    [categoryName]
  );

  const allMaterials = useMemo(
    () =>
      [...new Set(categoryProducts.map((p) => p.material).filter(Boolean))].sort(),
    [categoryProducts]
  );

  const allGrades = useMemo(
    () =>
      [...new Set(categoryProducts.map((p) => p.grade).filter(Boolean))].sort(),
    [categoryProducts]
  );

  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

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
  }, [categoryProducts, selectedMaterials, selectedGrades, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
    setCurrentPage(1);
  };

  const toggleGrade = (grade: string) => {
    setSelectedGrades((prev) =>
      prev.includes(grade)
        ? prev.filter((g) => g !== grade)
        : [...prev, grade]
    );
    setCurrentPage(1);
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

  const placeholderGradient =
    PLACEHOLDER_COLORS[categoryName] || "from-gray-100 to-gray-200";
  const iconColor = CATEGORY_COLORS[categoryName] || "bg-gray-500";

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Category Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            The category you are looking for does not exist.
          </p>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}
            >
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {categoryName}
              </h1>
              {category.description && (
                <p className="mt-1 text-sm text-gray-500 max-w-2xl">
                  {category.description}
                </p>
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
          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium">{categoryName}</span>
        </nav>

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
                      setCurrentPage(1);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Material Filter */}
              {allMaterials.length > 0 && (
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
              )}

              {/* Grade Filter */}
              {allGrades.length > 0 && (
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
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort & Count Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>
                {" - "}
                <span className="font-medium text-gray-900">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No products match your filters
                </h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your filter criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedProducts.map((product) => {
                  const qty = getQuantity(product.id);
                  const bulkPrice = calculateBulkPrice(product.price, qty);

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border hover:shadow-md transition-shadow flex flex-col"
                    >
                      {/* Colored Placeholder */}
                      <Link href={`/products/${categorySlug}/${product.id}`}>
                        <div
                          className={`h-44 rounded-t-xl bg-gradient-to-br ${placeholderGradient} flex items-center justify-center relative`}
                        >
                          <Package className="h-16 w-16 text-gray-400 opacity-40" />
                          {!product.inStock && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                              Out of Stock
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-4 flex flex-col flex-1">
                        <Link href={`/products/${categorySlug}/${product.id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          SKU: {product.sku}
                        </p>

                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                            {product.material}
                          </span>
                          {product.inStock ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle2 className="h-3 w-3" />
                              In Stock ({product.stockQty})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-red-500">
                              <AlertCircle className="h-3 w-3" />
                              Out of Stock
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex-1">
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(bulkPrice)}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">
                            / {product.unitOfMeasure || "ea"}
                          </span>
                          {product.bulkPricing.length > 0 && (
                            <p className="text-xs text-green-600 mt-0.5">
                              Starting at{" "}
                              {formatCurrency(
                                product.bulkPricing[product.bulkPricing.length - 1]?.price ??
                                  product.price
                              )}{" "}
                              for bulk orders
                            </p>
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
                                setQuantity(
                                  product.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-14 text-center text-sm border-x py-1.5 focus:outline-none"
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
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, idx, arr) => {
                      const showEllipsis =
                        idx > 0 && page - arr[idx - 1] > 1;
                      return (
                        <span key={page} className="flex items-center gap-1">
                          {showEllipsis && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        </span>
                      );
                    })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
