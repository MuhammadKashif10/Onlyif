'use client';

import { Navbar } from '@/components';
import MapListingsLayout from '@/components/sections/MapListingsLayout';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { usePropertyContext } from '@/context/PropertyContext';

export default function BrowsePageClient() {
  const { properties } = usePropertyContext();
  useApiIntegration(); // Connect API to global state
  
  // Fix: Ensure properties is always an array before using array methods
  const safeProperties = Array.isArray(properties) ? properties : [];
  
  const stats = {
    totalProperties: safeProperties.length,
    averagePrice: safeProperties.length > 0 ? Math.round(safeProperties.reduce((sum, p) => sum + p.price, 0) / safeProperties.length) : 0,
    totalValue: safeProperties.reduce((sum, p) => sum + p.price, 0),
    featuredCount: safeProperties.filter(p => p.featured).length
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar
        logo="/logo.svg"
        logoText=""
        navigationItems={[
          { label: 'Buy', href: '/browse', isActive: true },
          { label: 'Sell', href: '/sell', isActive: false },
          { label: 'How It Works', href: '/how-it-works', isActive: false },
          { label: 'About', href: '/about', isActive: false },
        ]}
        ctaText="Get Started"
        ctaHref="/signin"
      />

      {/* Header */}
      <section className="bg-gray-50 pt-4 sm:pt-6 md:pt-8 pb-8" aria-labelledby="browse-homes-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center">
            <h1 id="browse-homes-heading" className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
              Browse Homes for Sale
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover your perfect home with our comprehensive search and filter options. 
              Find properties that match your criteria and budget.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              <span className="font-semibold">{stats.totalProperties.toLocaleString()}+ homes available</span>
              <span className="mx-2">•</span>
              <span>Updated in real-time</span>
            </div>
          </header>
        </div>
      </section>

      {/* Map + Listings Layout */}
      <section className="py-8" aria-labelledby="property-results-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="property-results-heading" className="sr-only">Property Search Results</h2>
          <MapListingsLayout
            showFilters={true}
            showPagination={true}
            itemsPerPage={12}
            featuredOnly={false}
          />
        </div>
      </section>
    </div>
  );
}