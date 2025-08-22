'use client';

import React from 'react';
import { useBuyerContext } from '@/context/BuyerContext';

interface Phase {
  id: number;
  title: string;
  component: React.ComponentType;
}

interface WizardStepperProps {
  phases: Phase[];
}

export default function WizardStepper({ phases }: WizardStepperProps) {
  const { currentPhase, buyerData } = useBuyerContext();

  const getPhaseStatus = (phaseId: number) => {
    if (phaseId < currentPhase) return 'completed';
    if (phaseId === currentPhase) return 'active';
    return 'upcoming';
  };

  const isPhaseAccessible = (phaseId: number) => {
    switch (phaseId) {
      case 1: return true; // Registration always accessible
      case 2: return true; // OTP verification accessible after registration
      case 3: return buyerData.otpVerified; // Browse accessible after OTP verification
      case 4: return buyerData.selectedProperty !== null; // Payment accessible after property selection
      case 5: return buyerData.paymentCompleted; // Interest accessible after payment
      default: return false;
    }
  };

  return (
    <div className="px-6 py-4 bg-gray-50 border-b">
      <div className="flex items-center justify-between">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase.id);
          const isAccessible = isPhaseAccessible(phase.id);
          
          return (
            <React.Fragment key={phase.id}>
              <div className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${
                    status === 'completed'
                      ? 'bg-green-600 text-white'
                      : status === 'active'
                      ? 'bg-green-600 text-white'
                      : isAccessible
                      ? 'bg-gray-300 text-gray-700'
                      : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  {status === 'completed' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    phase.id
                  )}
                </div>
                <span className={`
                  ml-2 text-sm font-medium
                  ${
                    status === 'active'
                      ? 'text-green-600'
                      : isAccessible
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }
                `}>
                  {phase.title}
                </span>
              </div>
              
              {index < phases.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-4
                  ${
                    getPhaseStatus(phase.id + 1) === 'completed' || getPhaseStatus(phase.id) === 'completed'
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}