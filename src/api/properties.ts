import { apiClient } from '../lib/api-client';
import { Property, PropertySearchParams, PaginatedPropertiesResponse, FilterOptionsData } from '../types/api';

interface PaginationParams {
  page?: number;
  limit?: number;
}

// Backend response format
interface BackendResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const propertiesApi = {
  async getProperties(params: PropertySearchParams = {}): Promise<PaginatedPropertiesResponse> {
    console.log('🔄 API: Getting properties from database', params);
    
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const url = `/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('🔗 API URL:', url);
    
    try {
      const response = await apiClient.get<BackendResponse<Property[]>>(url);
      console.log('✅ API: Properties fetched successfully', response);
      
      // Transform backend response to expected frontend format
      return {
        properties: response.data || [],
        total: response.meta?.total || 0,
        page: response.meta?.page || 1,
        limit: response.meta?.limit || 10,
        totalPages: response.meta?.totalPages || 0
      };
    } catch (error) {
      console.error('❌ API: Error fetching properties', error);
      return {
        properties: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  },

  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    console.log('🔄 API: Getting featured properties from database', { limit });
    
    try {
      const response = await this.getProperties({ featured: 'true', limit: limit.toString() });
      console.log('✅ API: Featured properties fetched successfully', response.properties);
      return response.properties;
    } catch (error) {
      console.error('❌ API: Error fetching featured properties', error);
      return [];
    }
  },

  async getPropertyById(id: string): Promise<Property> {
    console.log('🔄 API: Getting property by ID from database', { id });
    
    try {
      const response = await apiClient.get<BackendResponse<Property>>(`/properties/${id}`);
      console.log('✅ API: Property fetched successfully', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API: Error fetching property by ID', error);
      throw error;
    }
  },

  async searchProperties(params: PropertySearchParams): Promise<PaginatedPropertiesResponse> {
    return this.getProperties(params);
  },

  async createProperty(propertyData: Partial<Property>): Promise<Property> {
    console.log('🔄 API: Creating property in database', propertyData);
    
    try {
      const response = await apiClient.post<BackendResponse<Property>>('/properties', propertyData);
      console.log('✅ API: Property created successfully', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API: Error creating property', error);
      throw error;
    }
  },

  async submitProperty(propertyData: Partial<Property>): Promise<Property> {
    return this.createProperty(propertyData);
  },

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    console.log('🔄 API: Updating property in database', { id, updates });
    
    try {
      const response = await apiClient.put<BackendResponse<Property>>(`/properties/${id}`, updates);
      console.log('✅ API: Property updated successfully', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API: Error updating property', error);
      throw error;
    }
  },

  async deleteProperty(id: string): Promise<void> {
    console.log('🔄 API: Deleting property from database', { id });
    
    try {
      await apiClient.delete(`/properties/${id}`);
      console.log('✅ API: Property deleted successfully');
    } catch (error) {
      console.error('❌ API: Error deleting property', error);
      throw error;
    }
  },

  async getFilterOptions(): Promise<FilterOptionsData> {
    console.log('🔄 API: Getting filter options from database');
    
    try {
      const response = await apiClient.get<BackendResponse<FilterOptionsData>>('/properties/filters');
      console.log('✅ API: Filter options fetched successfully', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API: Error fetching filter options', error);
      return {
        propertyTypes: [],
        priceRanges: [],
        bedrooms: [],
        bathrooms: [],
        cities: [],
        states: []
      };
    }
  }
};
export default propertiesApi;
export const submitProperty = propertiesApi.submitProperty;
export const getFeaturedProperties = propertiesApi.getFeaturedProperties;
export const getFilterOptions = propertiesApi.getFilterOptions;
