'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Property } from '@/types/api';
import { propertiesApi } from '@/api/properties';
import { PropertyGridSkeleton } from '@/components/ui/LoadingSkeleton';
import { LoadingError } from '@/components/ui/ErrorMessage';
import Image from 'next/image';
import { getSafeImageUrl } from '@/utils/imageUtils';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const propertyId = params.id as string;

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError('Property ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await propertiesApi.getPropertyById(propertyId);
        
        // Handle the API response structure properly
        if (response && response.success && response.data) {
          setProperty(response.data);
        } else if (response && response.data && !response.success) {
          // Handle case where response.data exists but success is false
          setError(response.message || 'Property not found');
        } else if (response && typeof response === 'object' && response.id) {
          // Handle case where response is the property object directly
          setProperty(response);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PropertyGridSkeleton count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingError 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push('/browse')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const formatAddress = (address: Property['address']) => {
    if (typeof address === 'string') return address;
    if (address && typeof address === 'object') {
      const parts = [];
      if (address.street) parts.push(address.street);
      if (address.city) parts.push(address.city);
      if (address.state) parts.push(address.state);
      if (address.zipCode) parts.push(address.zipCode);
      return parts.join(', ');
    }
    return 'Address not available';
  };

  const getMainImage = () => {
    if (property.mainImage?.url) return property.mainImage.url;
    if (property.finalImageUrl?.url) return property.finalImageUrl.url;
    if (property.images && property.images.length > 0) {
      const firstImage = property.images.find(img => img && img.url);
      if (firstImage) return firstImage.url;
    }
    return '/images/01.jpg';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => router.back()}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Back to Browse
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Property Image */}
        <div className="relative h-96 w-full">
          <Image
            src={getSafeImageUrl(getMainImage())}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Property Details */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-gray-600 text-lg">{formatAddress(property.address)}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                ${property.price?.toLocaleString()}
              </p>
              <p className="text-gray-500">{property.status}</p>
            </div>
          </div>

          {/* Property Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{property.beds || 'N/A'}</p>
              <p className="text-gray-600">Bedrooms</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{property.baths || 'N/A'}</p>
              <p className="text-gray-600">Bathrooms</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{property.size || 'N/A'}</p>
              <p className="text-gray-600">Sq Ft</p>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.features.map((feature, index) => (
                  <div key={`feature-${feature}-${index}`} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent Information */}
          {property.agent && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Contact Agent</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">
                    {property.agent.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{property.agent.name}</p>
                  <p className="text-gray-600">{property.agent.title}</p>
                  <p className="text-blue-600">{property.agent.phone}</p>
                  <p className="text-blue-600">{property.agent.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}