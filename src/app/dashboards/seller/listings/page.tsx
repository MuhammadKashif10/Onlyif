'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import { Agent } from '@/types/api';
import AgentAssignmentModal from '@/components/seller/AgentAssignmentModal';
import AssignedAgentCard from '@/components/seller/AssignedAgentCard';

// Mock property data with assigned agents
const mockProperties = [
  {
    id: '1',
    title: 'Modern Downtown Condo',
    address: '123 Main St, Austin, TX 78701',
    price: 450000,
    status: 'public' as const,
    views: 234,
    unlocks: 12,
    dateListed: '2024-01-15',
    assignedAgent: null,
    assignedAt: null
  },
  {
    id: '2',
    title: 'Spacious Family Home',
    address: '456 Oak Ave, Austin, TX 78702',
    price: 750000,
    status: 'private' as const,
    views: 89,
    unlocks: 5,
    dateListed: '2024-01-20',
    assignedAgent: null,
    assignedAt: null
  }
];

export default function SellerListingsPage() {
  const [properties, setProperties] = useState(mockProperties);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleAssignAgent = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setIsAssignModalOpen(true);
  };

  const handleAgentAssigned = (agent: Agent) => {
    if (selectedPropertyId) {
      setProperties(prev => prev.map(property => 
        property.id === selectedPropertyId 
          ? { 
              ...property, 
              assignedAgent: agent,
              assignedAt: new Date().toISOString()
            }
          : property
      ));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      private: { label: 'Private', variant: 'outline' as const },
      public: { label: 'Public', variant: 'default' as const },
      sold: { label: 'Sold', variant: 'destructive' as const },
      withdrawn: { label: 'Withdrawn', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button>Add New Property</Button>
      </div>

      <div className="grid gap-6">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{property.title}</CardTitle>
                  <p className="text-gray-600 mt-1">{property.address}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-2xl font-bold text-green-600">
                      ${property.price.toLocaleString()}
                    </span>
                    {getStatusBadge(property.status)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{property.views}</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{property.unlocks}</div>
                  <div className="text-sm text-gray-600">Unlocks</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor((Date.now() - new Date(property.dateListed).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-gray-600">Days Listed</div>
                </div>
              </div>

              {property.assignedAgent ? (
                <AssignedAgentCard 
                  agent={property.assignedAgent}
                  assignedAt={property.assignedAt!}
                  propertyId={property.id}
                />
              ) : (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <UserPlus className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Agent Assigned
                    </h3>
                    <p className="text-gray-600 text-center mb-4">
                      Assign a professional agent to help optimize your listing and attract more buyers.
                    </p>
                    <Button 
                      onClick={() => handleAssignAgent(property.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Agent
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AgentAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        propertyId={selectedPropertyId || ''}
        onAgentAssigned={handleAgentAssigned}
      />
    </div>
  );
}