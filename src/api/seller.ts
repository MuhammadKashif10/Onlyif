import { apiClient } from '../lib/api-client';
import { Property } from '../types/api';

// Seller statistics interface
export interface SellerStats {
  totalOffers: number;
  pendingOffers: number;
  acceptedOffers: number;
  averageOfferValue: number;
  totalProperties: number;
  totalViews: number;
  averagePropertyValue: number;
}

// Seller API functions
export const sellerApi = {
  // Get seller overview/statistics
  async getSellerOverview(sellerId: string): Promise<SellerStats> {
    try {
      const response = await apiClient.get(`/seller/${sellerId}/overview`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller overview:', error);
      throw new Error('Failed to fetch seller overview');
    }
  },

  // Get seller's property listings
  async getSellerListings(sellerId: string, params: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{
    properties: Property[];
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
      
      const response = await apiClient.get(`/seller/${sellerId}/listings?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller listings:', error);
      throw new Error('Failed to fetch seller listings');
    }
  }
};

export default sellerApi;