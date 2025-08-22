'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Phone, Mail, MapPin } from 'lucide-react';
import { Agent } from '@/types/api';
import { agentsApi } from '@/api/agents';

interface AgentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  onAgentAssigned: (agent: Agent) => void;
}

export default function AgentAssignmentModal({
  isOpen,
  onClose,
  propertyId,
  onAgentAssigned
}: AgentAssignmentModalProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAgents();
    }
  }, [isOpen]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const agentList = await agentsApi.getAgents();
      setAgents(agentList);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAgent = async (agentId: string) => {
    try {
      setAssigning(agentId);
      
      const response = await fetch(`/api/properties/${propertyId}/assign-agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId }),
      });

      const result = await response.json();

      if (result.success) {
        onAgentAssigned(result.data.assignedAgent);
        onClose();
      } else {
        console.error('Failed to assign agent:', result.error);
      }
    } catch (error) {
      console.error('Error assigning agent:', error);
    } finally {
      setAssigning(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign an Agent to Your Property</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        <p className="text-gray-600">{agent.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{agent.rating}</span>
                            <span className="text-sm text-gray-500">({agent.reviews} reviews)</span>
                          </div>
                          <Badge variant="secondary">{agent.experience}</Badge>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleAssignAgent(agent.id)}
                        disabled={assigning === agent.id}
                        className="ml-4"
                      >
                        {assigning === agent.id ? 'Assigning...' : 'Assign Agent'}
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{agent.bio}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {agent.specializations.slice(0, 3).map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{agent.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{agent.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{agent.office}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-green-600 font-medium">
                        {agent.propertiesSold} properties sold
                      </span>
                      <span className="text-blue-600 font-medium">
                        Avg. {agent.averageDaysOnMarket} days on market
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}