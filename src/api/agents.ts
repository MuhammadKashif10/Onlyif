import { USE_MOCKS, withMockFallback } from '@/utils/mockWrapper';
import request from '@/utils/api';
import { Agent } from '@/types/api';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data - in a real app, this would come from an external API
const mockAgents: Agent[] = [
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
    bio: "Sarah is a dedicated real estate professional with over 8 years of experience helping families find their dream homes in Austin. She specializes in single-family homes and luxury properties, with a particular focus on first-time buyers.",
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
    bio: "Michael specializes in luxury properties and investment real estate. With 12 years of experience, he has helped numerous international buyers and investors find premium properties in Austin's most desirable neighborhoods.",
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
    bio: "Emily is passionate about helping first-time buyers navigate the home buying process. She has extensive experience with condos and townhouses, making her the perfect guide for new homebuyers.",
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

// API Functions
export const agentsApi = {
  // Get all agents
  async getAgents() {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(600);
        return mockAgents;
      },
      // Real API call
      async (): Promise<Agent[]> => {
        const response = await request<Agent[]>('/agents');
        return response.data;
      }
    );
  },

  // Get agent by ID
  async getAgentById(id: string) {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(400);
        const agent = mockAgents.find(a => a.id === id);
        if (!agent) {
          throw new Error('Agent not found');
        }
        return agent;
      },
      // Real API call
      async (): Promise<Agent> => {
        const response = await request<Agent>(`/agents/${id}`);
        return response.data;
      }
    );
  },

  // Get top performing agents
  async getTopAgents(limit: number = 3): Promise<Agent[]> {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(500);
        const topAgents = mockAgents
          .sort((a, b) => b.propertiesSold - a.propertiesSold)
          .slice(0, limit);
        return topAgents;
      },
      // Real API call
      async (): Promise<Agent[]> => {
        const response = await request<Agent[]>(`/agents/top?limit=${limit}`);
        return response.data;
      }
    );
  },

  // Get agents by specialization
  async getAgentsBySpecialization(specialization: string): Promise<Agent[]> {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(600);
        return mockAgents.filter(agent => 
          agent.specializations.some(spec => 
            spec.toLowerCase().includes(specialization.toLowerCase())
          )
        );
      },
      // Real API call
      async (): Promise<Agent[]> => {
        const response = await request<Agent[]>(`/agents/specialization/${encodeURIComponent(specialization)}`);
        return response.data;
      }
    );
  },

  // Get agents by office
  async getAgentsByOffice(office: string): Promise<Agent[]> {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(500);
        return mockAgents.filter(agent => 
          agent.office.toLowerCase().includes(office.toLowerCase())
        );
      },
      // Real API call
      async () => {
        const response = await request<Agent[]>(`/agents/office/${encodeURIComponent(office)}`);
        return response.data;
      }
    );
  },

  // Search agents
  async searchAgents(query: string): Promise<Agent[]> {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(800);
        const searchTerm = query.toLowerCase();
        return mockAgents.filter(agent => 
          agent.name.toLowerCase().includes(searchTerm) ||
          agent.title.toLowerCase().includes(searchTerm) ||
          agent.specializations.some(spec => spec.toLowerCase().includes(searchTerm)) ||
          agent.bio.toLowerCase().includes(searchTerm)
        );
      },
      // Real API call
      async () => {
        const response = await request<Agent[]>(`/agents/search?q=${encodeURIComponent(query)}`);
        return response.data;
      }
    );
  },

  // Get agent statistics
  async getAgentStats() {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(300);
        const totalAgents = mockAgents.length;
        const averageRating = mockAgents.reduce((sum, a) => sum + a.rating, 0) / totalAgents;
        const totalPropertiesSold = mockAgents.reduce((sum, a) => sum + a.propertiesSold, 0);
        const offices = [...new Set(mockAgents.map(a => a.office))];
        
        return {
          totalAgents,
          averageRating: Math.round(averageRating * 10) / 10,
          totalPropertiesSold,
          offices
        };
      },
      // Real API call
      async () => {
        const response = await request('/agents/stats');
        return response.data;
      }
    );
  }
};
