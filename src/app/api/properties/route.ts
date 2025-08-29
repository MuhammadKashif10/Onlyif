import { NextRequest, NextResponse } from 'next/server';
import { USE_MOCKS } from '@/utils/mockWrapper';

// Mock property data
const mockProperties = [
  {
    id: '1',
    title: 'Modern Downtown Condo',
    address: '123 Main St, Austin, TX 78701',
    price: 450000,
    beds: 2,
    baths: 2,
    size: 1200,
    featured: true,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=800&h=600&fit=crop',
    ],
    description: 'Beautiful modern condo in the heart of downtown Austin. Features open floor plan, high ceilings, and stunning city views.',
    yearBuilt: 2018,
    lotSize: 0.1,
    propertyType: 'Condo',
    status: 'For Sale'
  },
  {
    id: '2',
    title: 'Spacious Family Home',
    address: '456 Oak Ave, Austin, TX 78702',
    price: 750000,
    beds: 4,
    baths: 3,
    size: 2800,
    featured: false,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    ],
    description: 'Perfect family home with large backyard, updated kitchen, and plenty of storage space.',
    yearBuilt: 2015,
    lotSize: 0.3,
    propertyType: 'Single Family',
    status: 'For Sale'
  },
  {
    id: '3',
    title: 'Luxury Townhouse',
    address: '789 Pine St, Austin, TX 78703',
    price: 650000,
    beds: 3,
    baths: 2.5,
    size: 2100,
    featured: true,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=800&h=600&fit=crop',
    ],
    description: 'Elegant townhouse with modern amenities, private garage, and community pool.',
    yearBuilt: 2020,
    lotSize: 0.15,
    propertyType: 'Townhouse',
    status: 'For Sale'
  },
  {
    id: '4',
    title: 'Cozy Bungalow',
    address: '321 Elm St, Austin, TX 78704',
    price: 380000,
    beds: 2,
    baths: 1,
    size: 1100,
    featured: false,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    ],
    description: 'Charming bungalow with character, updated kitchen, and fenced backyard.',
    yearBuilt: 1950,
    lotSize: 0.2,
    propertyType: 'Single Family',
    status: 'For Sale'
  },
  {
    id: '5',
    title: 'Waterfront Condo',
    address: '654 Lake Dr, Austin, TX 78705',
    price: 850000,
    beds: 3,
    baths: 2,
    size: 1800,
    featured: true,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=800&h=600&fit=crop',
    ],
    description: 'Stunning waterfront condo with lake views, balcony, and resort-style amenities.',
    yearBuilt: 2019,
    lotSize: 0.05,
    propertyType: 'Condo',
    status: 'For Sale'
  },
  {
    id: '6',
    title: 'Historic Victorian',
    address: '987 Heritage Ln, Austin, TX 78706',
    price: 1200000,
    beds: 5,
    baths: 4,
    size: 3500,
    featured: false,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    ],
    description: 'Magnificent Victorian home with original details, grand staircase, and carriage house.',
    yearBuilt: 1890,
    lotSize: 0.5,
    propertyType: 'Single Family',
    status: 'For Sale'
  },
  {
    id: '7',
    title: 'Modern Loft',
    address: '147 Industrial Blvd, Austin, TX 78707',
    price: 520000,
    beds: 1,
    baths: 1,
    size: 900,
    featured: false,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-5c9a0c9a0c9a?w=800&h=600&fit=crop',
    ],
    description: 'Industrial-chic loft with exposed brick, high ceilings, and urban location.',
    yearBuilt: 2017,
    lotSize: 0.08,
    propertyType: 'Loft',
    status: 'For Sale'
  },
  {
    id: '8',
    title: 'Suburban Ranch',
    address: '258 Country Rd, Austin, TX 78708',
    price: 680000,
    beds: 3,
    baths: 2,
    size: 2200,
    featured: false,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    ],
    description: 'Spacious ranch-style home with large lot, mature trees, and peaceful setting.',
    yearBuilt: 2005,
    lotSize: 0.4,
    propertyType: 'Single Family',
    status: 'For Sale'
  }
];

