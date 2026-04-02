"use client";

import React from "react";
import Link from "next/link";
import {
  Bolt,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const productLinks = [
  { name: "Bolts & Screws", href: "/products?category=bolts-screws" },
  { name: "Nuts", href: "/products?category=nuts" },
  { name: "Washers", href: "/products?category=washers" },
  { name: "Anchors", href: "/products?category=anchors" },
  { name: "Rivets", href: "/products?category=rivets" },
  { name: "Pins & Clips", href: "/products?category=pins-clips" },
  { name: "Threaded Rod", href: "/products?category=threaded-rod" },
  { name: "Tools & Accessories", href: "/products?category=tools" },
];

const customerLinks = [
  { name: "My Account", href: "/dashboard" },
  { name: "Order Tracking", href: "/dashboard" },
  { name: "Request a Quote", href: "/contact" },
  { name: "Volume Pricing", href: "/products" },
  { name: "Returns & Exchanges", href: "/resources" },
  { name: "Shipping Information", href: "/resources" },
  { name: "FAQs", href: "/resources" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Quality Assurance", href: "/about" },
  { name: "Certifications", href: "/about" },
  { name: "Careers", href: "/about" },
  { name: "Blog & News", href: "/resources" },
  { name: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-[#1e40af]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                Stay Updated with Accutite
              </h3>
              <p className="text-blue-200 text-sm mt-1">
                Get product updates, industry news, and exclusive deals
                delivered to your inbox.
              </p>
            </div>
            <form
              className="flex w-full md:w-auto gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#f97316] hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="bg-[#1e40af] p-2 rounded-lg">
                <Bolt className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                ACCU<span className="text-[#f97316]">TITE</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Your trusted source for precision fasteners and industrial
              hardware. Serving professionals across aerospace, automotive,
              construction, and more since 1987.
            </p>
            <div className="space-y-2.5 text-sm">
              <a
                href="tel:1-800-555-0199"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#f97316]" />
                1-800-555-0199
              </a>
              <a
                href="mailto:sales@accutite.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#f97316]" />
                sales@accutite.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#f97316] mt-0.5" />
                <span>
                  1200 Industrial Parkway
                  <br />
                  Cleveland, OH 44135
                </span>
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-6 pt-5 border-t border-gray-700">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Certifications
              </p>
              <div className="flex flex-wrap gap-2">
                {["ISO 9001", "AS9100", "IATF 16949"].map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 text-xs bg-gray-800 px-2.5 py-1.5 rounded-md border border-gray-700"
                  >
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Product Categories
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Customer Service
            </h4>
            <ul className="space-y-2.5">
              {customerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Accutite Fasteners, Inc. All
            rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors"
            >
              YouTube
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link
              href="/resources"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/resources"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
