'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

export interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full' | 'none';
  width?: string | number;
  height?: string | number;
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = 'md',
  width,
  height,
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-brand-white/5',
        roundedClasses[rounded],
        className
      )}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer"
      />
    </div>
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <div className="flex flex-col gap-3">
    <Skeleton className="w-full aspect-[4/5]" rounded="lg" />
    <div className="flex flex-col gap-2 px-1">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

export default Skeleton;
