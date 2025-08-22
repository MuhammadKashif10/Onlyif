import { apiClient } from '../lib/api-client';

export const adminApi = {
  // Analytics
  getAnalytics: async (role?: string) => {
    const params = role ? `?role=${role}` : '';
    return apiClient.get(`/admin/analytics${params}`);
  },

  // Users Management
  getUsers: async (params: { role?: string; q?: string; sort?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString());
    });
    
    return apiClient.get(`/admin/users?${searchParams}`);
  },

  suspendUser: async (userId: string, active: boolean) => {
    return apiClient.patch(`/admin/users/${userId}/suspend`, { active });
  },

  deleteUser: async (userId: string) => {
    return apiClient.delete(`/admin/users/${userId}`);
  },

  // Listings Management
  getListings: async (params: { status?: string; q?: string; sort?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString());
    });
    
    return apiClient.get(`/admin/properties?${searchParams}`);
  },

  updateListingStatus: async (listingId: string, status: string) => {
    return apiClient.patch(`/admin/properties/${listingId}/status`, { status });
  },

  deleteListing: async (listingId: string) => {
    return apiClient.delete(`/admin/properties/${listingId}`);
  },

  // Terms & Conditions Logs
  getTermsLogs: async (params: { role?: string; version?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString());
    });
    
    return apiClient.get(`/admin/terms-logs?${searchParams}`);
  },
};