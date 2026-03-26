'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-brand-accent text-brand-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-10 gap-2">
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-center">
            FREE SHIPPING OVER $150
            <span className="hidden sm:inline text-brand-white/70 mx-2">|</span>
            <span className="hidden sm:inline">USE CODE:</span>
            <span className="hidden sm:inline font-black ml-1">RISE2027</span>
            <span className="text-brand-white/70 mx-2">|</span>
            <Link
              href="/shop/new-arrivals"
              className="underline underline-offset-2 hover:text-brand-white/80 transition-colors"
            >
              Shop New Arrivals →
            </Link>
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md hover:bg-brand-white/20 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
