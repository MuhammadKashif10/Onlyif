import propertiesData from '@/data/properties.json';
import testimonialsData from '@/data/testimonials.json';
import { getSafeImageUrl, getSafeImageArray } from './imageUtils';

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  beds: number;
  baths: number;
  size: number;
  yearBuilt: number;
  lotSize: number;
  propertyType: string;
  status: string;
  description: string;
  features: string[];
  images: string[];
  mainImage: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar: string;
    rating: number;
    reviews: number;
  };
  similarProperties: string[];
  featured: boolean;
  dateListed: string;
  daysOnMarket: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  propertyType: string;
  location: string;
  date: string;
}

export interface FilterOptions {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  beds?: number;
  baths?: number;
  sizeMin?: number;
  sizeMax?: number;
  propertyType?: string;
  sortBy?: 'price' | 'size' | 'date' | 'beds';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SearchOptions {
  query: string;
  filters?: FilterOptions;
  pagination?: PaginationOptions;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class DataService {
  // Fix: Access the properties array from the nested structure
  private static properties: Property[] = propertiesData.properties;
  private static testimonials: Testimonial[] = testimonialsData.testimonials;

  // Convert local image paths to Unsplash URLs
  private static convertImagePath(imagePath: string, index: number = 0): string {
    if (imagePath.startsWith('/images/')) {
      const unsplashImages = [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', // Modern house
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80', // Luxury home
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80', // Beautiful villa
        'https://images.unsplash.com/photo-1560185008-b033106af5e4?auto=format&fit=crop&w=800&q=80', // Family home
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80', // Contemporary house
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', // Modern exterior
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80', // Apartment building
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'  // Kitchen interior
      ];
      return unsplashImages[index % unsplashImages.length];
    }
    return imagePath;
  }

  // Apply image conversion to property
  // Update the convertPropertyImages method
  private static convertPropertyImages(property: Property): Property {
    return {
      ...property,
      mainImage: getSafeImageUrl(property.mainImage, 'property', property.propertyType),
      images: getSafeImageArray(property.images, property.propertyType, 3)
    };
  }

  // Get all properties with optional filtering
  static async getProperties(filters?: FilterOptions, pagination?: PaginationOptions): Promise<{
    properties: Property[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    await delay(300);

    let filteredProperties = [...this.properties].map(property => this.convertPropertyImages(property));

    // Apply filters
    if (filters) {
      if (filters.location) {
        filteredProperties = filteredProperties.filter(property =>
          property.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
          property.address.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters.priceMin !== undefined) {
        filteredProperties = filteredProperties.filter(property => property.price >= filters.priceMin!);
      }

      if (filters.priceMax !== undefined) {
        filteredProperties = filteredProperties.filter(property => property.price <= filters.priceMax!);
      }

      if (filters.beds !== undefined) {
        filteredProperties = filteredProperties.filter(property => property.beds >= filters.beds!);
      }

      if (filters.baths !== undefined) {
        filteredProperties = filteredProperties.filter(property => property.baths >= filters.baths!);
      }

      if (filters.sizeMin !== undefined) {
        filteredProperties = filteredProperties.filter(property => property.size >= filters.sizeMin!);
      }

      if (filters.sizeMax !== undefined) {
        filteredProperties = filteredProperties.filter(property => property.size <= filters.sizeMax!);
      }

      if (filters.propertyType) {
        filteredProperties = filteredProperties.filter(property => 
          property.propertyType === filters.propertyType
        );
      }
    }

    // Apply sorting
    if (filters?.sortBy) {
      filteredProperties.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (filters.sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'size':
            aValue = a.size;
            bValue = b.size;
            break;
          case 'date':
            aValue = new Date(a.dateListed);
            bValue = new Date(b.dateListed);
            break;
          case 'beds':
            aValue = a.beds;
            bValue = b.beds;
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    const total = filteredProperties.length;

    // Apply pagination
    if (pagination) {
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      filteredProperties = filteredProperties.slice(startIndex, endIndex);
    }

    return {
      properties: filteredProperties,
      total,
      page: pagination?.page || 1,
      totalPages: pagination ? Math.ceil(total / pagination.limit) : 1
    };
  }

  // Get a single property by ID
  static async getPropertyById(id: string): Promise<Property | null> {
    await delay(200);
    const property = this.properties.find(property => property.id === id);
    return property ? this.convertPropertyImages(property) : null;
  }

  // Get featured properties
  static async getFeaturedProperties(limit: number = 4): Promise<Property[]> {
    await delay(200);
    return this.properties
      .filter(property => property.featured)
      .slice(0, limit)
      .map(property => this.convertPropertyImages(property));
  }

  // Get similar properties
  static async getSimilarProperties(propertyId: string, limit: number = 3): Promise<Property[]> {
    await delay(200);
    const property = this.properties.find(p => p.id === propertyId);
    if (!property) return [];

    const similarIds = property.similarProperties;
    return this.properties
      .filter(p => similarIds.includes(p.id))
      .slice(0, limit)
      .map(property => this.convertPropertyImages(property));
  }

  // Search properties
  static async searchProperties(options: SearchOptions): Promise<{
    properties: Property[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    await delay(400);

    let filteredProperties = this.properties
      .filter(property =>
        property.title.toLowerCase().includes(options.query.toLowerCase()) ||
        property.address.toLowerCase().includes(options.query.toLowerCase()) ||
        property.description.toLowerCase().includes(options.query.toLowerCase())
      )
      .map(property => this.convertPropertyImages(property));

    // Apply additional filters if provided
    if (options.filters) {
      const result = await this.getProperties(options.filters, options.pagination);
      filteredProperties = result.properties.filter(property =>
        property.title.toLowerCase().includes(options.query.toLowerCase()) ||
        property.address.toLowerCase().includes(options.query.toLowerCase()) ||
        property.description.toLowerCase().includes(options.query.toLowerCase())
      );
      return {
        properties: filteredProperties,
        total: filteredProperties.length,
        page: options.pagination?.page || 1,
        totalPages: options.pagination ? Math.ceil(filteredProperties.length / options.pagination.limit) : 1
      };
    }

    const total = filteredProperties.length;

    // Apply pagination
    if (options.pagination) {
      const startIndex = (options.pagination.page - 1) * options.pagination.limit;
      const endIndex = startIndex + options.pagination.limit;
      filteredProperties = filteredProperties.slice(startIndex, endIndex);
    }

    return {
      properties: filteredProperties,
      total,
      page: options.pagination?.page || 1,
      totalPages: options.pagination ? Math.ceil(total / options.pagination.limit) : 1
    };
  }

  // Get testimonials
  static async getTestimonials(limit?: number): Promise<Testimonial[]> {
    await delay(200);
    const testimonials = [...this.testimonials];
    return limit ? testimonials.slice(0, limit) : testimonials;
  }

  // Get featured testimonials
  static async getFeaturedTestimonials(limit: number = 3): Promise<Testimonial[]> {
    await delay(200);
    return this.testimonials.slice(0, limit);
  }

  // Get property statistics
  static async getPropertyStats(): Promise<{
    totalProperties: number;
    averagePrice: number;
    totalValue: number;
    featuredCount: number;
  }> {
    await delay(100);
    
    const totalProperties = this.properties.length;
    const totalValue = this.properties.reduce((sum, property) => sum + property.price, 0);
    const averagePrice = totalValue / totalProperties;
    const featuredCount = this.properties.filter(property => property.featured).length;

    return {
      totalProperties,
      averagePrice,
      totalValue,
      featuredCount
    };
  }

  // Get unique property types
  static async getPropertyTypes(): Promise<string[]> {
    await delay(100);
    const types = [...new Set(this.properties.map(property => property.propertyType))];
    return types.sort();
  }

  // Get unique cities
  static async getCities(): Promise<string[]> {
    await delay(100);
    const cities = [...new Set(this.properties.map(property => property.city))];
    return cities.sort();
  }

  // Get price range
  static async getPriceRange(): Promise<{ min: number; max: number }> {
    await delay(100);
    const prices = this.properties.map(property => property.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  // Get size range
  static async getSizeRange(): Promise<{ min: number; max: number }> {
    await delay(100);
    const sizes = this.properties.map(property => property.size);
    return {
      min: Math.min(...sizes),
      max: Math.max(...sizes)
    };
  }
}
