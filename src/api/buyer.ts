import { apiClient } from '../lib/api-client';
import { Property } from '../types/api';

// Buyer-specific interfaces
export interface SavedProperty {
  id: string;
  property: Property;
  savedAt: string;
}

export interface ViewedProperty {
  id: string;
  property: Property;
  viewedAt: string;
  viewCount: number;
}

export interface ScheduledViewing {
  id: string;
  property: Property;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface ActiveOffer {
  id: string;
  property: Property;
  offerAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  submittedAt: string;
  expiresAt?: string;
}

export interface BuyerStats {
  savedProperties: number;
  viewedProperties: number;
  scheduledViewings: number;
  activeOffers: number;
}

// Buyer API functions
export const buyerApi = {
  // Get buyer dashboard statistics
  async getBuyerStats(): Promise<BuyerStats> {
    try {
      const response = await apiClient.get('/buyer/stats');
      return response.data || {
        savedProperties: 0,
        viewedProperties: 0,
        scheduledViewings: 0,
        activeOffers: 0
      };
    } catch (error: any) {
      // Log the specific error for debugging
      console.warn('Buyer stats endpoint not available (status:', error.status || 'unknown', '), using fallback data');
      
      // Return fallback data for missing endpoints
      if (error.status === 404 || error.message?.includes('404') || error.message?.includes('not found')) {
        return {
          savedProperties: 0,
          viewedProperties: 0,
          scheduledViewings: 0,
          activeOffers: 0
        };
      }
      
      // For other errors, still return fallback but log more details
      console.error('Unexpected error in getBuyerStats:', error);
      return {
        savedProperties: 0,
        viewedProperties: 0,
        scheduledViewings: 0,
        activeOffers: 0
      };
    }
  },

  // Get saved properties
  async getSavedProperties(params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{
    properties: SavedProperty[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await apiClient.get(`/buyer/saved-properties?${queryParams.toString()}`);
      return response.data || {
        properties: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0
      };
    } catch (error: any) {
      console.warn('Saved properties endpoint not available (status:', error.status || 'unknown', '), using empty array');
      return {
        properties: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0
      };
    }
  },

  // Save a property
  async saveProperty(propertyId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(`/buyer/properties/${propertyId}/save`);
      return response.data || { success: false, message: 'Unknown error' };
    } catch (error) {
      console.warn('Error saving property:', error);
      return { success: false, message: 'Failed to save property' };
    }
  },

  // Unsave a property
  async unsaveProperty(propertyId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/buyer/properties/${propertyId}/save`);
      return response.data || { success: false, message: 'Unknown error' };
    } catch (error) {
      console.warn('Error unsaving property:', error);
      return { success: false, message: 'Failed to unsave property' };
    }
  },

  // Get viewed properties
  async getViewedProperties(params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{
    properties: ViewedProperty[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await apiClient.get(`/buyer/viewed-properties?${queryParams.toString()}`);
      return response.data || {
        properties: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0
      };
    } catch (error) {
      console.warn('Error fetching viewed properties, using empty array:', error);
      return {
        properties: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0
      };
    }
  },

  // Get scheduled viewings
  async getScheduledViewings(params: {
    page?: number;
    limit?: number;
    status?: 'scheduled' | 'completed' | 'cancelled';
  } = {}): Promise<{
    viewings: ScheduledViewing[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await apiClient.get(`/buyer/scheduled-viewings?${queryParams.toString()}`);
      return response.data || {
        viewings: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0
      };
    } catch (error) {
      console.warn('Error fetching scheduled viewings, using empty array:', error);
      return {
        viewings: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0
      };
    }
  },

  // Schedule a viewing
  async scheduleViewing(data: {
    propertyId: string;
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
  }): Promise<{ success: boolean; viewing?: ScheduledViewing }> {
    try {
      const response = await apiClient.post('/buyer/schedule-viewing', data);
      return response.data || { success: false };
    } catch (error) {
      console.warn('Error scheduling viewing:', error);
      return { success: false };
    }
  },

  // Get active offers
  async getActiveOffers(params: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'accepted' | 'rejected' | 'countered';
  } = {}): Promise<{
    offers: ActiveOffer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await apiClient.get(`/buyer/active-offers?${queryParams.toString()}`);
      return response.data || {
        offers: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0
      };
    } catch (error) {
      console.warn('Error fetching active offers, using empty array:', error);
      return {
        offers: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0
      };
    }
  },

  // Submit an offer
  async submitOffer(data: {
    propertyId: string;
    offerAmount: number;
    earnestMoney?: number;
    closingDate?: string;
    contingencies?: string[];
    notes?: string;
  }): Promise<{ success: boolean; offer?: ActiveOffer }> {
    try {
      const response = await apiClient.post('/buyer/submit-offer', data);
      return response.data || { success: false };
    } catch (error) {
      console.warn('Error submitting offer:', error);
      return { success: false };
    }
  },

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<Array<{
    id: string;
    type: 'property_view' | 'property_save' | 'viewing_scheduled' | 'offer_submitted';
    message: string;
    time: string;
    propertyId?: string;
  }>> {
    try {
      const response = await apiClient.get(`/buyer/recent-activity?limit=${limit}`);
      return response.data || [];
    } catch (error) {
      console.warn('Error fetching recent activity, using empty array:', error);
      return [];
    }
  }
};

export default buyerApi;