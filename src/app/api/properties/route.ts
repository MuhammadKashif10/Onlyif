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
      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/properties?${searchParams.toString()}`;
      
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }
      
      const data = await response.json();
      return NextResponse.json(data);
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
  if (USE_MOCKS) {
    try {
      const contentType = request.headers.get('content-type') || '';
      let propertyData: any;
      let uploadedFiles: File[] = [];

      // Handle both JSON and multipart form data
      if (contentType.includes('multipart/form-data')) {
        // Handle file uploads with form data
        const formData = await request.formData();
        
        // Extract property data from form fields
        propertyData = {
          title: formData.get('title')?.toString() || '',
          address: formData.get('address')?.toString() || '',
          city: formData.get('city')?.toString() || '',
          state: formData.get('state')?.toString() || '',
          zipCode: formData.get('zipCode')?.toString() || '',
          price: parseFloat(formData.get('price')?.toString() || '0'),
          beds: parseInt(formData.get('beds')?.toString() || '0'),
          baths: parseFloat(formData.get('baths')?.toString() || '0'),
          size: parseFloat(formData.get('squareMeters')?.toString() || '0'), // Changed from size
          propertyType: formData.get('propertyType')?.toString() || 'Single Family',
          yearBuilt: formData.get('yearBuilt') ? parseInt(formData.get('yearBuilt')?.toString() || '0') : new Date().getFullYear(),
          lotSize: formData.get('lotSize') ? parseFloat(formData.get('lotSize')?.toString() || '0') : 0.25,
          description: formData.get('description')?.toString() || '',
          features: formData.get('features') ? JSON.parse(formData.get('features')?.toString() || '[]') : [],
          contactName: formData.get('contactName')?.toString() || '',
          contactEmail: formData.get('contactEmail')?.toString() || '',
          contactPhone: formData.get('contactPhone')?.toString() || '',
          timeframe: formData.get('timeframe')?.toString() || ''
        };

        // Extract uploaded files
        for (const [key, value] of formData.entries()) {
          if (key.startsWith('images_') && value instanceof File) {
            uploadedFiles.push(value);
          }
        }
      } else {
        // Handle JSON data
        propertyData = await request.json();
      }

      // Validate required fields
      if (!propertyData.title || !propertyData.price) {
        return NextResponse.json(
          { success: false, error: 'Title and price are required' },
          { status: 400 }
        );
      }

      // Simulate file processing
      const processedImages = uploadedFiles.map((file, index) => 
        `https://images.unsplash.com/photo-${Date.now()}-${index}?w=800&h=600&fit=crop`
      );

      // Create new property with generated ID
      const newProperty = {
        id: `property_${Date.now()}`,
        ...propertyData,
        images: processedImages.length > 0 ? processedImages : [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
        ],
        mainImage: processedImages[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        status: 'pending_review',
        featured: false,
        submittedAt: new Date().toISOString(),
        dateListed: new Date().toISOString().split('T')[0],
        daysOnMarket: 0,
        hasRequiredMedia: processedImages.length > 0,
        isAdminApproved: false,
        canChangeVisibility: false,
        visibilityLastUpdated: new Date().toISOString()
      };

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return success response with proper format
      return NextResponse.json({
        success: true,
        data: {
          id: newProperty.id,
          ...newProperty
        },
        message: 'Property submitted successfully and is pending review'
      });

    } catch (error) {
      console.error('Error processing property submission:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to process property submission' },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { success: false, error: 'Real API not implemented yet' },
      { status: 501 }
    );
  }
}