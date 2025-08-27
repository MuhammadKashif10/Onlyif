'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { propertiesApi } from '../api/properties';
import { Property, PropertySearchParams, PaginatedPropertiesResponse } from '../types/api';
import { useAuth } from './AuthContext';

interface PropertyState {
  properties: Property[];
  featuredProperties: Property[];
  currentProperty: Property | null;
  favorites: Property[];
  searchResults: Property[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: PropertySearchParams;
}

type PropertyAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROPERTIES'; payload: { properties: Property[]; pagination?: any } }
  | { type: 'SET_FEATURED_PROPERTIES'; payload: Property[] }
  | { type: 'SET_CURRENT_PROPERTY'; payload: Property | null }
  | { type: 'SET_FAVORITES'; payload: Property[] }
  | { type: 'SET_SEARCH_RESULTS'; payload: { properties: Property[]; pagination?: any } }
  | { type: 'SET_FILTERS'; payload: PropertySearchParams }
  | { type: 'ADD_PROPERTY'; payload: Property }
  | { type: 'UPDATE_PROPERTY'; payload: { id: string; updates: Partial<Property> } }
  | { type: 'DELETE_PROPERTY'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string };

const initialState: PropertyState = {
  properties: [],
  featuredProperties: [],
  currentProperty: null,
  favorites: [],
  searchResults: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  },
  filters: {}
};

function propertyReducer(state: PropertyState, action: PropertyAction): PropertyState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_PROPERTIES':
      return {
        ...state,
        properties: action.payload.properties,
        pagination: action.payload.pagination || state.pagination,
        loading: false,
        error: null
      };
    case 'SET_FEATURED_PROPERTIES':
      return { ...state, featuredProperties: action.payload };
    case 'SET_CURRENT_PROPERTY':
      return { ...state, currentProperty: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload.properties,
        pagination: action.payload.pagination || state.pagination
      };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'ADD_PROPERTY':
      return {
        ...state,
        properties: [action.payload, ...state.properties],
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems + 1
        }
      };
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
        currentProperty: state.currentProperty?.id === action.payload.id
          ? { ...state.currentProperty, ...action.payload.updates }
          : state.currentProperty
      };
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(p => p.id !== action.payload),
        currentProperty: state.currentProperty?.id === action.payload ? null : state.currentProperty,
        pagination: {
          ...state.pagination,
          totalItems: Math.max(0, state.pagination.totalItems - 1)
        }
      };
    case 'TOGGLE_FAVORITE':
      const isFavorite = state.favorites.some(p => p.id === action.payload);
      const property = state.properties.find(p => p.id === action.payload);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(p => p.id !== action.payload)
          : property ? [...state.favorites, property] : state.favorites
      };
    default:
      return state;
  }
}

interface PropertyContextType {
  state: PropertyState;
  // Property CRUD operations
  loadProperties: (params?: PropertySearchParams) => Promise<void>;
  loadFeaturedProperties: (limit?: number) => Promise<void>;
  loadPropertyById: (id: string) => Promise<void>;
  searchProperties: (params: PropertySearchParams) => Promise<void>;
  addProperty: (propertyData: Partial<Property>) => Promise<void>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  // Favorites
  loadFavorites: () => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<void>;
  // Utility functions
  setFilters: (filters: PropertySearchParams) => void;
  clearError: () => void;
  resetPagination: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(propertyReducer, initialState);
  const { user } = useAuth();

  // Load properties with filters and pagination
  const loadProperties = async (params: PropertySearchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await propertiesApi.getProperties(params);
      
      // Extra validation to ensure response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response structure');
      }
      
      // Ensure properties is always an array
      const properties = Array.isArray(response.properties) ? response.properties : [];
      
      setProperties(properties);
      setTotalProperties(response.total || 0);
      setCurrentPage(response.page || 1);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error loading properties:', error);
      setError(error instanceof Error ? error.message : 'Failed to load properties');
      // Set safe fallback values
      setProperties([]);
      setTotalProperties(0);
      setCurrentPage(1);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Load featured properties
  const loadFeaturedProperties = async (limit: number = 6) => {
    try {
      const response = await propertiesApi.getFeaturedProperties(limit);
      dispatch({ type: 'SET_FEATURED_PROPERTIES', payload: response.data || response });
    } catch (error) {
      console.error('Error loading featured properties:', error);
    }
  };

  // Load single property by ID
  const loadPropertyById = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await propertiesApi.getPropertyById(id);
      dispatch({ type: 'SET_CURRENT_PROPERTY', payload: response.data || response });
    } catch (error) {
      console.error('Error loading property:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load property' });
    }
  };

  // Search properties
  const searchProperties = async (params: PropertySearchParams) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await propertiesApi.searchProperties(params);
      
      dispatch({
        type: 'SET_SEARCH_RESULTS',
        payload: {
          properties: response.data || response.properties || [],
          pagination: {
            currentPage: response.meta?.page || response.page || 1,
            totalPages: response.meta?.totalPages || response.totalPages || 1,
            totalItems: response.meta?.total || response.total || 0,
            hasNext: response.meta?.hasNext || false,
            hasPrev: response.meta?.hasPrev || false
          }
        }
      });
    } catch (error) {
      console.error('Error searching properties:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to search properties' });
    }
  };

  // Add new property
  const addProperty = async (propertyData: Partial<Property>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await propertiesApi.submitProperty(propertyData);
      dispatch({ type: 'ADD_PROPERTY', payload: response.data || response });
    } catch (error) {
      console.error('Error adding property:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add property' });
    }
  };

  // Update existing property
  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      const response = await propertiesApi.updateProperty(id, updates);
      dispatch({ type: 'UPDATE_PROPERTY', payload: { id, updates: response.data || response } });
    } catch (error) {
      console.error('Error updating property:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update property' });
    }
  };

  // Delete property
  const deleteProperty = async (id: string) => {
    try {
      await propertiesApi.deleteProperty(id);
      dispatch({ type: 'DELETE_PROPERTY', payload: id });
    } catch (error) {
      console.error('Error deleting property:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete property' });
    }
  };

  // Load user favorites
  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      const response = await propertiesApi.getFavoriteProperties();
      dispatch({ type: 'SET_FAVORITES', payload: response.data || response.properties || [] });
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (propertyId: string) => {
    if (!user) return;
    
    try {
      await propertiesApi.toggleFavorite(propertyId);
      dispatch({ type: 'TOGGLE_FAVORITE', payload: propertyId });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update favorites' });
    }
  };

  // Set filters
  const setFilters = (filters: PropertySearchParams) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Reset pagination
  const resetPagination = () => {
    dispatch({
      type: 'SET_PROPERTIES',
      payload: {
        properties: state.properties,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    });
  };

  // Load initial data
  useEffect(() => {
    loadProperties();
    loadFeaturedProperties();
  }, []);

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      dispatch({ type: 'SET_FAVORITES', payload: [] });
    }
  }, [user]);

  const value: PropertyContextType = {
    state,
    loadProperties,
    loadFeaturedProperties,
    loadPropertyById,
    searchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
    loadFavorites,
    toggleFavorite,
    setFilters,
    clearError,
    resetPagination
  };

  return (
    <PropertyContext.Provider value={value}>
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