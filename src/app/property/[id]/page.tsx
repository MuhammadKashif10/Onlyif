import { Metadata } from 'next';
import {
  Navbar,
  Footer,
  PropertyCarousel,
  MapPlaceholder,
  SimilarProperties,
  ContactAgentForm,
  Button
} from '@/components';
import { propertiesApi } from '@/api';
import { notFound } from 'next/navigation';
import { getSafeImageArray } from '@/utils/imageUtils';
import { formatCurrencyCompact } from '@/utils/currency';

interface PropertyPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = await propertiesApi.getPropertyById(params.id);
  
  if (!property) {
    return {
      title: 'Property Not Found | OnlyIf Real Estate',
      description: 'The requested property could not be found.'
    };
  }

  return {
    title: `${property.title} - ${property.address} | OnlyIf Real Estate`,
    description: `${property.description.substring(0, 160)}...`,
    keywords: [
      'real estate',
      'property for sale',
      property.city,
      property.state,
      property.propertyType,
      `${property.beds} bedroom`,
      `${property.baths} bathroom`
    ],
    openGraph: {
      title: `${property.title} - ${property.address}`,
      description: property.description,
      type: 'website',
      locale: 'en_US',
      url: `https://onlyif.com/property/${property.id}`,
      siteName: 'OnlyIf',
      images: [
        {
          url: property.mainImage.startsWith('/') 
            ? `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=630&q=80`
            : property.mainImage,
          width: 1200,
          height: 630,
          alt: `${property.title} - Property Image`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.title} - ${property.address}`,
      description: property.description,
      images: [property.mainImage.startsWith('/') 
        ? `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=630&q=80`
        : property.mainImage],
    },
    alternates: {
      canonical: `https://onlyif.com/property/${property.id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  try {
    const property = await propertiesApi.getPropertyById(params.id);
    
    // Handle case where property is not found
    if (!property) {
      notFound();
    }
    
    // Convert local image paths to Unsplash URLs with safe handling
    const propertyImages = property.images?.map((img, index) => {
      if (img.startsWith('/')) {
        const unsplashImages = [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560185008-b033106af5e4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80'
        ];
        return unsplashImages[index % unsplashImages.length];
      }
      return img;
    }) || [];
    
    const mainImage = property.mainImage?.startsWith('/') 
      ? 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'
      : property.mainImage || '';
    
    // Utility functions
    // Remove the old formatPrice function
    // const formatPrice = (price: number) => {
    //   return new Intl.NumberFormat('en-US', {
    //     style: 'currency',
    //     currency: 'USD',
    //     minimumFractionDigits: 0,
    //     maximumFractionDigits: 0,
    //   }).format(price);
    // };
    
    const formatSize = (size: number) => {
      return `${size.toLocaleString()} sq m`; // Changed from sq ft
    };
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    // Structured data for the property
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": property.title,
      "description": property.description,
      "url": `https://onlyif.com/property/${property.id}`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address,
        "addressLocality": property.city,
        "addressRegion": property.state,
        "postalCode": property.zipCode,
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": property.coordinates?.lat,
        "longitude": property.coordinates?.lng
      },
      "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": property.size,
        "unitText": "square meters" // Changed from square feet
      },
      "numberOfRooms": property.beds,
      "numberOfBathroomsTotal": property.baths,
      "yearBuilt": property.yearBuilt,
      "image": propertyImages,
      "agent": {
        "@type": "RealEstateAgent",
        "name": property.agent?.name,
        "telephone": property.agent?.phone,
        "email": property.agent?.email
      }
    };
    
    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
    
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <Navbar 
            logo="/logo.svg"
            logoText=""
            navigationItems={[
              { label: 'Buy', href: '/browse', isActive: false },
              { label: 'Sell', href: '/sell', isActive: false },
              { label: 'How It Works', href: '/how-it-works', isActive: false },
              { label: 'About', href: '/about', isActive: false },
            ]}
            ctaText="Get Started"
            ctaHref="/signin"
          />
    
          {/* Property Images Carousel */}
          <section className="relative pt-4 sm:pt-6 md:pt-8" aria-labelledby="property-images-heading">
            <h1 id="property-images-heading" className="sr-only">
              {property.title} - Property Images
            </h1>
            <PropertyCarousel
              images={propertyImages}
              alt={`${property.title} - Property Images`}
              autoPlay={true}
              showThumbnails={true}
            />
          </section>
    
          {/* Property Details */}
          <section className="py-12" aria-labelledby="property-details-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ... existing code ... */}
              </div>
            </div>
          </section>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching property:', error);
    notFound();
  }
}

<div className="text-3xl font-bold text-blue-600 mb-4">
  {formatCurrencyCompact(property.price)}
</div>