export async function GET(request: NextRequest) {
  // Check if we should use mocks
  if (USE_MOCKS) {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '12');
      const featured = searchParams.get('featured');
      const city = searchParams.get('city');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const propertyType = searchParams.get('propertyType');

      let filteredProperties = [...mockProperties];

      // Apply filters
      if (featured === 'true') {
        filteredProperties = filteredProperties.filter(p => p.featured);
      }
      if (city) {
        filteredProperties = filteredProperties.filter(p => 
          p.address.toLowerCase().includes(city.toLowerCase())
        );
      }
      if (minPrice) {
        filteredProperties = filteredProperties.filter(p => p.price >= parseInt(minPrice));
      }
      if (maxPrice) {
        filteredProperties = filteredProperties.filter(p => p.price <= parseInt(maxPrice));
      }
      if (propertyType) {
        filteredProperties = filteredProperties.filter(p => p.propertyType === propertyType);
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return NextResponse.json({
        properties: paginatedProperties,
        total: filteredProperties.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProperties.length / limit)
      });
    } catch (error) {
      console.error('Error in properties API:', error);
      return NextResponse.json(
        { error: 'Failed to fetch properties' },
        { status: 500 }
      );
    }
  } else {
    // Proxy to backend API
    try {
      const { searchParams } = new URL(request.url);
      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/properties?${searchParams.toString()}`;
      
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }
      
      const result = await response.json();
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error proxying to backend API:', error);
      return NextResponse.json(
        { error: 'Failed to fetch properties from backend' },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    let propertyData: any;
    
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Transform FormData to match backend Property model structure
      propertyData = {
        title: formData.get('title') as string,
        address: {
          street: formData.get('address') as string,
          city: formData.get('city') as string,
          state: formData.get('state') as string,
          zipCode: formData.get('zipCode') as string,
          country: 'US'
        },
        location: {
          type: 'Point',
          coordinates: [
            parseFloat(formData.get('longitude') as string) || -97.7431, // Default to Austin, TX
            parseFloat(formData.get('latitude') as string) || 30.2672
          ]
        },
        propertyType: (formData.get('propertyType') as string)?.toLowerCase().replace(' ', '-') || 'single-family',
        price: parseFloat(formData.get('price') as string),
        beds: parseInt(formData.get('beds') as string),
        baths: parseFloat(formData.get('baths') as string),
        squareMeters: parseFloat(formData.get('squareMeters') as string),
        yearBuilt: parseInt(formData.get('yearBuilt') as string) || undefined,
        description: formData.get('description') as string || '',
        // Add required contactInfo fields
        contactInfo: {
          name: formData.get('contactName') as string || 'Property Owner',
          email: formData.get('contactEmail') as string || 'owner@example.com',
          phone: formData.get('contactPhone') as string || '555-0123'
        }
      };
      
      // Handle image files
      const imageFiles = [];
      let index = 0;
      while (formData.get(`images_${index}`)) {
        const file = formData.get(`images_${index}`) as File;
        if (file && file.size > 0) {
          imageFiles.push({
            url: `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop`, // Placeholder
            caption: file.name,
            isPrimary: index === 0,
            order: index
          });
        }
        index++;
      }
      propertyData.images = imageFiles;
      
    } else {
      propertyData = await request.json();
    }

    if (USE_MOCKS) {
      // Mock implementation - add to in-memory array
      const newProperty = {
        id: Date.now().toString(),
        ...propertyData,
        // Flatten address for mock compatibility
        address: `${propertyData.address?.street}, ${propertyData.address?.city}, ${propertyData.address?.state} ${propertyData.address?.zipCode}`,
        featured: false,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
        ]
      };
      
      mockProperties.push(newProperty);
      
      return NextResponse.json({
        success: true,
        data: newProperty,
        message: 'Property created successfully (mock)'
      });
    } else {
      // Real API implementation
      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/properties`;
      
      // Get auth token from request headers
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '') || '';
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Backend API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Property created successfully'
      });
    }
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create property',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}