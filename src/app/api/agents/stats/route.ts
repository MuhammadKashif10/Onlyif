import { NextRequest, NextResponse } from 'next/server';
import { USE_MOCKS } from '@/utils/mockWrapper';

// GET /api/agents/stats - Get agent statistics
export async function GET(request: NextRequest) {
  try {
    if (USE_MOCKS) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const stats = {
        totalAgents: 6,
        totalPropertiesSold: 1197,
        averageRating: 4.8,
        averageDaysOnMarket: 11,
        totalReviews: 876,
        activeListings: 234,
        closedDealsThisMonth: 45,
        topPerformingOffice: "Austin Downtown"
      };
      
      return NextResponse.json({
        success: true,
        data: stats
      });
    }
    
    // Real API implementation would go here
    return NextResponse.json(
      { success: false, error: 'Real API not implemented yet' },
      { status: 501 }
    );
    
  } catch (error) {
    console.error('Error fetching agent stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}