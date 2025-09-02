'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { formatPropertyAddress, getSearchableAddress } from '@/utils/addressUtils';

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
  const router = useRouter();
  const {
    state,
    loadProperties,
    setFilters,
    resetPagination
  } = usePropertyContext();

  // Extract from state
  const {
    properties: allProperties,
    loading: contextLoading,
    error: contextError,
    searchResults,
    filters,
    pagination
  } = state;

  // Local state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Calculate pagination
  const totalProperties = filteredProperties.length;
  const totalPages = Math.ceil(totalProperties / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Load properties on mount
  useEffect(() => {
    console.log('🔄 MapListingsLayout - Loading properties...', { allProperties: allProperties?.length });
    if (!allProperties || allProperties.length === 0) {
      loadProperties().then(() => {
        console.log('✅ Properties loaded successfully');
      }).catch((error) => {
        console.error('❌ Failed to load properties:', error);
      });
    }
  }, [allProperties, loadProperties]);

  // Filter properties based on featuredOnly and other criteria
  useEffect(() => {
    let filtered = Array.isArray(allProperties) ? [...allProperties] : [];

    // Apply featured filter if needed
    if (featuredOnly) {
      filtered = filtered.filter(property => property.featured);
    }

    // Apply search query if exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.title?.toLowerCase().includes(query) ||
        property.address?.toLowerCase().includes(query) ||
        property.city?.toLowerCase().includes(query) ||
        property.state?.toLowerCase().includes(query)
      );
    }

    // Apply filters from context
    if (filters && filters.city) {
      filtered = filtered.filter(property => 
        property.city?.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    if (filters && filters.propertyType) {
      filtered = filtered.filter(property => property.propertyType === filters.propertyType);
    }
    if (filters && filters.minPrice) {
      filtered = filtered.filter(property => property.price >= filters.minPrice!);
    }
    if (filters && filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= filters.maxPrice!);
    }
    if (filters && filters.beds) {
      filtered = filtered.filter(property => property.beds >= filters.beds!);
    }
    if (filters && filters.baths) {
      filtered = filtered.filter(property => property.baths >= filters.baths!);
    }

    setFilteredProperties(filtered);
    
    // Reset to first page when filters change
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [allProperties, featuredOnly, searchQuery, filters, currentPage]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    updateFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updatePagination({ ...pagination, page });
  };

  // Handle property selection for map
  const handlePropertySelect = (property: Property) => {
    const propertyId = property._id || property.id;
    setSelectedPropertyId(propertyId);
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  // Handle property card hover (unified function)
  const handlePropertyCardHover = (property: Property | null) => {
    const propertyId = property?._id || property?.id;
    setHoveredPropertyId(propertyId || null);
  };

  // Handle view details navigation
  const handleViewDetails = (property: Property) => {
    const propertyId = property._id || property.id;
    if (propertyId) {
      router.push(`/property/${propertyId}`);
    } else {
      console.error('Cannot navigate: Property ID not found', property);
    }
  };

  // Add refresh function for error handling
  const refreshProperties = () => {
    loadProperties();
  };

  // Helper function to get property image
  const getPropertyImage = (property: Property): string => {
    if (property.mainImage) {
      return property.mainImage;
    }
    
    if (property.images && property.images.length > 0 && property.images[0].url) {
      return property.images[0].url;
    }
    
    return '/images/default-property.jpg';
  };

  // Helper function to format address
  const formatAddress = (property: Property): string => {
    return property.address || 'Address not available';
  };

  // Enhanced property validation for normalized data
  const isValidProperty = (property: any): property is Property => {
    return (
      property &&
      typeof property === 'object' &&
      typeof property.id === 'string' &&
      typeof property.title === 'string' &&
      typeof property.address === 'string' &&
      typeof property.price === 'number' &&
      typeof property.beds === 'number' &&
      typeof property.baths === 'number'
    );
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

  // Handle context error with fallback
  if (contextError && allProperties.length === 0) {
    return (
      <div className={className}>
        <LoadingError 
          message={contextError} 
          onRetry={refreshProperties} 
        />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${className}`}>
      {/* Left Column - Filters and Property List */}
      <div className="space-y-6">
        {/* Filters */}
        {showFilters && (
          <FilterBar
            onFiltersChange={handleFilterChange}
            onSearchChange={handleSearch}
            currentFilters={filters}
            searchQuery={searchQuery}
          />
        )}

        {/* Results Summary */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {totalProperties === 0 ? 'No properties found' : 
             `Showing ${startIndex + 1}-${Math.min(endIndex, totalProperties)} of ${totalProperties} properties`}
          </p>
        </div>

        {/* Property Grid */}
        {currentProperties.length === 0 ? (
          <NoResults 
            message="No properties match your criteria" 
            onReset={() => {
              setSearchQuery('');
              updateFilters({});
              setCurrentPage(1);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentProperties.map((property) => {
              // Validate property object with normalized structure
              if (!isValidProperty(property)) {
                console.warn('Invalid property object:', property);
                return null;
              }

              return (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  beds={property.beds}
                  baths={property.baths}
                  size={property.size}
                  image={property.mainImage || '/images/default-property.jpg'}
                  featured={property.featured}
                  onClick={() => handleViewDetails(property)}
                  onHover={() => handlePropertyCardHover(property)}
                />
              );
            })}
          </div>
        )}

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

      {/* Right Column - Map */}
      <div className="lg:sticky lg:top-4 h-[600px]">
        <div className="w-full h-full">
          <PropertyMap
            properties={currentProperties}
            selectedPropertyId={selectedPropertyId}
            hoveredPropertyId={hoveredPropertyId}
            onPropertySelect={handlePropertySelect}
            onPropertyHover={handlePropertyCardHover}
            className="w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}