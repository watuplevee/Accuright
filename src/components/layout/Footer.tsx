'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const shopLinks = [
  { label: 'New Arrivals', href: '/shop/new-arrivals' },
  { label: 'Collections', href: '/collections' },
  { label: 'Campaign 2027', href: '/campaign' },
  { label: 'Sale', href: '/shop/sale' },
  { label: 'All Products', href: '/shop' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Press', href: '/press' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Terms of Service', href: '/legal/terms' },
  { label: 'Cookie Policy', href: '/legal/cookies' },
  { label: 'Accessibility', href: '/legal/accessibility' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/accuright',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    href: 'https://twitter.com/accuright',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4L20 20M20 4L4 20" stroke="none" />
        <path d="M3 3h7l11 18H14L3 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M3 21l7-7M14 10l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/accuright',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 10v7M7 7.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 17v-3.5a2.5 2.5 0 0 1 5 0V17M11 10v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success('You\'re on the list!');
        setEmail('');
      } else {
        toast.error('Something went wrong. Try again.');
      }
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-brand-black border-t border-brand-white/10">
      {/* Main Footer */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <Link
                href="/"
                className="font-display text-2xl font-black tracking-tight text-brand-white hover:text-brand-accent transition-colors"
              >
                ACCURIGHT
              </Link>
              <p className="mt-2 text-sm text-brand-muted font-body">
                Step Into 2027
              </p>
              <p className="mt-4 text-sm text-brand-white/50 leading-relaxed max-w-xs">
                The future of sneaker culture. Curated drops, editorial design, and the boldest kicks on the planet.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-brand-white/10 text-brand-white/50 hover:text-brand-white hover:border-brand-white/30 hover:bg-brand-white/5 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <form onSubmit={handleNewsletter} className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-white/50">
                Newsletter
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 h-10 bg-brand-slate border border-brand-white/10 rounded-lg px-3 text-sm text-brand-white placeholder:text-brand-muted focus:outline-none focus:border-brand-accent/60 focus:ring-2 focus:ring-brand-accent/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-10 px-4 bg-brand-accent text-brand-white text-sm font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? '...' : 'Join'}
                </button>
              </div>
            </form>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-white/40 mb-5">
              Shop
            </h3>
            <ul className="flex flex-col gap-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-white/60 hover:text-brand-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-white/40 mb-5">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-white/60 hover:text-brand-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-white/40 mb-5">
              Legal
            </h3>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-white/60 hover:text-brand-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-white/10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-white/30">
            &copy; {new Date().getFullYear()} Accuright. All rights reserved.
          </p>
          <p className="text-xs text-brand-white/20">
            Built for the future.{' '}
            <span className="text-brand-neon/50">#AccurightRise2027</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
