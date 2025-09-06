'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/api/admin';

interface Property {
  _id: string;
  title: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'sold';
  assignedAgent?: {
    _id: string;
    name: string;
    email: string;
  };
  seller: {
    name: string;
    email: string;
  };
  createdAt: string;
  address: string;
}

interface Agent {
  _id: string;
  name: string;
  email: string;
  status: string;
}

const PropertiesPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        router.push('/admin/login');
        return;
      }
      loadData();
    }
  }, [user, loading, router]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [propertiesRes, agentsRes] = await Promise.all([
        adminApi.getProperties({}),
        adminApi.getAgents({})
      ]);
      setProperties(propertiesRes.data.properties || []);
      setAgents(agentsRes.data.agents || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handlePropertyAction = async (propertyId: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      await adminApi.updateProperty(propertyId, { action });
      loadData();
    } catch (error) {
      console.error('Property action failed:', error);
    }
  };

  const handleAssignAgent = async () => {
    if (!selectedProperty || !selectedAgent) return;
    
    try {
      await adminApi.assignPropertyToAgent(selectedProperty._id, { agentId: selectedAgent });
      setShowAssignModal(false);
      setSelectedProperty(null);
      setSelectedAgent('');
      loadData();
    } catch (error) {
      console.error('Failed to assign agent:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-blue-100 text-blue-800',
      sold: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
            <p className="mt-2 text-gray-600">Manage all property listings and assignments</p>
          </div>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.address}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${property.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(property.status)}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {property.assignedAgent ? (
                          <div>
                            <div className="font-medium">{property.assignedAgent.name}</div>
                            <div className="text-gray-500">{property.assignedAgent.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{property.seller.name}</div>
                          <div className="text-gray-500">{property.seller.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {property.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handlePropertyAction(property._id, 'approve')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handlePropertyAction(property._id, 'reject')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowAssignModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Assign Agent
                        </button>
                        <button
                          onClick={() => handlePropertyAction(property._id, 'delete')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assign Agent Modal */}
        {showAssignModal && selectedProperty && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowAssignModal(false)}></div>
              
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Agent to Property</h3>
                <p className="text-sm text-gray-600 mb-4">Property: {selectedProperty.title}</p>
                
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an agent...</option>
                  {agents.filter(agent => agent.status === 'approved').map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name} ({agent.email})
                    </option>
                  ))}
                </select>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignAgent}
                    disabled={!selectedAgent}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assign Agent
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PropertiesPage;