'use client';

import { useState, useEffect } from 'react';
import { FilterOptions } from '@/api';
import { usePropertyContext } from '@/context/PropertyContext';
import PropertyCard from '../ui/PropertyCard';
import FilterBar from '../ui/FilterBar';
import Pagination from '../reusable/Pagination';
import { PropertyGridSkeleton } from '../ui/LoadingSkeleton';
import { LoadingError, NoResults } from '../ui/ErrorMessage';
import { getSafeImageUrl } from '@/utils/imageUtils';
import { Property } from '@/types/api';

interface PropertyGridProps {
  showFilters?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
  featuredOnly?: boolean;
  className?: string;
  onPropertyClick?: (property: Property) => void;
}

export default function PropertyGrid({
  showFilters = true,
  showPagination = true,
  itemsPerPage = 12,
  featuredOnly = false,
  className = '',
  onPropertyClick
}: PropertyGridProps) {
  const { properties: allProperties, loading: contextLoading } = usePropertyContext();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and paginate properties
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      let properties = [...allProperties];

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
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && filteredProperties.length === 0) {
    return (
      <div className={className}>
        <PropertyGridSkeleton count={itemsPerPage} />
      </div>
    );
  }

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

  return (
    <div className={className}>
      {/* Filters */}
      {showFilters && (
        <div className="mb-8">
          <FilterBar
            onFiltersChange={handleFiltersChange}
            onSearchChange={handleSearchChange}
            currentFilters={filters}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Results Summary */}
      {!featuredOnly && (
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {totalProperties.toLocaleString()} properties
          </p>
        </div>
      )}

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                address={property.address}
                price={property.price}
                beds={property.beds}
                baths={property.baths}
                size={property.size}
                image={getSafeImageUrl(
                  property.mainImage || property.images?.[0],
                  property.propertyType
                )}
                featured={property.featured}
                onClick={onPropertyClick ? () => onPropertyClick(property) : undefined}
              />
            ))}
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
        </>
      ) : (
        <NoResults
          message="No properties found"
          suggestion={
            searchQuery || Object.keys(filters).length > 0
              ? 'Try adjusting your search criteria or filters.'
              : 'Check back later for new listings.'
          }
        />
      )}
    </div>
  );
}
