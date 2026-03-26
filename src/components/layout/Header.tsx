'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ShoppingBag, Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import CartDrawer from '@/components/cart/CartDrawer';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Campaign 2027', href: '/campaign' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<IntersectionObserver | null>(null);
  const { itemCount, openCart } = useCart();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel');
    if (sentinel) {
      heroRef.current = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { threshold: 0 }
      );
      heroRef.current.observe(sentinel);
      return () => heroRef.current?.disconnect();
    }

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'bg-brand-black/95 backdrop-blur-md border-b border-brand-white/10 shadow-[0_1px_0_rgba(245,245,240,0.05)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="font-display text-xl md:text-2xl font-black tracking-tight text-brand-white hover:text-brand-accent transition-colors duration-200"
            >
              ACCURIGHT
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold tracking-wide text-brand-white/70 hover:text-brand-white transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-accent group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-brand-white/70 hover:text-brand-white hover:bg-brand-white/5 transition-all duration-200"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-brand-white/70 hover:text-brand-white hover:bg-brand-white/5 transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-brand-white/70 hover:text-brand-white hover:bg-brand-white/5 transition-all duration-200"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-brand-accent text-brand-white text-2xs font-bold rounded-full px-1 animate-scale-in">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-brand-white/70 hover:text-brand-white hover:bg-brand-white/5 transition-all duration-200"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-4 animate-slide-down">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
                />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search sneakers, brands, collections..."
                  className="w-full h-11 bg-brand-slate border border-brand-white/10 rounded-xl pl-10 pr-4 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-accent/60 focus:ring-2 focus:ring-brand-accent/20 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-brand-black/98 backdrop-blur-xl border-t border-brand-white/10 animate-slide-down">
            <nav className="flex flex-col px-4 py-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center h-12 px-3 text-base font-semibold text-brand-white/80 hover:text-brand-white hover:bg-brand-white/5 rounded-xl transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-brand-white/10">
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center h-11 w-full bg-brand-accent text-brand-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
