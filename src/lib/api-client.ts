class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Automatic JWT token handling with browser check
  private getAuthHeaders(): Record<string, string> {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem('token');
      return token ? { ...this.defaultHeaders, Authorization: `Bearer ${token}` } : this.defaultHeaders;
    }
    return this.defaultHeaders;
  }

  // Standardized request method with error handling
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    // Transform backend response to frontend format
    return this.transformResponse(data);
  }

  // Transform backend response format to match frontend expectations
  private transformResponse(data: any): any {
    if (data.success && data.data) {
      // Transform _id to id for all objects
      const transformedData = this.transformIds(data.data);
      return {
        success: data.success,
        data: transformedData,
        message: data.message,
        meta: data.meta // for pagination
      };
    }
    return data;
  }

  // Recursively transform _id to id
  private transformIds(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformIds(item));
    }
    if (obj && typeof obj === 'object') {
      const transformed = { ...obj };
      if (transformed._id) {
        transformed.id = transformed._id;
        delete transformed._id;
      }
      Object.keys(transformed).forEach(key => {
        transformed[key] = this.transformIds(transformed[key]);
      });
      return transformed;
    }
    return obj;
  }

  // API Methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Add method for public requests (no authentication required)
  async publicPost<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      method: 'POST',
      headers: this.defaultHeaders, // Use default headers without auth
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'API request failed');
    }

    return this.transformResponse(responseData);
  }
}

export const apiClient = new ApiClient();