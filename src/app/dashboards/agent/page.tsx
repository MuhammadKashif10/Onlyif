'use client';
import { useState, useEffect } from 'react';
import { Navbar, Footer } from '@/components';
import { AgentProvider, useAgentContext } from '@/context/AgentContext';
import Image from 'next/image';
import Button from '@/components/reusable/Button';
import InputField from '@/components/reusable/InputField';
import InspectionManager from '@/components/agent/InspectionManager';
import { NotificationPanel } from '@/components/reusable';
import { MessagesInterface } from '@/components/reusable';

// Add interfaces
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

interface Inspection {
  id: string;
  propertyId: string;
  propertyName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  inspector: string;
  client: string;
  notes?: string;
  address: string;
}

interface Note {
  id: string;
  propertyId?: string;
  title: string;
  content: string;
  type: 'property' | 'inspection' | 'general';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export default function AgentDashboard() {
  const currentUserId = 'agent-456';
  const currentUserRole = 'agent';
  
  // Add missing state variables
  const [agentName, setAgentName] = useState('Sarah Johnson');
  const [activeTab, setActiveTab] = useState('overview');
  const [assignments, setAssignments] = useState<PropertyAssignment[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyAssignment | null>(null);
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [inspectionForm, setInspectionForm] = useState({
    date: '',
    time: '',
    inspector: '',
    client: '',
    notes: ''
  });
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    type: 'property' as 'property' | 'inspection' | 'general',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });
  const [stats, setStats] = useState({
    assignedProperties: 12,
    pendingInspections: 5,
    clientMessages: 8,
    completedInspections: 15
  });

