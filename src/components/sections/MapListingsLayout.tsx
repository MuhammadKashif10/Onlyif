'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types/api';
import { usePropertyContext } from '@/context/PropertyContext';
import PropertyMap from '../reusable/PropertyMap';
import PropertyCard from '../ui/PropertyCard';
import FilterBar from '../ui/FilterBar';
import Pagination from '../reusable/Pagination';
import { PropertyGridSkeleton } from '../ui/LoadingSkeleton';
import { LoadingError, NoResults } from '../ui/ErrorMessage';
import { getSafeImageUrl } from '@/utils/imageUtils';
import { FilterOptions } from '@/api';
import { formatPropertyAddress } from '@/utils/addressUtils';

interface MapListingsLayoutProps {
  showFilters?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
  featuredOnly?: boolean;
  className?: string;
  onPropertyClick?: (property: Property) => void;
}

export default function MapListingsLayout({
  showFilters = true,
  showPagination = true,
  itemsPerPage = 12,
  featuredOnly = false,
  className = '',
  onPropertyClick
}: MapListingsLayoutProps) {
  // Fix: Access properties from state instead of destructuring directly
  const { state, loadProperties } = usePropertyContext();
  const { properties: allProperties, loading: contextLoading, error: contextError } = state;
  
  // Add console logging to trace data flow
  console.log('🗺️ MapListingsLayout - Properties state:', {
    allPropertiesCount: allProperties?.length || 0,
    contextLoading,
    contextError,
    allProperties: allProperties?.slice(0, 2) // Log first 2 properties for debugging
  });
  
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);

  // Add missing useEffect to load properties on mount
  useEffect(() => {
    console.log('🚀 MapListingsLayout - Loading properties on mount...');
    loadProperties();
  }, [loadProperties]);

  // Filter and paginate properties (same logic as PropertyGrid)
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 MapListingsLayout - Filtering properties:', {
        allPropertiesLength: allProperties?.length || 0,
        featuredOnly,
        searchQuery,
        filters
      });

      // Ensure allProperties is an array
      let properties = Array.isArray(allProperties) ? [...allProperties] : [];

      // Apply featured filter
      if (featuredOnly) {
        properties = properties.filter(p => p.featured);
      }

      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        properties = properties.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }

      // Apply filters
      if (filters.propertyType) {
        properties = properties.filter(p => p.propertyType === filters.propertyType);
      }
      if (filters.city) {
        properties = properties.filter(p => p.city === filters.city);
      }
      if (filters.minPrice) {
        properties = properties.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        properties = properties.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.beds) {
        properties = properties.filter(p => p.beds >= filters.beds!);
      }
      if (filters.baths) {
        properties = properties.filter(p => p.baths >= filters.baths!);
      }
      if (filters.minSize) {
        properties = properties.filter(p => p.size >= filters.minSize!);
      }
      if (filters.maxSize) {
        properties = properties.filter(p => p.size <= filters.maxSize!);
      }

      // Sort properties
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-asc':
            properties.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            properties.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            properties.sort((a, b) => new Date(b.dateListed).getTime() - new Date(a.dateListed).getTime());
            break;
          case 'oldest':
            properties.sort((a, b) => new Date(a.dateListed).getTime() - new Date(b.dateListed).getTime());
            break;
        }
      }

      const total = properties.length;
      setTotalProperties(total);

      // Apply pagination
      if (showPagination) {
        const totalPagesCalc = Math.ceil(total / itemsPerPage);
        setTotalPages(totalPagesCalc);
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        properties = properties.slice(startIndex, endIndex);
      }

      setFilteredProperties(properties);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
      console.error('Error filtering properties:', err);
    } finally {
      setLoading(false);
    }
  }, [allProperties, filters, searchQuery, currentPage, itemsPerPage, showPagination, featuredOnly]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedPropertyId(property.id);
    onPropertyClick?.(property);
  };

  const handlePropertyHover = (property: Property | null) => {
    setHoveredPropertyId(property?.id || null);
  };

  const handlePropertyCardHover = (property: Property | null) => {
    setHoveredPropertyId(property?.id || null);
  };

  // Add refresh function for error handling
  const refreshProperties = () => {
    loadProperties();
  };

  // Handle loading state
  if (loading || contextLoading) {
    return (
      <div className={className}>
        <PropertyGridSkeleton count={itemsPerPage} />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={className}>
        <LoadingError 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  if (contextError && allProperties.length === 0) {
    return (
      <div className={`map-listings-layout ${className}`}>
        <LoadingError 
          message={contextError}
          onRetry={refreshProperties}
        />
      </div>
    );
  }

  return (
    <div className={`map-listings-layout ${className}`}>
      {/* Filters */}
      {showFilters && (
        <div className="mb-6">
          <FilterBar
            onFiltersChange={handleFiltersChange}
            onSearchChange={handleSearchChange}
            currentFilters={filters}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Results Summary and View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {totalProperties.toLocaleString()} properties
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMap(true)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              showMap 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setShowMap(false)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              !showMap 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Main Content */}
      {filteredProperties.length > 0 ? (
        <>
          <div className={`grid gap-6 ${showMap ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Map Section */}
            {showMap && (
              <div className="lg:sticky lg:top-6 h-[600px]">
                <PropertyMap
                  properties={Array.isArray(allProperties) ? allProperties.filter(p => {
                    // Show all properties that match current filters on map
                    let matches = true;
                    if (featuredOnly) matches = matches && p.featured;
                    if (searchQuery.trim()) {
                      const query = searchQuery.toLowerCase();
                      matches = matches && (
                        p.title.toLowerCase().includes(query) ||
                        p.address.toLowerCase().includes(query) ||
                        p.city.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query)
                      );
                    }
                    if (filters.propertyType) matches = matches && p.propertyType === filters.propertyType;
                    if (filters.city) matches = matches && p.city === filters.city;
                    if (filters.minPrice) matches = matches && p.price >= filters.minPrice;
                    if (filters.maxPrice) matches = matches && p.price <= filters.maxPrice;
                    if (filters.beds) matches = matches && p.beds >= filters.beds;
                    if (filters.baths) matches = matches && p.baths >= filters.baths;
                    if (filters.minSize) matches = matches && p.size >= filters.minSize;
                    if (filters.maxSize) matches = matches && p.size <= filters.maxSize;
                    return matches;
                  }) : []}
                  selectedPropertyId={selectedPropertyId || hoveredPropertyId || undefined}
                  onPropertySelect={handlePropertySelect}
                  onPropertyHover={handlePropertyHover}
                  className="h-full"
                />
              </div>
            )}

            {/* Listings Section */}
            <div className={showMap ? '' : 'max-w-7xl mx-auto'}>
              <div className={`grid gap-6 ${
                showMap 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {filteredProperties.map((property) => {
                  // Ensure property is a valid object with required fields
                  if (!property || typeof property !== 'object' || !property.id) {
                    console.warn('Invalid property object:', property);
                    return null;
                  }
                  
                  // Format address object into string
                  const formatAddress = (address: any) => {
                    if (typeof address === 'string') {
                      return address;
                    }
                    if (address && typeof address === 'object') {
                      const parts = [];
                      if (address.street) parts.push(address.street);
                      if (address.city) parts.push(address.city);
                      if (address.state) parts.push(address.state);
                      if (address.zipCode) parts.push(address.zipCode);
                      return parts.join(', ') || 'Address not available';
                    }
                    return 'Address not available';
                  };
                  
                  return (
                    <div
                      key={property.id}
                      onMouseEnter={() => handlePropertyCardHover(property)}
                      onMouseLeave={() => handlePropertyCardHover(null)}
                      className={`transition-all duration-200 ${
                        hoveredPropertyId === property.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                      }`}
                    >
                      {/* Debug logging for property data */}
                      {console.log('🏠 Property data:', {
                        id: property.id,
                        title: property.title,
                        price: property.price,
                        beds: property.beds,
                        baths: property.baths,
                        size: property.size,
                        squareMeters: property.squareMeters,
                        images: property.images,
                        mainImage: property.mainImage
                      })}
                      {/* Additional debug for image processing */}
                      {console.log('🖼️ Image processing:', {
                        mainImage: property.mainImage,
                        firstImage: property.images?.[0],
                        imagesArray: property.images,
                        finalImageUrl: property.mainImage || property.images?.[0]
                      })}
                      <PropertyCard
                        id={property.id || ''}
                        title={property.title || 'Untitled Property'}
                        address={formatPropertyAddress(property.address)}
                        price={property.price || null}
                        beds={property.beds || null}
                        baths={property.baths || null}
                        size={property.squareMeters || property.size || null}
                        image={
                          property.mainImage?.url ||
                          property.images?.find(img => img.isPrimary)?.url ||
                          property.images?.[0]?.url ||
                          ''
                        }
                        featured={property.featured || false}
                        onSelect={() => handlePropertySelect(property)}
                        isSelected={selectedPropertyId === property.id}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {showPagination && totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={totalProperties}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <NoResults
          message={allProperties.length === 0 ? "No properties available yet" : "No properties found"}
          suggestion={
            allProperties.length === 0
              ? "New properties will appear here as sellers add them. Check back soon!"
              : searchQuery || Object.keys(filters).length > 0
              ? 'Try adjusting your search criteria or filters.'
              : 'Check back later for new listings.'
          }
        />
      )}
    </div>
  );
}