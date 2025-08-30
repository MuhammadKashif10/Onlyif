import { USE_MOCKS, withMockFallback } from '@/utils/mockWrapper';
import { request } from '@/utils/api';
import { Property, FilterOptions, PaginationOptions, SearchOptions, FilterOptionsData } from '@/types/api';
import { apiClient } from '../lib/api-client';
import { PaginatedPropertiesResponse, PropertySearchParams } from '../types/api';

interface PaginatedPropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockProperties = [
  {
    id: '1',
    title: 'Modern Downtown Condo',
    address: '123 Main St, Austin, TX 78701',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    price: 450000,
    beds: 2,
    baths: 2,
    size: 1200,
    featured: true,
    mainImage: '/public/images/02.jpg',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=800&h=600&fit=crop',
    ],
    description: 'Beautiful modern condo in the heart of downtown Austin. Features open floor plan, high ceilings, and stunning city views.',
    yearBuilt: 2018,
    lotSize: 0.1,
    propertyType: 'Condo',
    status: 'public' as const,
    features: [
      'Open floor plan',
      'High ceilings',
      'City views',
      'Modern appliances',
      'In-unit laundry',
      'Balcony'
    ],
    coordinates: {
      lat: 30.2672,
      lng: -97.7431
    },
    agent: {
      id: 'agent1',
      name: 'Sarah Johnson',
      title: 'Senior Real Estate Agent',
      phone: '(512) 555-0123',
      email: 'sarah.johnson@onlyif.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      reviews: 127,
      experience: '8 years',
      specializations: ['Condos', 'Downtown Properties', 'Investment Properties'],
      languages: ['English', 'Spanish'],
      bio: 'Experienced agent specializing in downtown Austin properties.',
      propertiesSold: 156,
      averageDaysOnMarket: 28,
      office: 'OnlyIf Downtown Office',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: 'https://twitter.com/sarahjohnson',
        instagram: 'https://instagram.com/sarahjohnson'
      }
    },
    similarProperties: ['2', '3'],
    dateListed: '2024-01-15',
    daysOnMarket: 45,
    hasRequiredMedia: true,
    isAdminApproved: true,
    canChangeVisibility: true,
    visibilityLastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Spacious Family Home',
    address: '456 Oak Ave, Austin, TX 78702',
    city: 'Austin',
    state: 'TX',
    zipCode: '78702',
    price: 750000,
    beds: 4,
    baths: 3,
    size: 2800,
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    ],
    description: 'Perfect family home with large backyard, updated kitchen, and plenty of storage space.',
    yearBuilt: 2015,
    lotSize: 0.3,
    propertyType: 'Single Family',
    status: 'public' as const,
    features: [
      'Large backyard',
      'Updated kitchen',
      'Storage space',
      'Two-car garage',
      'Hardwood floors',
      'Master suite'
    ],
    coordinates: {
      lat: 30.2849,
      lng: -97.7341
    },
    agent: {
      id: 'agent2',
      name: 'Michael Chen',
      title: 'Family Home Specialist',
      phone: '(512) 555-0124',
      email: 'michael.chen@onlyif.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      reviews: 89,
      experience: '6 years',
      specializations: ['Family Homes', 'Suburban Properties', 'First-time Buyers'],
      languages: ['English', 'Mandarin'],
      bio: 'Dedicated to helping families find their perfect home.',
      propertiesSold: 98,
      averageDaysOnMarket: 32,
      office: 'OnlyIf East Austin Office',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/michaelchen',
        twitter: 'https://twitter.com/michaelchen',
        instagram: 'https://instagram.com/michaelchen'
      }
    },
    similarProperties: ['1', '3'],
    dateListed: '2024-01-10',
    daysOnMarket: 50,
    hasRequiredMedia: true,
    isAdminApproved: true,
    canChangeVisibility: true,
    visibilityLastUpdated: '2024-01-10'
  },
  {
    id: '3',
    title: 'Luxury Townhouse',
    address: '789 Pine St, Austin, TX 78703',
    city: 'Austin',
    state: 'TX',
    zipCode: '78703',
    price: 650000,
    beds: 3,
    baths: 2.5,
    size: 2100,
    featured: true,
    mainImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=800&h=600&fit=crop',
    ],
    description: 'Elegant townhouse with modern amenities, private garage, and community pool.',
    yearBuilt: 2020,
    lotSize: 0.15,
    propertyType: 'Townhouse',
    status: 'public' as const,
    features: [
      'Modern amenities',
      'Private garage',
      'Community pool',
      'Granite countertops',
      'Stainless appliances',
      'Walk-in closets'
    ],
    coordinates: {
      lat: 30.2711,
      lng: -97.7437
    },
    agent: {
      id: 'agent3',
      name: 'Emily Rodriguez',
      title: 'Luxury Property Expert',
      phone: '(512) 555-0125',
      email: 'emily.rodriguez@onlyif.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4.7,
      reviews: 156,
      experience: '10 years',
      specializations: ['Luxury Properties', 'Townhouses', 'Investment Properties'],
      languages: ['English', 'Spanish', 'Portuguese'],
      bio: 'Specializing in luxury properties and high-end real estate.',
      propertiesSold: 203,
      averageDaysOnMarket: 25,
      office: 'OnlyIf West Austin Office',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/emilyrodriguez',
        twitter: 'https://twitter.com/emilyrodriguez',
        instagram: 'https://instagram.com/emilyrodriguez'
      }
    },
    similarProperties: ['1', '2'],
    dateListed: '2024-01-20',
    daysOnMarket: 40,
    hasRequiredMedia: true,
    isAdminApproved: true,
    canChangeVisibility: true,
    visibilityLastUpdated: '2024-01-20'
  },
  {
    id: '4',
    title: 'Cozy Bungalow',
    address: '321 Elm St, Austin, TX 78704',
    city: 'Austin',
    state: 'TX',
    zipCode: '78704',
    price: 380000,
    beds: 2,
    baths: 1,
    size: 1100,
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    ],
    description: 'Charming bungalow with character, updated kitchen, and fenced backyard.',
    yearBuilt: 1950,
    lotSize: 0.2,
    propertyType: 'Single Family',
    status: 'public' as const,
    features: [
      'Character home',
      'Updated kitchen',
      'Fenced backyard',
      'Original hardwood',
      'Covered porch',
      'Mature trees'
    ],
    coordinates: {
      lat: 30.2500,
      lng: -97.7594
    },
    agent: {
      id: 'agent4',
      name: 'David Thompson',
      title: 'Historic Homes Specialist',
      phone: '(512) 555-0126',
      email: 'david.thompson@onlyif.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.6,
      reviews: 74,
      experience: '12 years',
      specializations: ['Historic Homes', 'Character Properties', 'Renovations'],
      languages: ['English'],
      bio: 'Expert in historic and character homes with renovation potential.',
      propertiesSold: 134,
      averageDaysOnMarket: 35,
      office: 'OnlyIf South Austin Office',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/davidthompson',
        twitter: 'https://twitter.com/davidthompson',
        instagram: 'https://instagram.com/davidthompson'
      }
    },
    similarProperties: ['1', '5'],
    dateListed: '2024-01-05',
    daysOnMarket: 55,
    hasRequiredMedia: true,
    isAdminApproved: true,
    canChangeVisibility: true,
    visibilityLastUpdated: '2024-01-05'
  },
  {
    id: '5',
    title: 'Waterfront Condo',
    address: '654 Lake Dr, Austin, TX 78705',
    city: 'Austin',
    state: 'TX',
    zipCode: '78705',
    price: 850000,
    beds: 3,
    baths: 2,
    size: 1800,
    featured: true,
    mainImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=800&h=600&fit=crop',
    ],
    description: 'Stunning waterfront condo with panoramic lake views and luxury finishes.',
    yearBuilt: 2019,
    lotSize: 0.05,
    propertyType: 'Condo',
    status: 'public' as const,
    features: [
      'Waterfront location',
      'Panoramic lake views',
      'Luxury finishes',
      'Floor-to-ceiling windows',
      'Private balcony',
      'Concierge service'
    ],
    coordinates: {
      lat: 30.2849,
      lng: -97.7341
    },
    agent: {
      id: 'agent5',
      name: 'Lisa Wang',
      title: 'Waterfront Property Specialist',
      phone: '(512) 555-0127',
      email: 'lisa.wang@onlyif.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      reviews: 112,
      experience: '7 years',
      specializations: ['Waterfront Properties', 'Luxury Condos', 'Lake Properties'],
      languages: ['English', 'Mandarin', 'Cantonese'],
      bio: 'Specializing in waterfront and luxury properties around Austin.',
      propertiesSold: 87,
      averageDaysOnMarket: 22,
      office: 'OnlyIf Lake Austin Office',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/lisawang',
        twitter: 'https://twitter.com/lisawang',
        instagram: 'https://instagram.com/lisawang'
      }
    },
    similarProperties: ['1', '3'],
    dateListed: '2024-01-25',
    daysOnMarket: 35,
    hasRequiredMedia: true,
    isAdminApproved: true,
    canChangeVisibility: true,
    visibilityLastUpdated: '2024-01-25'
  },
  {
    id: '6',
    title: 'Historic Victorian',
    address: '987 Heritage Ln, Austin, TX 78706',
    city: 'Austin',
    state: 'TX',
    zipCode: '78706',
    price: 1200000,
    beds: 5,
    baths: 4,
    size: 3500,
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    ],
    description: 'Magnificent Victorian home with original details, grand staircase, and carriage house.',
    yearBuilt: 1890,
    lotSize: 0.5,
    propertyType: 'Single Family',
    status: 'public' as const,
    features: [
      'Original details',
      'Grand staircase',
      'Carriage house',
      'High ceilings',
      'Period features',
      'Large rooms'
    ],
    coordinates: {
      lat: 30.2672,
      lng: -97.7431
    },
    agent: {
      id: 'agent6',
      name: 'Robert Wilson',
      title: 'Historic Properties Specialist',
      phone: '(512) 555-0987',
      email: 'robert.wilson@onlyif.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      reviews: 95,
      experience: '15 years',
      specializations: ['Historic Properties', 'Victorian Homes', 'Heritage Properties'],
      languages: ['English'],
      bio: 'Expert in historic and heritage properties with architectural significance.',
      propertiesSold: 78,
      averageDaysOnMarket: 45,
      office: 'OnlyIf Heritage Office',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/robertwilson',
        twitter: 'https://twitter.com/robertwilson',
        instagram: 'https://instagram.com/robertwilson'
      }
    },
    similarProperties: ['4', '8'],
    dateListed: '2024-01-12',
    daysOnMarket: 48,
    hasRequiredMedia: true,
    isAdminApproved: true,
    canChangeVisibility: true,
    visibilityLastUpdated: '2024-01-12'
  },
  {
    id: '7',
    title: 'Modern Loft',
    address: '147 Industrial Blvd, Austin, TX 78707',
    city: 'Austin',
    state: 'TX',
    zipCode: '78707',
    price: 520000,
    beds: 1,
    baths: 1,
    size: 900,
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=800&h=600&fit=crop',
    ],
    description: 'Industrial-chic loft with exposed brick, high ceilings, and urban location.',
    yearBuilt: 2017,
    lotSize: 0.08,
    propertyType: 'Loft',
    status: 'public' as const,
    features: [
      'Exposed brick',
      'High ceilings',
      'Urban location',
      'Industrial design',
      'Open floor plan',
      'Modern fixtures'
    ],
    coordinates: {
      lat: 30.2849,
      lng: -97.7341
    },
    agent: {
      id: 'agent7',
      name: 'Jessica Martinez',
      title: 'Urban Properties Specialist',
      phone: '(512) 555-0147',
      email: 'jessica.martinez@onlyif.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4.7,
      reviews: 83,
      experience: '5 years',
      specializations: ['Urban Properties', 'Lofts', 'Industrial Spaces'],
      languages: ['English', 'Spanish'],
      bio: 'Specializing in urban and industrial properties in downtown Austin.',
      propertiesSold: 67,
      averageDaysOnMarket: 30,
      office: 'OnlyIf Urban Office',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/jessicamartinez',
        twitter: 'https://twitter.com/jessicamartinez',
        instagram: 'https://instagram.com/jessicamartinez'
      }
    },
    similarProperties: ['1', '3'],
    dateListed: '2024-01-18',
    daysOnMarket: 42,
    hasRequiredMedia: true,
    isAdminApproved: true,
    canChangeVisibility: true,
    visibilityLastUpdated: '2024-01-18'
  },
  {
    id: '8',
    title: 'Suburban Ranch',
    address: '258 Country Rd, Austin, TX 78708',
    city: 'Austin',
    state: 'TX',
    zipCode: '78708',
    price: 680000,
    beds: 3,
    baths: 2,
    size: 2200,
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    ],
    description: 'Spacious ranch-style home with large lot, mature trees, and peaceful setting.',
    yearBuilt: 2005,
    lotSize: 0.4,
    propertyType: 'Single Family',
    status: 'public' as const,
    features: [
      'Large lot',
      'Mature trees',
      'Peaceful setting',
      'Ranch style',
      'Single level',
      'Open layout'
    ],
    coordinates: {
      lat: 30.2500,
      lng: -97.7594
    },
    agent: {
      id: 'agent8',
      name: 'Thomas Anderson',
      title: 'Suburban Properties Specialist',
      phone: '(512) 555-0258',
      email: 'thomas.anderson@onlyif.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.6,
      reviews: 91,
      experience: '9 years',
      specializations: ['Suburban Properties', 'Ranch Homes', 'Family Properties'],
      languages: ['English'],
      bio: 'Expert in suburban and family-oriented properties in Austin area.',
      propertiesSold: 124,
      averageDaysOnMarket: 38,
      office: 'OnlyIf Suburban Office',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/thomasanderson',
        twitter: 'https://twitter.com/thomasanderson',
        instagram: 'https://instagram.com/thomasanderson'
      }
    },
    similarProperties: ['2', '4'],
    dateListed: '2024-01-08',
    daysOnMarket: 52,
    hasRequiredMedia: true,
    isAdminApproved: true,
    canChangeVisibility: true,
    visibilityLastUpdated: '2024-01-08'
  }
];

