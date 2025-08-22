'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/reusable';

export default function CreateAccountPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('buyer');

  const roles = [
    {
      id: 'buyer',
      title: 'Property Buyer',
      description: 'Browse and purchase properties',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17l-4-4 4-4" />
        </svg>
      ),
      route: '/buy/onboard'
    },
    {
      id: 'seller',
      title: 'Property Seller',
      description: 'List and sell properties',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      route: '/sell/onboard'
    },
    {
      id: 'agent',
      title: 'Agent',
      description: 'Manage and assist in property transactions',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      route: '/dashboards/agent/register' // Changed from '/dashboards/agent/flow'
    }
  ];

  const handleRoleSelection = () => {
    const selectedRoleData = roles.find(role => role.id === selectedRole);
    if (selectedRoleData) {
      router.push(selectedRoleData.route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Choose your role to get started with OnlyIf</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-md ${
                  selectedRole === role.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedRole(role.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedRole(role.id);
                  }
                }}
                aria-label={`Select ${role.title} role`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`mb-4 ${
                    selectedRole === role.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {role.icon}
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    selectedRole === role.id ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {role.title}
                  </h3>
                  <p className={`text-sm ${
                    selectedRole === role.id ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    {role.description}
                  </p>
                </div>
                
                {/* Radio button indicator */}
                <div className="absolute top-4 right-4">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedRole === role.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {selectedRole === role.id && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={handleRoleSelection}
              variant="primary"
              size="lg"
              className="px-8"
              aria-label="Continue with selected role"
            >
              Continue as {roles.find(role => role.id === selectedRole)?.title}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/signin" className="text-blue-600 hover:underline font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}