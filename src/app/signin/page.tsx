'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components';
import { InputField, Button, Alert } from '@/components/reusable';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, adminLogin, user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('buyer');

  useEffect(() => {
    // Get user type from URL params
    const type = searchParams.get('type');
    if (type && ['buyer', 'seller', 'agent', 'admin'].includes(type)) {
      setUserType(type);
    }
  }, [searchParams]);

  useEffect(() => {
    // Redirect if already authenticated
    if (user) {
      switch (user.role) {
        case 'buyer':
          router.push('/dashboards/buyer');
          break;
        case 'seller':
          router.push('/dashboards/seller');
          break;
        case 'agent':
          router.push('/dashboards/agent');
          break;
        case 'admin':
          router.push('/admin');
          break;
        default:
          router.push('/');
      }
    }
  }, [user, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (userType === 'admin') {
        await adminLogin(formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      // Redirect will be handled by useEffect above
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case 'buyer': return 'Buyer';
      case 'seller': return 'Seller';
      case 'agent': return 'Agent';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  const getRegistrationLink = () => {
    switch (userType) {
      case 'buyer': return '/dashboards/buyer/create-account';
      case 'seller': return '/dashboards/seller/register';
      case 'agent': return '/dashboards/agent/register';
      default: return '/dashboards/create-account';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center pt-4 sm:pt-6 md:pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in as {getUserTypeTitle()}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          {/* User Type Selector */}
          <div className="flex justify-center space-x-4">
            {['buyer', 'seller', 'agent'].map((type) => (
              <button
                key={type}
                onClick={() => setUserType(type)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  userType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}

            <div className="space-y-4">
              <InputField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
              />

              <InputField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting || isLoading}
              className="w-full"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href={getRegistrationLink()} className="font-medium text-blue-600 hover:text-blue-500">
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}