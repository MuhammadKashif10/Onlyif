'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getSafeImageUrl } from '@/utils/imageUtils';
import { StatusBadge } from '@/components/reusable';
import { formatCurrencyCompact } from '@/utils/currency';

type PropertyStatus = 'pending' | 'private' | 'public' | 'sold' | 'withdrawn';

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  price: number | null | undefined;
  beds: number | null | undefined;
  baths: number | null | undefined;
  size: number | null | undefined; // This will now be in square meters
  image: string;
  status?: PropertyStatus;
  featured?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function PropertyCard({
  id,
  title,
  address,
  price,
  beds,
  baths,
  size,
  image,
  status,
  featured = false,
  className = '',
  onClick
}: PropertyCardProps) {
  // Format size function with null check
  const formatSize = (size: number | undefined | null) => {
    if (size == null || isNaN(size)) {
      return 'N/A';
    }
    return `${size.toLocaleString()} m²`;
  };

  // Safe price formatting
  function formatSafePrice(price: number | null): string {
    if (price === null || price === undefined || isNaN(price)) {
      return 'Price on Request';
    }
    return formatCurrencyCompact(price);
  }

  // Safe number formatting for beds/baths
  const formatSafeNumber = (num: number | undefined | null) => {
    if (num == null || isNaN(num)) {
      return 0;
    }
    return num;
  };

  // Handle click function
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const CardContent = (
    <>
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={getSafeImageUrl(image, 'property')}
          alt={`${title} - ${address}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getSafeImageUrl('', 'property');
          }}
        />
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" aria-label="Featured property">
              Featured
            </span>
          </div>
        )}

        {/* Status Badge */}
        {status && (
          <div className={`absolute top-3 ${featured ? 'left-3 mt-8' : 'left-3'}`}>
            <StatusBadge status={status} size="sm" />
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-semibold bg-white text-gray-900 shadow-sm" aria-label={`Price: ${formatSafePrice(price)}`}>
            {formatSafePrice(price)}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
          {title}
        </h3>

        {/* Address */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {address}
        </p>

        {/* Price and Property Details */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-semibold text-gray-900">
            {formatSafePrice(price)}
          </span>
          <div className="flex gap-4 text-sm text-gray-600">
            {formatSafeNumber(beds) && (
              <span className="flex items-center gap-1">
                <span>{formatSafeNumber(beds)} Beds</span>
              </span>
            )}
            {formatSafeNumber(baths) && (
              <span className="flex items-center gap-1">
                <span>{formatSafeNumber(baths)} Baths</span>
              </span>
            )}
          </div>
        </div>

        {/* Size */}
        {formatSize(size) && (
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {formatSize(size)}
            </span>
          </div>
        )}

        {/* View Details Button */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-200">
            {onClick ? 'Select Property' : 'View Details'}
            <svg className="inline-block w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </>
  );

  // If onClick is provided, render as button, otherwise as Link
  if (onClick) {
    return (
      <article className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 cursor-pointer ${className}`}>
        <button 
          onClick={handleClick} 
          className="text-left w-full focus:outline-none"
          aria-label={`Select ${title || 'Property'} at ${address || 'Unknown location'} - ${formatSafePrice(price)}`}
        >
          {CardContent}
        </button>
      </article>
    );
  }

  return (
    <article className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${className}`}>
      <Link
        href={`/property/${id}`}
        className="block focus:outline-none"
        aria-label={`View details for ${title || 'Property'} at ${address || 'Unknown location'} - ${formatSafePrice(price)}`}
      >
        {CardContent}
      </Link>
    </article>
  );
}
