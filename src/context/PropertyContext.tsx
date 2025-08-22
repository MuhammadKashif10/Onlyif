'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property } from '@/types/api';
import { propertiesApi } from '@/api';

// Import initial properties from the existing data
import propertiesData from '../data/properties.json';

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'dateListed' | 'daysOnMarket'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getPropertyById: (id: string) => Property | undefined;
  getFeaturedProperties: () => Property[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// Convert properties.json data to match Property interface
const convertToProperty = (data: any): Property => {
  return {
    id: data.id.toString(),
    title: data.title,
    address: data.address,
    city: data.city || 'Austin',
    state: data.state || 'TX',
    zipCode: data.zipCode || '78701',
    price: data.price,
    beds: data.beds,
    baths: data.baths,
    size: data.size,
    yearBuilt: data.yearBuilt || new Date().getFullYear(),
    lotSize: data.lotSize || 0.25,
    propertyType: data.propertyType || 'Single Family',
    status: 'For Sale',
    description: data.description,
    features: data.features || [],
    images: data.images || [],
    mainImage: data.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=800&q=80',
    coordinates: data.coordinates || { lat: 30.2672, lng: -97.7431 },
    agent: data.agent || {
      id: 'default-agent',
      name: 'Default Agent',
      phone: '(512) 555-0123',
      email: 'agent@onlyif.com',
      avatar: '/images/agent-default.jpg',
      rating: 4.8,
      reviews: 50
    },
    similarProperties: data.similarProperties || [],
    featured: data.featured || false,
    dateListed: data.dateListed || new Date().toISOString().split('T')[0],
    daysOnMarket: data.daysOnMarket || 0
  };
};

// Fix: Access the properties array from the nested structure with error handling
const initialProperties: Property[] = (() => {
  try {
    console.log('Properties data:', propertiesData);
    if (!propertiesData || !propertiesData.properties || !Array.isArray(propertiesData.properties)) {
      console.error('Properties data is not in expected format:', propertiesData);
      return [];
    }
    const converted = propertiesData.properties.map(convertToProperty);
    console.log('Converted properties:', converted.length);
    return converted;
  } catch (error) {
    console.error('Error converting properties data:', error);
    return [];
  }
})();

export function PropertyProvider({ children }: { children: ReactNode }) {
  console.log('PropertyProvider initializing with properties:', initialProperties.length);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);

  const addProperty = (propertyData: Omit<Property, 'id' | 'dateListed' | 'daysOnMarket'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      dateListed: new Date().toISOString().split('T')[0],
      daysOnMarket: 0
    };
    
    setProperties(prev => [newProperty, ...prev]);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => 
      prev.map(property => 
        property.id === id ? { ...property, ...updates } : property
      )
    );
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(property => property.id !== id));
  };

  const getPropertyById = (id: string) => {
    return properties.find(property => property.id === id);
  };

  const getFeaturedProperties = () => {
    return properties.filter(property => property.featured);
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      addProperty,
      updateProperty,
      deleteProperty,
      getPropertyById,
      getFeaturedProperties,
      loading,
      setLoading
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
}