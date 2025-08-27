import { NextRequest, NextResponse } from 'next/server';
import { USE_MOCKS } from '@/utils/mockWrapper';

// Mock agents data (same as in main route)
const mockAgents = [
  {
    id: "agent-1",
    name: "Sarah Johnson",
    title: "Senior Real Estate Agent",
    phone: "(512) 555-0123",
    email: "sarah.johnson@onlyif.com",
    avatar: "/images/agent-1.jpg",
    rating: 4.9,
    reviews: 127,
    experience: "8 years",
    specializations: ["Single Family Homes", "Luxury Properties", "First-time Buyers"],
    languages: ["English", "Spanish"],
    bio: "Sarah is a dedicated real estate professional with over 8 years of experience helping families find their dream homes in Austin.",
    propertiesSold: 156,
    averageDaysOnMarket: 12,
    office: "Austin Downtown",
    socialMedia: {
      linkedin: "https://linkedin.com/in/sarah-johnson",
      twitter: "https://twitter.com/sarahjohnson",
      instagram: "https://instagram.com/sarahjohnson"
    }
  },
  {
    id: "agent-4",
    name: "David Thompson",
    title: "Investment Property Expert",
    phone: "(512) 555-0126",
    email: "david.thompson@onlyif.com",
    avatar: "/images/agent-4.jpg",
    rating: 4.9,
    reviews: 203,
    experience: "15 years",
    specializations: ["Investment Properties", "Multi-family", "Commercial"],
    languages: ["English"],
    bio: "David is a seasoned investment property expert with 15 years of experience.",
    propertiesSold: 342,
    averageDaysOnMarket: 10,
    office: "Austin South",
    socialMedia: {
      linkedin: "https://linkedin.com/in/david-thompson",
      twitter: "https://twitter.com/davidthompson",
      instagram: "https://instagram.com/davidthompson"
    }
  },
  {
    id: "agent-2",
    name: "Michael Chen",
    title: "Luxury Property Specialist",
    phone: "(512) 555-0124",
    email: "michael.chen@onlyif.com",
    avatar: "/images/agent-2.jpg",
    rating: 4.8,
    reviews: 89,
    experience: "12 years",
    specializations: ["Luxury Properties", "Investment Properties", "International Buyers"],
    languages: ["English", "Mandarin"],
    bio: "Michael is a luxury property specialist with 12 years of experience.",
    propertiesSold: 234,
    averageDaysOnMarket: 8,
    office: "Austin Central",
    socialMedia: {
      linkedin: "https://linkedin.com/in/michael-chen",
      twitter: "https://twitter.com/michaelchen",
      instagram: "https://instagram.com/michaelchen"
    }
  }
];

// GET /api/agents/top - Get top performing agents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3');
    
    if (USE_MOCKS) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sort agents by rating and properties sold, then take top N
      const topAgents = mockAgents
        .sort((a, b) => {
          // First sort by rating (descending)
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          // Then by properties sold (descending)
          return b.propertiesSold - a.propertiesSold;
        })
        .slice(0, limit);
      
      return NextResponse.json({
        success: true,
        data: topAgents
      });
    }
    
    // Return empty array when not using mocks
    return NextResponse.json({
      success: true,
      data: []
    });
    
  } catch (error) {
    console.error('Error fetching top agents:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}