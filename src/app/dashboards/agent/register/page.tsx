'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputField, Button } from '@/components/reusable';
import { useAuth } from '@/context/AuthContext';

export default function AgentRegistration() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // licenseNumber: '', // REMOVED - License number field
    brokerage: '',
    yearsOfExperience: '',
    specialization: '',
    role: 'agent' // Pre-selected as Agent
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear message when user starts typing
    if (message) {
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    
    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        type: 'agent',
        phone: formData.phone,
        // licenseNumber: formData.licenseNumber, // REMOVED - License number field
        brokerage: formData.brokerage,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        specialization: formData.specialization
      });
      
      setMessage({ type: 'success', text: 'Agent account created successfully!' });
      
      // Redirect to agent dashboard after successful registration
      setTimeout(() => {
        router.push('/dashboards/agent');
      }, 2000);
      
    } catch (error: any) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error?.message && typeof error.message === 'string') {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors.map((err: any) => err.message).join(', ');
        errorMessage = `Validation failed: ${validationErrors}`;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Agent Account</h1>
            <p className="text-gray-600">Join our platform to manage and assist in property transactions</p>
          </div>
          
          {/* Success/Error Messages */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <p className={`font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection (Pre-selected) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="agent"
                    name="role"
                    value="agent"
                    checked={formData.role === 'agent'}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="mr-3"
                    disabled
                  />
                  <label htmlFor="agent" className="text-purple-800 font-medium">Real Estate Agent</label>
                </div>
                <p className="text-sm text-purple-600 mt-1 ml-6">Manage and assist in property transactions</p>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                placeholder="Enter your first name"
                aria-label="First name"
              />
              <InputField
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                placeholder="Enter your last name"
                aria-label="Last name"
              />
            </div>

            {/* Contact Information */}
            <InputField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              placeholder="Enter your email address"
              aria-label="Email address"
            />

            <InputField
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              placeholder="Enter your phone number"
              aria-label="Phone number"
            />

            {/* Password Fields */}
            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              placeholder="Create a strong password"
              aria-label="Password"
            />

            <InputField
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              placeholder="Confirm your password"
              aria-label="Confirm password"
            />

            {/* Professional Information - LICENSE NUMBER FIELD REMOVED */}
            
            <InputField
              label="Brokerage"
              type="text"
              value={formData.brokerage}
              onChange={(e) => handleInputChange('brokerage', e.target.value)}
              required
              placeholder="Enter your brokerage name"
              aria-label="Brokerage"
            />

            <InputField
              label="Years of Experience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
              required
              placeholder="Enter years of experience"
              aria-label="Years of experience"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <select
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                aria-label="Specialization"
              >
                <option value="">Select your specialization</option>
                <option value="residential">Residential Properties</option>
                <option value="commercial">Commercial Properties</option>
                <option value="luxury">Luxury Properties</option>
                <option value="investment">Investment Properties</option>
                <option value="first-time-buyers">First-Time Buyers</option>
              </select>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 mr-3"
                aria-label="Accept terms and conditions"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
              aria-label="Create agent account"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account? <a href="/signin" className="text-blue-600 hover:underline font-medium">Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}