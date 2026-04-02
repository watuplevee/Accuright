"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bolt,
  Phone,
  Mail,
  FileText,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Wrench,
  CircleDot,
  Hexagon,
  Anchor,
  Cog,
  Disc,
  PenTool,
  Layers,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";

const productCategories = [
  {
    name: "Bolts & Screws",
    href: "/products?category=bolts-screws",
    icon: Bolt,
    description: "Hex bolts, cap screws, machine screws & more",
  },
  {
    name: "Nuts",
    href: "/products?category=nuts",
    icon: Hexagon,
    description: "Hex nuts, lock nuts, wing nuts, flange nuts",
  },
  {
    name: "Washers",
    href: "/products?category=washers",
    icon: Disc,
    description: "Flat, lock, spring & specialty washers",
  },
  {
    name: "Anchors",
    href: "/products?category=anchors",
    icon: Anchor,
    description: "Concrete, drywall, toggle & wedge anchors",
  },
  {
    name: "Rivets",
    href: "/products?category=rivets",
    icon: CircleDot,
    description: "Blind, solid, tubular & drive rivets",
  },
  {
    name: "Pins & Clips",
    href: "/products?category=pins-clips",
    icon: PenTool,
    description: "Cotter pins, dowel pins, retaining clips",
  },
  {
    name: "Threaded Rod",
    href: "/products?category=threaded-rod",
    icon: Layers,
    description: "Fully & partially threaded rod, studs",
  },
  {
    name: "Tools & Accessories",
    href: "/products?category=tools",
    icon: Wrench,
    description: "Installation tools, thread gauges, kits",
  },
];

const navLinks = [
  { name: "Solutions", href: "/products" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const handleMegaMenuEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(false), 200);
  };

  useEffect(() => {
    return () => {
      if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    };
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-[#1e40af] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10">
          <div className="hidden sm:flex items-center gap-6">
            <a
              href="tel:1-800-555-0199"
              className="flex items-center gap-1.5 hover:text-orange-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>1-800-555-0199</span>
            </a>
            <a
              href="mailto:sales@accutite.com"
              className="flex items-center gap-1.5 hover:text-orange-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>sales@accutite.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link
              href="/contact"
              className="flex items-center gap-1.5 hover:text-orange-300 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Request a Quote</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-[#1e40af] p-2 rounded-lg">
              <Bolt className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <span className="text-xl lg:text-2xl font-extrabold text-[#1e40af] tracking-tight">
                ACCU<span className="text-[#f97316]">TITE</span>
              </span>
              <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase leading-none hidden sm:block">
                Precision Fasteners
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Products Mega Menu */}
            <div
              ref={megaMenuRef}
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
              className="relative"
            >
              <Link
                href="/products"
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#1e40af] rounded-lg hover:bg-blue-50 transition-colors"
              >
                Products
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    megaMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[700px] bg-white rounded-xl shadow-2xl border border-gray-100 mt-1 p-6 grid grid-cols-2 gap-3 animate-slide-down">
                  {productCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-[#1e40af] transition-colors">
                          <Icon className="w-5 h-5 text-[#1e40af] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 group-hover:text-[#1e40af]">
                            {cat.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {cat.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                  <div className="col-span-2 border-t mt-2 pt-4">
                    <Link
                      href="/products"
                      className="text-sm font-semibold text-[#1e40af] hover:text-orange-500 transition-colors"
                    >
                      View All Products &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#1e40af] rounded-lg hover:bg-blue-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search, Cart, Account */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <div
                className={`flex items-center border rounded-lg transition-all duration-200 ${
                  searchFocused
                    ? "border-[#1e40af] ring-2 ring-blue-100 w-72"
                    : "border-gray-300 w-56"
                }`}
              >
                <Search className="w-4 h-4 text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="Search fasteners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="w-full py-2 px-2 text-sm outline-none bg-transparent"
                />
              </div>
              {searchFocused && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border mt-1 py-2 z-50 animate-slide-down">
                  <p className="px-4 py-2 text-xs text-gray-500">
                    Search results for &ldquo;{searchQuery}&rdquo;
                  </p>
                  {productCategories
                    .filter((cat) =>
                      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 4)
                    .map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="block px-4 py-2 text-sm hover:bg-blue-50 text-gray-700"
                      >
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {cat.description}
                        </span>
                      </Link>
                    ))}
                  <div className="border-t mt-1 pt-1">
                    <Link
                      href={`/products?search=${encodeURIComponent(searchQuery)}`}
                      className="block px-4 py-2 text-sm hover:bg-blue-50 text-[#1e40af] font-medium"
                    >
                      Search all products for &ldquo;{searchQuery}&rdquo; &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-[#1e40af] hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#f97316] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/auth"
              className="hidden sm:flex items-center gap-1.5 p-2 text-gray-600 hover:text-[#1e40af] hover:bg-blue-50 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium hidden lg:inline">
                Account
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#1e40af] hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {/* Mobile Search */}
            <div className="flex items-center border border-gray-300 rounded-lg mb-4">
              <Search className="w-4 h-4 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Search fasteners..."
                className="w-full py-2.5 px-2 text-sm outline-none"
              />
            </div>

            {/* Products Accordion */}
            <div>
              <button
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-blue-50 rounded-lg"
              >
                Products
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileProductsOpen && (
                <div className="pl-4 space-y-1 mt-1">
                  {productCategories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-[#1e40af] hover:bg-blue-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link
                    href="/products"
                    className="block px-3 py-2 text-sm font-medium text-[#1e40af] hover:bg-blue-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View All Products &rarr;
                  </Link>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-blue-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t pt-3 mt-3 space-y-2">
              <Link
                href="/auth"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-blue-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                Account / Login
              </Link>
              <a
                href="tel:1-800-555-0199"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:bg-blue-50 rounded-lg"
              >
                <Phone className="w-4 h-4" />
                1-800-555-0199
              </a>
              <a
                href="mailto:sales@accutite.com"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:bg-blue-50 rounded-lg"
              >
                <Mail className="w-4 h-4" />
                sales@accutite.com
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
