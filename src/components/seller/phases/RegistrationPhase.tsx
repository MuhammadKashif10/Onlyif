'use client';

import React, { useState } from 'react';
import { useSellerContext } from '../../../context/SellerContext';
import InputField from '../../reusable/InputField';
import PasswordField from '../../reusable/PasswordField';
import Button from '../../reusable/Button';
import { validatePassword, validatePasswordConfirmation } from '../../../utils/passwordValidation';
import { useAuth } from '../../../context/AuthContext';

interface RegistrationPhaseProps {
  onNext: () => void;
  onBack: () => void;
}

const RegistrationPhase: React.FC<RegistrationPhaseProps> = ({ onNext, onBack }) => {
  const { data, updateData } = useSellerContext(); // Changed from sellerData, updateSellerData
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!data.name.trim()) { // Changed from sellerData.name
      newErrors.name = 'Name is required';
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!data.email.trim()) { // Changed from sellerData.email
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!data.phone.trim()) { // Changed from sellerData.phone
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(data.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!data.password) { // Changed from sellerData.password
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    // Confirm password validation
    if (!data.confirmPassword) { // Changed from sellerData.confirmPassword
      newErrors.confirmPassword = 'Please confirm your password';
    } else {
      const confirmValidation = validatePasswordConfirmation(data.password || '', data.confirmPassword);
      if (!confirmValidation.isValid) {
        newErrors.confirmPassword = confirmValidation.error;
      }
    }

    // Terms validation
    if (!data.termsAccepted) { // Changed from sellerData.termsAccepted
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add import and usage of AuthContext
  // import { useAuth } from '../../../context/AuthContext';
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Register user but do not persist JWT yet (will persist after OTP verification)
      await register({
        name: data.name,
        email: data.email,
        password: data.password!,
        type: 'seller',
        phone: data.phone
      });

      // Proceed to OTP verification phase
      onNext();
    } catch (error: any) {
      console.error('Registration failed:', error);
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
        <p className="text-gray-600">Enter your details to get started with selling your property</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Full Name"
          type="text"
          value={data.name} // Changed from sellerData.name
          onChange={(e) => updateData({ name: e.target.value })} // Changed from updateSellerData
          error={errors.name}
          placeholder="Enter your full name"
          required
        />

        <InputField
          label="Email Address"
          type="email"
          value={data.email} // Changed from sellerData.email
          onChange={(e) => updateData({ email: e.target.value })} // Changed from updateSellerData
          error={errors.email}
          placeholder="Enter your email address"
          required
        />

        <InputField
          label="Phone Number"
          type="tel"
          value={data.phone} // Changed from sellerData.phone
          onChange={(e) => updateData({ phone: e.target.value })} // Changed from updateSellerData
          error={errors.phone}
          placeholder="Enter your phone number"
          required
        />

        <PasswordField
          label="Password"
          value={data.password || ''} // Changed from sellerData.password
          onChange={(value) => updateData({ password: value })} // Changed from updateSellerData
          error={errors.password}
          placeholder="Create a strong password"
          showStrengthMeter
          required
        />

        <PasswordField
          label="Confirm Password"
          value={data.confirmPassword || ''} // Changed from sellerData.confirmPassword
          onChange={(value) => updateData({ confirmPassword: value })} // Changed from updateSellerData
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          isConfirmation
          required
        />

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={data.termsAccepted} // Changed from sellerData.termsAccepted
              onChange={(e) => updateData({ termsAccepted: e.target.checked })} // Changed from updateSellerData
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                Privacy Policy
              </a>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
            )}
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? 'Creating...' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPhase;