import { NextRequest, NextResponse } from 'next/server';
import { USE_MOCKS } from '@/utils/mockWrapper';

// Mock agents data
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
    bio: "Michael is a luxury property specialist with 12 years of experience. He has helped numerous international clients invest in premium Austin real estate.",
    propertiesSold: 234,
    averageDaysOnMarket: 8,
    office: "Austin Central",
    socialMedia: {
      linkedin: "https://linkedin.com/in/michael-chen",
      twitter: "https://twitter.com/michaelchen",
      instagram: "https://instagram.com/michaelchen"
    }
  },
  {
    id: "agent-3",
    name: "Emily Rodriguez",
    title: "First-Time Buyer Specialist",
    phone: "(512) 555-0125",
    email: "emily.rodriguez@onlyif.com",
    avatar: "/images/agent-3.jpg",
    rating: 4.7,
    reviews: 156,
    experience: "6 years",
    specializations: ["First-time Buyers", "Condos", "Townhomes"],
    languages: ["English", "Spanish"],
    bio: "Emily specializes in helping first-time buyers navigate the home buying process. She's known for her patience and thorough explanations of every step.",
    propertiesSold: 98,
    averageDaysOnMarket: 15,
    office: "Austin North",
    socialMedia: {
      linkedin: "https://linkedin.com/in/emily-rodriguez",
      twitter: "https://twitter.com/emilyrodriguez",
      instagram: "https://instagram.com/emilyrodriguez"
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
    bio: "David is a seasoned investment property expert with 15 years of experience. He specializes in helping investors build profitable real estate portfolios through strategic acquisitions.",
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
    id: "agent-5",
    name: "Lisa Wang",
    title: "New Construction Specialist",
    phone: "(512) 555-0127",
    email: "lisa.wang@onlyif.com",
    avatar: "/images/agent-5.jpg",
    rating: 4.8,
    reviews: 167,
    experience: "10 years",
    specializations: ["New Construction", "Custom Homes", "Luxury Properties"],
    languages: ["English", "Mandarin"],
    bio: "Lisa specializes in new construction and custom homes. She works closely with builders and developers to help clients find or build their perfect home from the ground up.",
    propertiesSold: 189,
    averageDaysOnMarket: 6,
    office: "Austin West",
    socialMedia: {
      linkedin: "https://linkedin.com/in/lisa-wang",
      twitter: "https://twitter.com/lisawang",
      instagram: "https://instagram.com/lisawang"
    }
  },
  {
    id: "agent-6",
    name: "Robert Martinez",
    title: "Senior Property Consultant",
    phone: "(512) 555-0128",
    email: "robert.martinez@onlyif.com",
    avatar: "/images/agent-6.jpg",
    rating: 4.6,
    reviews: 134,
    experience: "9 years",
    specializations: ["Single Family Homes", "Relocation", "Military Families"],
    languages: ["English", "Spanish"],
    bio: "Robert has extensive experience helping families relocate to Austin, particularly military families. He understands the unique needs of families moving to a new city.",
    propertiesSold: 178,
    averageDaysOnMarket: 14,
    office: "Austin East",
    socialMedia: {
      linkedin: "https://linkedin.com/in/robert-martinez",
      twitter: "https://twitter.com/robertmartinez",
      instagram: "https://instagram.com/robertmartinez"
    }
  }
];

// GET /api/agents - Get all agents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const office = searchParams.get('office');
    const specialization = searchParams.get('specialization');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    if (USE_MOCKS) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let filteredAgents = [...mockAgents];
      
      // Apply filters
      if (office) {
        filteredAgents = filteredAgents.filter(agent => 
          agent.office.toLowerCase().includes(office.toLowerCase())
        );
      }
      
      if (specialization) {
        filteredAgents = filteredAgents.filter(agent => 
          agent.specializations.some(spec => 
            spec.toLowerCase().includes(specialization.toLowerCase())
          )
        );
      }
      
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredAgents = filteredAgents.filter(agent => 
          agent.name.toLowerCase().includes(searchTerm) ||
          agent.title.toLowerCase().includes(searchTerm) ||
          agent.specializations.some(spec => spec.toLowerCase().includes(searchTerm)) ||
          agent.bio.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAgents = filteredAgents.slice(startIndex, endIndex);
      
      return NextResponse.json({
        success: true,
        data: paginatedAgents,
        total: filteredAgents.length,
        page,
        limit,
        totalPages: Math.ceil(filteredAgents.length / limit)
      });
    }
    
    // Real API implementation would go here
    return NextResponse.json(
      { success: false, error: 'Real API not implemented yet' },
      { status: 501 }
    );
    
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}