import { NextRequest, NextResponse } from 'next/server';
import { USE_MOCKS } from '@/utils/mockWrapper';

// Mock agents data (same as in agents.ts)
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
    bio: "Michael specializes in luxury properties and investment real estate with 12 years of experience.",
    propertiesSold: 203,
    averageDaysOnMarket: 8,
    office: "Austin Downtown",
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
    specializations: ["First-time Buyers", "Condos", "Townhouses"],
    languages: ["English", "Spanish"],
    bio: "Emily is passionate about helping first-time buyers navigate the home buying process.",
    propertiesSold: 98,
    averageDaysOnMarket: 15,
    office: "Austin North",
    socialMedia: {
      linkedin: "https://linkedin.com/in/emily-rodriguez",
      twitter: "https://twitter.com/emilyrodriguez",
      instagram: "https://instagram.com/emilyrodriguez"
    }
  }
];

// Mock property assignments storage
const propertyAssignments = new Map<string, any>();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    const body = await request.json();
    const { agentId } = body;

    // Validate required fields
    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Find the agent
    const agent = mockAgents.find(a => a.id === agentId);
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Simulate assignment process
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store the assignment
    const assignment = {
      propertyId,
      agentId,
      agent,
      assignedAt: new Date().toISOString(),
      status: 'active'
    };

    propertyAssignments.set(propertyId, assignment);

    // Return success response with assigned agent details
    return NextResponse.json({
      success: true,
      data: {
        propertyId,
        assignedAgent: agent,
        assignedAt: assignment.assignedAt,
        message: `Successfully assigned ${agent.name} to property`
      }
    });

  } catch (error) {
    console.error('Error assigning agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to assign agent' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve assigned agent for a property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    const assignment = propertyAssignments.get(propertyId);

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: 'No agent assigned to this property' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: assignment
    });

  } catch (error) {
    console.error('Error retrieving assigned agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve assigned agent' },
      { status: 500 }
    );
  }
}