  // Add useEffect to load mock data
  useEffect(() => {
    // Load mock data
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
        address: '456 Oak Avenue, Austin, TX 78702',
        price: 450000,
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
        assignedDate: '2024-03-12',
        priority: 'medium',
        beds: 2,
        baths: 2,
        size: 1200
      }
    ];
    setAssignments(mockAssignments);
  }, []);

  // Add helper functions INSIDE the component
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

  const handleAddInspection = () => {
    if (!inspectionForm.date || !inspectionForm.time || !inspectionForm.inspector || !inspectionForm.client) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newInspection: Inspection = {
      id: Date.now().toString(),
      propertyId: selectedProperty?.id || '',
      propertyName: selectedProperty?.title || '',
      date: inspectionForm.date,
      time: inspectionForm.time,
      status: 'scheduled',
      inspector: inspectionForm.inspector,
      client: inspectionForm.client,
      notes: inspectionForm.notes,
      address: selectedProperty?.address || ''
    };
    
    setInspections([...inspections, newInspection]);
    setShowInspectionForm(false);
    setInspectionForm({ date: '', time: '', inspector: '', client: '', notes: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectProperty = (property: PropertyAssignment) => {
    setSelectedProperty(property);
  };

  const handleShowInspectionForm = () => {
    setShowInspectionForm(true);
  };

  const handleAddNote = () => {
    if (noteForm.title.trim() && noteForm.content.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        propertyId: selectedProperty?.id,
        title: noteForm.title,
        content: noteForm.content,
        type: noteForm.type,
        priority: noteForm.priority,
        createdAt: new Date().toISOString()
      };
      
      setNotes(prevNotes => [newNote, ...prevNotes]);
      setNoteForm({
        title: '',
        content: '',
        type: 'property',
        priority: 'medium'
      });
      setShowNoteForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <Navbar 
          logo="/logo.svg"
          logoText=""
        />
        <div className="absolute top-0 right-0 p-4">
          <NotificationPanel 
            userId="agent-123" 
            userType="agent" 
            className="mr-4"
          />
        </div>
      </div>
      
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome back, {agentName}!
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Manage your properties, inspections, and client communications.
            </p>
          </div>
        </div>
      </section>

      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'properties', label: 'Assigned Properties' },
                { id: 'inspections', label: 'Inspections' },
                { id: 'notes', label: 'Notes' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.assignedProperties}</div>
                  <div className="text-gray-600">Assigned Properties</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.pendingInspections}</div>
                  <div className="text-gray-600">Pending Inspections</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.clientMessages}</div>
                  <div className="text-gray-600">New Messages</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{stats.completedInspections}</div>
                  <div className="text-gray-600">Completed Inspections</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">New property assigned: Beautiful Family Home</span>
                  <span className="text-gray-500 text-sm">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Inspection scheduled for Modern Downtown Condo</span>
                  <span className="text-gray-500 text-sm">4 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">New message from client Mike Johnson</span>
                  <span className="text-gray-500 text-sm">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Assigned Properties</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                      getPriorityColor(property.priority)
                    }`}>
                      {property.priority.toUpperCase()}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{property.address}</p>
                    <p className="text-green-600 font-bold text-xl mb-2">
                      ${property.price.toLocaleString()}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                      <span>{property.beds} beds</span>
                      <span>{property.baths} baths</span>
                      <span>{property.size} sq ft</span>
                    </div>
                    <Button
                      onClick={() => setSelectedProperty(property)}
                      className="w-full"
                      variant="primary"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inspections Tab */}
        {activeTab === 'inspections' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Inspections</h2>
              <Button
                onClick={() => setShowInspectionForm(true)}
                variant="primary"
              >
                Schedule Inspection
              </Button>
            </div>

            {/* Inspection Form Modal */}
            {showInspectionForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Schedule New Inspection</h3>
                  <div className="space-y-4">
                    <InputField
                      label="Date"
                      type="date"
                      value={inspectionForm.date}
                      onChange={(e) => setInspectionForm({...inspectionForm, date: e.target.value})}
                    />
                    <InputField
                      label="Time"
                      type="time"
                      value={inspectionForm.time}
                      onChange={(e) => setInspectionForm({...inspectionForm, time: e.target.value})}
                    />
                    <InputField
                      label="Inspector"
                      value={inspectionForm.inspector}
                      onChange={(e) => setInspectionForm({...inspectionForm, inspector: e.target.value})}
                    />
                    <InputField
                      label="Client"
                      value={inspectionForm.client}
                      onChange={(e) => setInspectionForm({...inspectionForm, client: e.target.value})}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={inspectionForm.notes}
                        onChange={(e) => setInspectionForm({...inspectionForm, notes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <Button onClick={handleAddInspection} variant="primary" className="flex-1">
                      Schedule
                    </Button>
                    <Button onClick={() => setShowInspectionForm(false)} variant="secondary" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Inspections List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inspections.map((inspection) => (
                      <tr key={inspection.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{inspection.propertyName}</div>
                            <div className="text-sm text-gray-500">{inspection.address}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inspection.date} at {inspection.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inspection.inspector}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inspection.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getStatusColor(inspection.status)
                          }`}>
                            {inspection.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <div className="bg-white rounded-lg shadow-lg" style={{ height: '600px' }}>
              <MessagesInterface
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                className="h-full"
              />
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Notes & Documentation</h2>
              <Button
                onClick={() => setShowNoteForm(true)}
                variant="primary"
              >
                Add Note
              </Button>
            </div>

            {/* Note Form Modal */}
            {showNoteForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Add New Note</h3>
                  <div className="space-y-4">
                    <InputField
                      label="Title"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={noteForm.content}
                        onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={noteForm.type}
                        onChange={(e) => setNoteForm({...noteForm, type: e.target.value as 'property' | 'inspection' | 'general'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="property">Property</option>
                        <option value="inspection">Inspection</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={noteForm.priority}
                        onChange={(e) => setNoteForm({...noteForm, priority: e.target.value as 'high' | 'medium' | 'low'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <Button onClick={handleAddNote} variant="primary" className="flex-1">
                      Add Note
                    </Button>
                    <Button onClick={() => setShowNoteForm(false)} variant="secondary" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{note.title}</h3>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        getPriorityColor(note.priority)
                      }`}>
                        {note.priority}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
                        {note.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{note.content}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

// REMOVE all the functions that were defined outside the component (lines 541-599)