'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BuyerData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otpVerified: boolean;
  termsAccepted: boolean;
  selectedProperty?: any;
  interestExpressed: boolean;
}

interface BuyerContextType {
  buyerData: BuyerData;
  currentPhase: number;
  updateBuyerData: (data: Partial<BuyerData>) => void;
  setPhase: (phase: number) => void;
  nextPhase: () => void;
  prevPhase: () => void;
  canProceedToPhase: (phase: number) => boolean;
  resetBuyerData: () => void;
}

const initialBuyerData: BuyerData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  otpVerified: false,
  termsAccepted: false,
  interestExpressed: false,
};

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export const BuyerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [buyerData, setBuyerData] = useState<BuyerData>(initialBuyerData);
  const [currentPhase, setCurrentPhase] = useState(1);

  const updateBuyerData = (data: Partial<BuyerData>) => {
    setBuyerData(prev => ({ ...prev, ...data }));
  };

  const setPhase = (phase: number) => {
    if (phase >= 1 && phase <= 3 && canProceedToPhase(phase)) {
      setCurrentPhase(phase);
    }
  };

  const nextPhase = () => {
    if (currentPhase < 3 && canProceedToPhase(currentPhase + 1)) {
      setCurrentPhase(prev => prev + 1);
    }
  };

  const prevPhase = () => {
    if (currentPhase > 1) {
      setCurrentPhase(prev => prev - 1);
    }
  };

  const canProceedToPhase = (phase: number): boolean => {
    switch (phase) {
      case 1:
        return true; // Always can access registration
      case 2:
        // Can proceed to OTP verification if basic info is filled
        return !!(buyerData.name && buyerData.email);
      case 3:
        // Can proceed to Express Interest if OTP is verified
        return buyerData.otpVerified;
      default:
        return false;
    }
  };

  const resetBuyerData = () => {
    setBuyerData(initialBuyerData);
    setCurrentPhase(1);
  };

  const value: BuyerContextType = {
    buyerData,
    currentPhase,
    updateBuyerData,
    setPhase,
    nextPhase,
    prevPhase,
    canProceedToPhase,
    resetBuyerData,
  };

  return (
    <BuyerContext.Provider value={value}>
      {children}
    </BuyerContext.Provider>
  );
};

export const useBuyerContext = () => {
  const context = useContext(BuyerContext);
  if (context === undefined) {
    throw new Error('useBuyerContext must be used within a BuyerProvider');
  }
  return context;
};