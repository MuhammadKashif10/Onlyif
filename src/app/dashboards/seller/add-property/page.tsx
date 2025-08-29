'use client';

import React, { useState } from 'react';
import { Navbar, Footer } from '@/components';
import Sidebar from '@/components/main/Sidebar';
import Button from '@/components/reusable/Button';
import InputField from '@/components/reusable/InputField';
import TextArea from '@/components/reusable/TextArea';
import { useRouter } from 'next/navigation';

interface PropertyFormData {
  title: string;
  price: string;
  location: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  squareMeters: string; // Changed from squareFeet
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  yearBuilt: string;
  lotSize: string;
}

export default function AddProperty() {
  const router = useRouter();
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    price: '',
    location: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'Single Family',
    yearBuilt: '',
    lotSize: ''
  });

  const [propertyImages, setPropertyImages] = useState<File[]>([]);
  const [floorPlans, setFloorPlans] = useState<File[]>([]);
  const [videoTours, setVideoTours] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null, type: 'images' | 'floorPlans' | 'videos') => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    
    switch (type) {
      case 'images':
        setPropertyImages(prev => [...prev, ...fileArray]);
        break;
      case 'floorPlans':
        setFloorPlans(prev => [...prev, ...fileArray]);
        break;
      case 'videos':
        setVideoTours(prev => [...prev, ...fileArray]);
        break;
    }
  };

  const removeFile = (index: number, type: 'images' | 'floorPlans' | 'videos') => {
    switch (type) {
      case 'images':
        setPropertyImages(prev => prev.filter((_, i) => i !== index));
        break;
      case 'floorPlans':
        setFloorPlans(prev => prev.filter((_, i) => i !== index));
        break;
      case 'videos':
        setVideoTours(prev => prev.filter((_, i) => i !== index));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload support
      const submitFormData = new FormData();
      
      // Add property data
      submitFormData.append('title', formData.title);
      submitFormData.append('address', formData.location);
      submitFormData.append('city', formData.city);
      submitFormData.append('state', formData.state);
      submitFormData.append('zipCode', formData.zipCode);
      submitFormData.append('price', formData.price);
      submitFormData.append('beds', formData.bedrooms);
      submitFormData.append('baths', formData.bathrooms);
      submitFormData.append('squareMeters', formData.squareMeters);
      submitFormData.append('description', formData.description);
      submitFormData.append('propertyType', formData.propertyType);
      submitFormData.append('yearBuilt', formData.yearBuilt);
      submitFormData.append('lotSize', formData.lotSize);
      
      // Add required contact info (you may want to get these from user profile or form)
      submitFormData.append('contactName', 'Property Owner'); // Replace with actual contact name
      submitFormData.append('contactEmail', 'owner@example.com'); // Replace with actual email
      submitFormData.append('contactPhone', '555-0123'); // Replace with actual phone
      
      // Add uploaded files
      propertyImages.forEach((file, index) => {
        submitFormData.append(`images_${index}`, file);
      });
      
      floorPlans.forEach((file, index) => {
        submitFormData.append(`floorplans_${index}`, file);
      });
      
      videoTours.forEach((file, index) => {
        submitFormData.append(`videos_${index}`, file);
      });
      
      // Call the new /api/properties endpoint directly
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: submitFormData
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Property created successfully:', result.data);
        alert(`Property added successfully! ID: ${result.data.id}`);
        
        // Reset form
        setFormData({
          title: '',
          price: '',
          location: '',
          description: '',
          bedrooms: '',
          bathrooms: '',
          squareMeters: '', // Changed from squareFeet
          city: '',
          state: '',
          zipCode: '',
          propertyType: 'Single Family',
          yearBuilt: '',
          lotSize: ''
        });
        setPropertyImages([]);
        setFloorPlans([]);
        setVideoTours([]);
        
        // Redirect to seller dashboard
        router.push('/dashboards/seller');
      } else {
        throw new Error(result.error || 'Failed to create property');
      }
      
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to add property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar userType="seller" />
        
        <main className="flex-1 lg:ml-0 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Property</h1>
                <p className="text-gray-600">Fill in the details below to list your property</p>
              </header>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InputField
                      label="Property Title"
                      placeholder="Enter property title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                      id="title"
                      name="title"
                    />
                    
                    <InputField
                      label="Price"
                      type="number"
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                      id="price"
                      name="price"
                    />
                  </div>
                  
                  <div className="mt-6">
                    <InputField
                      label="Address"
                      placeholder="Enter full address"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                      id="location"
                      name="location"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <InputField
                      label="City"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                      id="city"
                      name="city"
                    />
                    
                    <InputField
                      label="State"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                      id="state"
                      name="state"
                    />
                    
                    <InputField
                      label="ZIP Code"
                      placeholder="Enter ZIP code"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      required
                      id="zipCode"
                      name="zipCode"
                    />
                  </div>
                </section>

                {/* Property Details */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                      label="Bedrooms"
                      type="number"
                      placeholder="Number of bedrooms"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      required
                      id="bedrooms"
                      name="bedrooms"
                    />
                    
                    <InputField
                      label="Bathrooms"
                      type="number"
                      placeholder="Number of bathrooms"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      required
                      id="bathrooms"
                      name="bathrooms"
                    />
                    
                    <InputField
                      label="Square Meters"
                      type="number"
                      placeholder="Property size in sq m"
                      value={formData.squareMeters}
                      onChange={(e) => handleInputChange('squareMeters', e.target.value)}
                      required
                      id="squareMeters"
                      name="squareMeters"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => handleInputChange('propertyType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="Single Family">Single Family</option>
                        <option value="Condo">Condo</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Loft">Loft</option>
                        <option value="Multi-Family">Multi-Family</option>
                      </select>
                    </div>
                    
                    <InputField
                      label="Year Built"
                      type="number"
                      placeholder="Year built"
                      value={formData.yearBuilt}
                      onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                      id="yearBuilt"
                      name="yearBuilt"
                    />
                    
                    <InputField
                      label="Lot Size (acres)"
                      type="number"
                      step="0.01"
                      placeholder="Lot size in acres"
                      value={formData.lotSize}
                      onChange={(e) => handleInputChange('lotSize', e.target.value)}
                      id="lotSize"
                      name="lotSize"
                    />
                  </div>
                </section>

                {/* Description */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                  <TextArea
                    label="Property Description"
                    placeholder="Describe your property..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    rows={4}
                    id="description"
                    name="description"
                  />
                </section>

                {/* File Uploads */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Media</h2>
                  
                  {/* Property Images */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'images')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {propertyImages.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{propertyImages.length} image(s) selected</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {propertyImages.map((file, index) => (
                            <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded">
                              <span className="text-sm">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(index, 'images')}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Floor Plans */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor Plans (Optional)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e.target.files, 'floorPlans')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {floorPlans.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{floorPlans.length} floor plan(s) selected</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Video Tours */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Tours (Optional)</label>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'videos')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {videoTours.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{videoTours.length} video(s) selected</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Adding Property...' : 'Add Property'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}