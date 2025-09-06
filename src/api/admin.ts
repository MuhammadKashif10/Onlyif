import { apiClient } from '../lib/api-client';

// Add these new API methods to the existing admin.ts file
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
  
  // Dashboard Stats
  getDashboardStats: async () => {
    return apiClient.get('/api/admin/dashboard/stats');
  },
  
  // Properties
  getProperties: async (params: any) => {
    return apiClient.get('/api/admin/properties', { params });
  },
  
  updateProperty: async (propertyId: string, data: any) => {
    return apiClient.put(`/api/admin/properties/${propertyId}`, data);
  },
  
  assignPropertyToAgent: async (propertyId: string, data: { agentId: string }) => {
    return apiClient.put(`/api/admin/properties/${propertyId}/assign`, data);
  },
  
  // Agents
  getAgents: async (params: any) => {
    return apiClient.get('/api/admin/agents', { params });
  },
  
  updateAgent: async (agentId: string, data: any) => {
    return apiClient.put(`/api/admin/agents/${agentId}`, data);
  },
  
  // Users
  getUsers: async (params: any) => {
    return apiClient.get('/api/admin/users', { params });
  },
  
  updateUser: async (userId: string, data: any) => {
    return apiClient.put(`/api/admin/users/${userId}`, data);
  },

  // Payments
  getPayments: async (params: any) => {
    return apiClient.get('/api/admin/payments', { params });
  },

  updatePaymentStatus: async (paymentId: string, status: string) => {
    return apiClient.put(`/api/admin/payments/${paymentId}`, { status });
  },

  // Settings
  getSettings: async () => {
    return apiClient.get('/api/admin/settings');
  },

  updateSettings: async (data: any) => {
    return apiClient.put('/api/admin/settings', data);
  },
  
  // Individual stats endpoints
  getPropertiesCount: async () => {
    return apiClient.get('/api/admin/properties/count');
  },
  
  getAgentsCount: async () => {
    return apiClient.get('/api/admin/agents/count');
  },
  
  getUsersCount: async () => {
    return apiClient.get('/api/admin/users/count');
  },
  
  getMonthlyRevenue: async () => {
    return apiClient.get('/api/admin/payments/monthly-revenue');
  },
  
  getRecentActivity: async () => {
    return apiClient.get('/api/admin/activity');
  },
};