'use client';

import React, { useEffect, useState } from 'react';
import { useAgentContext } from '@/context/AgentContext';
import Button from '@/components/reusable/Button';
import Image from 'next/image';

interface PropertyAssignment {
  id: string;
  title: string;
  address: string;
  price: number;
  status: string;
  image: string;
  assignedDate: string;
  priority: 'high' | 'medium' | 'low';
  beds: number;
  baths: number;
  size: number;
}

export default function AssignedPhase() {
  const { agentData, updateAgentData, selectProperty, nextPhase, setLoading, loading } = useAgentContext();
  const [assignments, setAssignments] = useState<PropertyAssignment[]>([]);

  useEffect(() => {
    // Simulate fetching assigned properties
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        // Mock data - in real app, this would come from API
        const mockAssignments: PropertyAssignment[] = [
          {
            id: '1',
            title: 'Beautiful Family Home',
            address: '123 Maple Street, Austin, TX 78701',
            price: 750000,
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
            assignedDate: '2024-03-15',
            priority: 'high',
            beds: 4,
            baths: 3,
            size: 2500
          },
          {
            id: '2',
            title: 'Modern Downtown Condo',
            address: '456 Main Street, Austin, TX 78702',
            price: 650000,
            status: 'Pending',
            image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80',
            assignedDate: '2024-03-18',
            priority: 'medium',
            beds: 3,
            baths: 2,
            size: 1800
          },
          {
            id: '3',
            title: 'Luxury Estate',
            address: '789 Oak Avenue, Austin, TX 78703',
            price: 1200000,
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
            assignedDate: '2024-03-20',
            priority: 'high',
            beds: 5,
            baths: 4,
            size: 4200
          }
        ];
        
        setAssignments(mockAssignments);
        updateAgentData({ assignedProperties: mockAssignments });
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [setLoading, updateAgentData]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectProperty = (property: PropertyAssignment) => {
    selectProperty(property);
    nextPhase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assigned Properties</h2>
            <p className="text-gray-600 mt-1">Review and manage your assigned property listings</p>
          </div>
          <div className="text-sm text-gray-500">
            {assignments.length} properties assigned
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No properties assigned</div>
            <p className="text-gray-500">You don't have any properties assigned at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((property) => (
              <div key={property.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(property.priority)}`}>
                      {property.priority.charAt(0).toUpperCase() + property.priority.slice(1)} Priority
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{property.address}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold text-green-600">
                      ${property.price.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>{property.beds} beds</span>
                    <span>{property.baths} baths</span>
                    <span>{property.size.toLocaleString()} sqft</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    Assigned: {new Date(property.assignedDate).toLocaleDateString()}
                  </div>
                  
                  <Button
                    onClick={() => handleSelectProperty(property)}
                    variant="primary"
                    size="full"
                    className="text-sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}