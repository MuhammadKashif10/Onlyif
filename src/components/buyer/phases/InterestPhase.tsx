'use client';

import React, { useState } from 'react';
import { useBuyerContext } from '@/context/BuyerContext';
import ContactAgentForm from '@/components/reusable/ContactAgentForm';
import Button from '@/components/reusable/Button';

export default function InterestPhase() {
  const { buyerData, updateBuyerData, previousPhase } = useBuyerContext();
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  const handleInterestSubmitted = () => {
    setInterestSubmitted(true);
    updateBuyerData({ interestSubmitted: true });
  };

  const mockPropertyDetails = {
    description: "Beautiful modern home with stunning city views. This property features high-end finishes throughout, including hardwood floors, granite countertops, and stainless steel appliances. The open floor plan is perfect for entertaining, with a spacious living room that flows into the dining area and kitchen.",
    features: [
      "Hardwood floors throughout",
      "Granite countertops",
      "Stainless steel appliances",
      "Walk-in closets",
      "Private balcony",
      "In-unit laundry",
      "Parking included",
      "Pet-friendly"
    ],
    neighborhood: {
      walkScore: 92,
      transitScore: 85,
      bikeScore: 78,
      schools: [
        { name: "Lincoln Elementary", rating: 9, distance: "0.3 miles" },
        { name: "Roosevelt Middle School", rating: 8, distance: "0.7 miles" },
        { name: "Washington High School", rating: 9, distance: "1.2 miles" }
      ],
      amenities: [
        "Whole Foods - 0.2 miles",
        "Central Park - 0.4 miles",
        "Metro Station - 0.5 miles",
        "Fitness Center - 0.3 miles"
      ]
    },
    agent: {
      id: "agent-1",
      name: "Sarah Johnson",
      phone: "(512) 555-0123",
      email: "sarah.johnson@onlyif.com",
      avatar: "/images/agent-1.jpg",
      rating: 4.9,
      reviews: 127,
      bio: "Sarah has been helping families find their dream homes for over 8 years. She specializes in the downtown area and has extensive knowledge of the local market."
    }
  };

  if (interestSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interest Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your interest in {buyerData.selectedProperty?.title} has been sent to the agent. 
            They will contact you within 24 hours.
          </p>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Agent will review your inquiry
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                You'll receive a call or email within 24 hours
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Schedule a viewing or virtual tour
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Get personalized assistance with your home search
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button
              href="/browse"
              size="full"
              className="bg-green-600 hover:bg-green-700"
            >
              Browse More Properties
            </Button>
            
            <Button
              href="/dashboards/buyer"
              variant="outline"
              size="full"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Details Unlocked!</h2>
        <p className="text-gray-600">Express your interest to connect with the listing agent</p>
      </div>

      {/* Property Details */}
      {buyerData.selectedProperty && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{buyerData.selectedProperty.title}</h3>
                <p className="text-gray-600">{buyerData.selectedProperty.address}</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  ${buyerData.selectedProperty.price.toLocaleString()}
                </p>
              </div>
              
              <Button
                onClick={() => setShowFullDetails(!showFullDetails)}
                variant="outline"
                size="sm"
              >
                {showFullDetails ? 'Hide Details' : 'Show Full Details'}
              </Button>
            </div>

            {showFullDetails && (
              <div className="border-t pt-6 space-y-6">
                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{mockPropertyDetails.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {mockPropertyDetails.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neighborhood */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Neighborhood</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Walkability Scores</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Walk Score:</span>
                          <span className="font-medium">{mockPropertyDetails.neighborhood.walkScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transit Score:</span>
                          <span className="font-medium">{mockPropertyDetails.neighborhood.transitScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bike Score:</span>
                          <span className="font-medium">{mockPropertyDetails.neighborhood.bikeScore}/100</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Nearby Amenities</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {mockPropertyDetails.neighborhood.amenities.map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Schools */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Schools</h4>
                  <div className="space-y-2">
                    {mockPropertyDetails.neighborhood.schools.map((school, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{school.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">{school.distance}</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            {school.rating}/10
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Agent Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Agent</h3>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-gray-600">
              {mockPropertyDetails.agent.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{mockPropertyDetails.agent.name}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span>⭐ {mockPropertyDetails.agent.rating} ({mockPropertyDetails.agent.reviews} reviews)</span>
              <span>📞 {mockPropertyDetails.agent.phone}</span>
              <span>✉️ {mockPropertyDetails.agent.email}</span>
            </div>
            <p className="text-gray-600 text-sm">{mockPropertyDetails.agent.bio}</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Express Interest</h3>
        <ContactAgentForm
          propertyId={buyerData.selectedProperty?.id || ''}
          propertyTitle={buyerData.selectedProperty?.title || ''}
          className=""
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={previousPhase}
          variant="outline"
        >
          Back to Payment
        </Button>
        
        <Button
          onClick={handleInterestSubmitted}
          className="bg-green-600 hover:bg-green-700"
        >
          Submit Interest
        </Button>
      </div>
    </div>
  );
}