export const propertiesApi = {
  async getProperties(params: PropertySearchParams = {}): Promise<PaginatedPropertiesResponse> {
    return withMockFallback(
      async () => {
        await delay(800);
        // Mock implementation
        const { page = 1, limit = 10, search, minPrice, maxPrice, beds, baths, propertyType, city } = params;
        
        let filteredProperties = [...mockProperties];
        
        if (search) {
          const searchLower = search.toLowerCase();
          filteredProperties = filteredProperties.filter(p => 
            p.title.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.address.toLowerCase().includes(searchLower)
          );
        }
        
        if (minPrice) filteredProperties = filteredProperties.filter(p => p.price >= minPrice);
        if (maxPrice) filteredProperties = filteredProperties.filter(p => p.price <= maxPrice);
        if (beds) filteredProperties = filteredProperties.filter(p => p.beds >= beds);
        if (baths) filteredProperties = filteredProperties.filter(p => p.baths >= baths);
        if (propertyType) filteredProperties = filteredProperties.filter(p => p.propertyType === propertyType);
        if (city) filteredProperties = filteredProperties.filter(p => p.city.toLowerCase() === city.toLowerCase());
        
        const total = filteredProperties.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const properties = filteredProperties.slice(startIndex, endIndex);
        
        return {
          properties,
          total,
          page,
          limit,
          totalPages
        };
      },
      // Real API call with validation
      async () => {
        try {
          const response = await apiClient.get('/properties', { params });
          const data = response.data;
          
          // Validate and ensure proper structure
          if (!data || typeof data !== 'object') {
            console.warn('Invalid API response structure, using fallback');
            return {
              properties: [],
              total: 0,
              page: 1,
              limit: 10,
              totalPages: 0
            };
          }
          
          // Ensure properties is always an array
          const properties = Array.isArray(data.properties) ? data.properties : 
                           Array.isArray(data) ? data : [];
          
          return {
            properties,
            total: data.total || properties.length,
            page: data.page || 1,
            limit: data.limit || 10,
            totalPages: data.totalPages || Math.ceil((data.total || properties.length) / (data.limit || 10))
          };
        } catch (error) {
          console.error('Error fetching properties:', error);
          throw error;
        }
      }
    );
  },

  async getPropertyById(id: string): Promise<Property> {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(500);
        const property = mockProperties.find(p => p.id === id);
        if (!property) {
          throw new Error(`Property with id ${id} not found`);
        }
        return property;
      },
      // Real API call
      async () => {
        const response = await apiClient.get(`/properties/${id}`);
        return response.data;
      }
    );
  },

  async searchProperties(params: PropertySearchParams): Promise<PaginatedPropertiesResponse> {
    return this.getProperties(params);
  },

  async getPropertiesNearLocation(
    latitude: number, 
    longitude: number, 
    radius: number = 10,
    filters: Partial<PropertySearchParams> = {}
  ): Promise<PaginatedPropertiesResponse> {
    return withMockFallback(
      async () => {
        await delay(600);
        // Mock implementation - filter by distance (simplified)
        const filteredProperties = mockProperties.filter(property => {
          const distance = Math.sqrt(
            Math.pow(property.coordinates.lat - latitude, 2) + 
            Math.pow(property.coordinates.lng - longitude, 2)
          ) * 111; // Rough conversion to km
          return distance <= radius;
        });
        
        return {
          properties: filteredProperties,
          total: filteredProperties.length,
          page: 1,
          limit: filteredProperties.length,
          totalPages: 1
        };
      },
      async () => {
        const response = await apiClient.get('/properties/near', {
          params: { latitude, longitude, radius, ...filters }
        });
        return response.data;
      }
    );
  },

  async submitProperty(propertyData: Partial<Property>): Promise<Property> {
    return withMockFallback(
      async () => {
        await delay(1000);
        // Mock implementation
        const newProperty = {
          ...propertyData,
          id: Date.now().toString(),
          dateListed: new Date().toISOString().split('T')[0],
          daysOnMarket: 0,
          status: 'draft' as const
        };
        return newProperty as Property;
      },
      async () => {
        const response = await apiClient.post('/properties', propertyData);
        return response.data;
      }
    );
  },

  async updateProperty(id: string, propertyData: Partial<Property>): Promise<Property> {
    return withMockFallback(
      async () => {
        await delay(800);
        const existingProperty = mockProperties.find(p => p.id === id);
        if (!existingProperty) {
          throw new Error(`Property with id ${id} not found`);
        }
        return { ...existingProperty, ...propertyData };
      },
      async () => {
        const response = await apiClient.put(`/properties/${id}`, propertyData);
        return response.data;
      }
    );
  },

  async deleteProperty(id: string): Promise<void> {
    return withMockFallback(
      async () => {
        await delay(500);
        const index = mockProperties.findIndex(p => p.id === id);
        if (index === -1) {
          throw new Error(`Property with id ${id} not found`);
        }
        // In real implementation, this would remove from array
        console.log(`Mock: Property ${id} deleted`);
      },
      async () => {
        await apiClient.delete(`/properties/${id}`);
      }
    );
  },

  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    return withMockFallback(
      async () => {
        await delay(400);
        return mockProperties.filter(p => p.featured).slice(0, limit);
      },
      async () => {
        const response = await apiClient.get('/properties/featured', {
          params: { limit }
        });
        return response.data;
      }
    );
  },

  async getPropertyStats(): Promise<any> {
    return withMockFallback(
      async () => {
        await delay(300);
        return {
          totalProperties: mockProperties.length,
          averagePrice: mockProperties.reduce((sum, p) => sum + p.price, 0) / mockProperties.length,
          featuredCount: mockProperties.filter(p => p.featured).length,
          cityDistribution: mockProperties.reduce((acc, p) => {
            acc[p.city] = (acc[p.city] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };
      },
      async () => {
        const response = await apiClient.get('/properties/stats');
        return response.data;
      }
    );
  },

  async uploadPropertyImages(propertyId: string, images: File[]): Promise<string[]> {
    return withMockFallback(
      async () => {
        await delay(2000);
        // Mock implementation - return fake URLs
        return images.map((_, index) => 
          `https://images.unsplash.com/photo-${Date.now()}-${index}?w=800&h=600&fit=crop`
        );
      },
      async () => {
        const formData = new FormData();
        images.forEach((image, index) => {
          formData.append(`images`, image);
        });
        
        const response = await apiClient.post(`/properties/${propertyId}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.imageUrls;
      }
    );
  },

  async getPropertyBySlug(slug: string): Promise<Property> {
    return withMockFallback(
      async () => {
        await delay(500);
        // Mock implementation - find by title converted to slug
        const property = mockProperties.find(p => 
          p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') === slug
        );
        if (!property) {
          throw new Error(`Property with slug ${slug} not found`);
        }
        return property;
      },
      async () => {
        const response = await apiClient.get(`/properties/slug/${slug}`);
        return response.data;
      }
    );
  },

  async getPropertiesByOwner(ownerId: string, params: PropertySearchParams = {}): Promise<PaginatedPropertiesResponse> {
    return withMockFallback(
      async () => {
        await delay(600);
        // Mock implementation - filter by agent id as owner
        const ownerProperties = mockProperties.filter(p => p.agent.id === ownerId);
        
        const { page = 1, limit = 10 } = params;
        const total = ownerProperties.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const properties = ownerProperties.slice(startIndex, endIndex);
        
        return {
          properties,
          total,
          page,
          limit,
          totalPages
        };
      },
      async () => {
        const response = await apiClient.get(`/properties/owner/${ownerId}`, { params });
        return response.data;
      }
    );
  },

  async toggleFavorite(propertyId: string): Promise<{ isFavorite: boolean }> {
    return withMockFallback(
      async () => {
        await delay(300);
        // Mock implementation
        const isFavorite = Math.random() > 0.5;
        return { isFavorite };
      },
      async () => {
        const response = await apiClient.post(`/properties/${propertyId}/favorite`);
        return response.data;
      }
    );
  },

  async getFavoriteProperties(params: PropertySearchParams = {}): Promise<PaginatedPropertiesResponse> {
    return withMockFallback(
      async () => {
        await delay(500);
        // Mock implementation - return random subset
        const favoriteProperties = mockProperties.slice(0, 3);
        
        const { page = 1, limit = 10 } = params;
        const total = favoriteProperties.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const properties = favoriteProperties.slice(startIndex, endIndex);
        
        return {
          properties,
          total,
          page,
          limit,
          totalPages
        };
      },
      async () => {
        const response = await apiClient.get('/properties/favorites', { params });
        return response.data;
      }
    );
  },

  async getFilterOptions(): Promise<FilterOptionsData> {
    return withMockFallback(
      async () => {
        await delay(200);
        return {
          propertyTypes: ['Condo', 'Single Family', 'Townhouse', 'Loft'],
          cities: ['Austin'],
          priceRanges: [
            { min: 0, max: 500000, label: 'Under $500K' },
            { min: 500000, max: 1000000, label: '$500K - $1M' },
            { min: 1000000, max: null, label: 'Over $1M' }
          ],
          bedrooms: [1, 2, 3, 4, 5],
          bathrooms: [1, 2, 3, 4]
        };
      },
      async () => {
        const response = await apiClient.get('/properties/filter-options');
        return response.data;
      }
    );
  },

  async createProperty(propertyData: any) {
    return withMockFallback(
      async () => {
        await delay(1000);
        const newProperty = {
          ...propertyData,
          id: Date.now().toString(),
          dateListed: new Date().toISOString().split('T')[0],
          daysOnMarket: 0,
          status: 'draft' as const
        };
        return newProperty;
      },
      async () => {
        const response = await apiClient.post('/properties', propertyData);
        return response.data;
      }
    );
  }
};

export default propertiesApi;
export const submitProperty = propertiesApi.submitProperty;
export const getFeaturedProperties = propertiesApi.getFeaturedProperties;
export const getFilterOptions = propertiesApi.getFilterOptions;
