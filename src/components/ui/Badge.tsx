'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps {
  variant?: 'new' | 'limited' | 'sale' | 'default';
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  new: 'bg-brand-neon text-brand-black font-bold tracking-widest',
  limited: 'bg-brand-accent text-brand-white font-bold tracking-widest shadow-glow',
  sale: 'bg-red-600 text-white font-bold tracking-widest',
  default: 'bg-brand-white/10 text-brand-white/80 border border-brand-white/20',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 text-2xs uppercase rounded-sm',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
