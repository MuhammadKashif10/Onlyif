'use client';

import { Metadata } from 'next';
import { Navbar, Footer, LoadingError } from '@/components';
import Sidebar from '@/components/main/Sidebar';
import { offersApi } from '@/api';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePropertyContext } from '@/context/PropertyContext';
import { Property } from '@/types/api';
import { useRouter } from 'next/navigation';
import AgentHelpPrompt from '@/components/seller/AgentHelpPrompt';
import AssignedAgent from '@/components/seller/AssignedAgent';
import { AgentAssignmentResponse } from '@/api/assignments';
import { NotificationPanel } from '@/components/reusable';

export default function SellerDashboard() {
  const router = useRouter();
  const { addProperty } = usePropertyContext();
  const [stats, setStats] = useState({
    totalOffers: 0,
    pendingOffers: 0,
    acceptedOffers: 0,
    averageValue: 0
  });
  const [activeListings, setActiveListings] = useState([]);
  const [showAddListing, setShowAddListing] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [priceEstimation, setPriceEstimation] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [listingForm, setListingForm] = useState({
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    description: '',
    status: 'public'
  });
  const [showAgentHelp, setShowAgentHelp] = useState(true);
  const [assignedAgent, setAssignedAgent] = useState<AgentAssignmentResponse | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock data loading
        setStats({
          totalOffers: 12,
          pendingOffers: 3,
          acceptedOffers: 2,
          averageValue: 425000
        });
        
        setActiveListings([
          {
            id: 1,
            address: '123 Main St, Anytown, ST 12345',
            price: 450000,
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1800,
            views: 45,
            inquiries: 8,
            dateAdded: '2024-01-15',
            status: 'public'
          },
          {
            id: 2,
            address: '456 Oak Ave, Somewhere, ST 67890',
            price: 325000,
            bedrooms: 2,
            bathrooms: 1.5,
            sqft: 1200,
            views: 23,
            inquiries: 4,
            dateAdded: '2024-01-10',
            status: 'public'
          }
        ]);
      } catch (error) {
        console.error('Error loading seller data:', error);
      }
    };

    loadData();
  }, []);

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create property object matching Property interface
    const newProperty: Omit<Property, 'id' | 'dateListed' | 'daysOnMarket'> = {
      title: listingForm.address, // Using address as title for now
      address: listingForm.address,
      city: 'Austin', // Default city
      state: 'TX', // Default state
      zipCode: '78701', // Default zip
      price: parseInt(listingForm.price),
      beds: parseInt(listingForm.bedrooms),
      baths: parseInt(listingForm.bathrooms),
      size: parseInt(listingForm.sqft),
      yearBuilt: new Date().getFullYear(),
      lotSize: 0.25,
      propertyType: 'Single Family',
      status: 'For Sale',
      description: listingForm.description,
      features: ['New Listing'],
      images: [
        // Use placeholder images from Unsplash
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&h=800&q=80'
      ],
      mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&h=800&q=80',
      coordinates: { lat: 30.2672, lng: -97.7431 },
      agent: {
        id: 'seller-agent',
        name: 'Seller Agent',
        phone: '(512) 555-0123',
        email: 'seller@onlyif.com',
        avatar: '/images/agent-default.jpg',
        rating: 4.8,
        reviews: 25
      },
      similarProperties: [],
      featured: false
    };
    
    // Add to global state
    addProperty(newProperty);
    
    // Update local state for dashboard display
    const newListing = {
      id: Date.now(),
      ...listingForm,
      price: parseInt(listingForm.price),
      bedrooms: parseInt(listingForm.bedrooms),
      bathrooms: parseInt(listingForm.bathrooms),
      sqft: parseInt(listingForm.sqft),
      views: 0,
      inquiries: 0,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    if (editingListing) {
      setActiveListings(prev => prev.map(listing => 
        listing.id === editingListing.id ? { ...listing, ...newListing, id: editingListing.id } : listing
      ));
      setEditingListing(null);
    } else {
      setActiveListings(prev => [...prev, newListing]);
    }
    
    // Reset form
    setListingForm({
      address: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      sqft: '',
      description: '',
      status: 'public'
    });
    setShowAddListing(false);
    setUploadedMedia([]);
    
    // Show success message
    alert('Property added successfully! It will now appear on the Browse Homes page.');
  };

  const handleEditListing = (listing: any) => {
    setEditingListing(listing);
    setListingForm({
      address: listing.address,
      price: listing.price.toString(),
      bedrooms: listing.bedrooms.toString(),
      bathrooms: listing.bathrooms.toString(),
      sqft: listing.sqft.toString(),
      description: listing.description || '',
      status: listing.status
    });
    setShowAddListing(true);
  };

  const handleStatusChange = (listingId: number, newStatus: string): void => {
    setActiveListings(prev => prev.map((listing: Listing) => 
      listing.id === listingId ? { ...listing, status: newStatus as Listing['status'] } : listing
    ));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    const newMedia: MediaFile[] = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    setUploadedMedia(prev => [...prev, ...newMedia]);
  };

  const removeMedia = (mediaId: number): void => {
    setUploadedMedia(prev => prev.filter((media: MediaFile) => media.id !== mediaId));
  };

  const getPriceEstimation = async (): Promise<void> => {
    // Mock CoreLogic API call
    setPriceEstimation({
      estimatedValue: 425000,
      lowRange: 395000,
      highRange: 455000,
      confidence: 'High',
      lastUpdated: new Date().toLocaleDateString()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        logo="/logo.svg"
        logoText=""
        navigationItems={[
          { label: 'Dashboard', href: '/dashboards/seller', isActive: true },
          { label: 'Listings', href: '/dashboards/seller/listings', isActive: false },
          { label: 'Offers', href: '/dashboards/seller/offers', isActive: false },
          { label: 'Analytics', href: '/dashboards/seller/analytics', isActive: false },
        ]}
        ctaText="Account"
        ctaHref="/dashboards/seller/account"
        rightContent={
          <NotificationPanel 
            userId="seller-123" 
            userType="seller" 
            className="mr-4"
          />
        }
      />
      
      <div className="flex">
        <Sidebar userType="seller" />
        
        <main className="flex-1 lg:ml-0">
          {/* Hero Section with proper spacing */}
          <div className="pt-16 sm:pt-20 md:pt-24">
            <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Seller Dashboard
                  </h1>
                  <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                    Manage your property listings, track offers, and control your selling journey.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Stats Section */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-orange-50 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">{stats.totalOffers}</div>
                  <div className="text-gray-600">Total Offers</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">{stats.pendingOffers}</div>
                  <div className="text-gray-600">Pending Offers</div>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">{stats.acceptedOffers}</div>
                  <div className="text-gray-600">Accepted Offers</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">${stats.averageValue.toLocaleString()}</div>
                  <div className="text-gray-600">Average Offer</div>
                </div>
              </div>
            </div>
          </section>

          {/* Active Listings Section */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Active Listings</h2>
                <button 
                  onClick={() => setShowAddListing(true)}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Add New Listing
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeListings.map((listing: Listing) => (
                  <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{listing.address}</h3>
                          <p className="text-2xl font-bold text-green-600">${listing.price.toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <select
                            value={listing.status}
                            onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                            className="px-3 py-1 border rounded-lg text-sm"
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="pending">Pending</option>
                          </select>
                          <button 
                            onClick={() => handleEditListing(listing)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{listing.bedrooms}</div>
                          <div className="text-sm text-gray-600">Bedrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{listing.bathrooms}</div>
                          <div className="text-sm text-gray-600">Bathrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{listing.sqft}</div>
                          <div className="text-sm text-gray-600">Sq Ft</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{listing.views} views</span>
                        <span>{listing.inquiries} inquiries</span>
                        <span>Added: {listing.dateAdded}</span>
                      </div>
                      
                      <div className="mt-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                          listing.status === 'public' ? 'bg-green-100 text-green-800' :
                          listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Price Estimation Section */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Price Estimation</h2>
              <div className="max-w-2xl mx-auto">
                {!priceEstimation ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">Get an accurate price estimation for your property using CoreLogic data.</p>
                    <button 
                      onClick={getPriceEstimation}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Get Price Estimation
                    </button>
                  </div>
                ) : (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Property Valuation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">${priceEstimation.lowRange.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Low Range</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">${priceEstimation.estimatedValue.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Estimated Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">${priceEstimation.highRange.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">High Range</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Confidence: {priceEstimation.confidence}</span>
                      <span>Last Updated: {priceEstimation.lastUpdated}</span>
                    </div>
                    <button 
                      onClick={getPriceEstimation}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Refresh Estimation
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Quick Actions Section */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Add Property Button */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Add Property</h3>
                  <p className="text-gray-600 mb-4">Create a new property listing with detailed information and media.</p>
                  <button 
                    onClick={() => router.push('/dashboards/seller/add-property')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                  >
                    Add Property
                  </button>
                </div>
                
                {/* Marketing Add-ons Button */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Marketing Add-ons</h3>
                  <p className="text-gray-600 mb-4">Enhance your listings with professional photography, drone footage, and more.</p>
                  <button 
                    onClick={() => router.push('/dashboards/seller/addons')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full"
                  >
                    View Add-ons
                  </button>
                </div>
                
                {/* Get Cash Offer Button */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Get Cash Offer</h3>
                  <p className="text-gray-600 mb-4">Receive a competitive cash offer for your property within 24 hours.</p>
                  <button 
                    onClick={() => router.push('/dashboards/seller/cash-offer')}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors w-full"
                  >
                    Get Offer
                  </button>
                </div>
                
                {/* Schedule Inspection Button */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Schedule Inspection</h3>
                  <p className="text-gray-600 mb-4">Book a property inspection to get a detailed assessment.</p>
                  <button 
                    onClick={() => router.push('/dashboards/seller/schedule-inspection')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                  >
                    Schedule
                  </button>
                </div>
                
                {/* View Offers Button */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Accept Offer</h3>
                  <p className="text-gray-600 mb-4">Review and accept offers for your property.</p>
                  <button 
                    onClick={() => router.push('/dashboards/seller/offers')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full"
                  >
                    View Offers
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      {/* Add/Edit Listing Modal */}
      {showAddListing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="bg-white p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">{editingListing ? 'Edit Listing' : 'Add New Listing'}</h2>
                <button 
                  onClick={() => {
                    setShowAddListing(false);
                    setEditingListing(null);
                    setListingForm({
                      address: '',
                      price: '',
                      bedrooms: '',
                      bathrooms: '',
                      sqft: '',
                      description: '',
                      status: 'public'
                    });
                    setUploadedMedia([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddListing} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Property Address *</label>
                    <input
                      type="text"
                      required
                      value={listingForm.address}
                      onChange={(e) => setListingForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-black rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 text-black placeholder-black"
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Price *</label>
                    <input
                      type="number"
                      required
                      value={listingForm.price}
                      onChange={(e) => setListingForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-black rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 text-black placeholder-black"
                      placeholder="450000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Bedrooms *</label>
                    <input
                      type="number"
                      required
                      value={listingForm.bedrooms}
                      onChange={(e) => setListingForm(prev => ({ ...prev, bedrooms: e.target.value }))}
                      className="w-full px-3 py-2 border border-black rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 text-black placeholder-black"
                      placeholder="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Bathrooms *</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={listingForm.bathrooms}
                      onChange={(e) => setListingForm(prev => ({ ...prev, bathrooms: e.target.value }))}
                      className="w-full px-3 py-2 border border-black rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 text-black placeholder-black"
                      placeholder="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Square Feet *</label>
                    <input
                      type="number"
                      required
                      value={listingForm.sqft}
                      onChange={(e) => setListingForm(prev => ({ ...prev, sqft: e.target.value }))}
                      className="w-full px-3 py-2 border border-black rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 text-black placeholder-black"
                      placeholder="1800"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Status</label>
                    <select
                      value={listingForm.status}
                      onChange={(e) => setListingForm(prev => ({ ...prev, status: e.target.value as ListingForm['status'] }))}
                      className="w-full px-3 py-2 border border-black rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 text-black"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Description</label>
                  <textarea
                    value={listingForm.description}
                    onChange={(e) => setListingForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 text-black placeholder-black"
                    placeholder="Describe your property..."
                  />
                </div>
                
                {/* Upload Media Section */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Upload Media</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="mt-4">
                        <label htmlFor="media-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-black">
                            Upload photos, floorplans, or videos
                          </span>
                          <input
                            id="media-upload"
                            type="file"
                            multiple
                            accept="image/*,video/*,.pdf"
                            onChange={handleMediaUpload}
                            className="sr-only"
                          />
                        </label>
                        <p className="mt-1 text-sm text-gray-500">PNG, JPG, PDF, MP4 up to 10MB each</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Uploaded Media Preview */}
                  {uploadedMedia.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-black mb-2">Uploaded Files:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedMedia.map((media: MediaFile) => (
                          <div key={media.id} className="relative">
                            {media.type.startsWith('image/') ? (
                              <img src={media.url} alt={media.name} className="w-full h-24 object-cover rounded-lg" />
                            ) : (
                              <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-gray-600">{media.name}</span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeMedia(media.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddListing(false);
                      setEditingListing(null);
                      setListingForm({
                        address: '',
                        price: '',
                        bedrooms: '',
                        bathrooms: '',
                        sqft: '',
                        description: '',
                        status: 'public'
                      });
                      setUploadedMedia([]);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingListing ? 'Update Listing' : 'Add Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}