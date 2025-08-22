'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BuyerData {
  name: string;
  email: string;
  phone: string;
  password?: string; // Transient field for registration
  confirmPassword?: string; // Transient field for registration
  otp: string;
  termsAccepted: boolean;
  // Add missing properties that WizardStepper expects
  otpVerified: boolean;
  selectedProperty: any | null;
  paymentCompleted: boolean;
  paymentId?: string;
}

interface BuyerContextType {
  buyerData: BuyerData;
  currentPhase: number;
  updateBuyerData: (data: Partial<BuyerData>) => void;
  clearBuyerData: () => void;
  clearPasswordData: () => void; // Clear only password fields
  nextPhase: () => void;
  prevPhase: () => void;
  setPhase: (phase: number) => void;
}

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export const useBuyerContext = () => {
  const context = useContext(BuyerContext);
  if (!context) {
    throw new Error('useBuyerContext must be used within a BuyerProvider');
  }
  return context;
};

interface BuyerProviderProps {
  children: ReactNode;
}

export const BuyerProvider: React.FC<BuyerProviderProps> = ({ children }) => {
  const [currentPhase, setCurrentPhase] = useState(1); // Start with phase 1
  const [buyerData, setBuyerData] = useState<BuyerData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
    termsAccepted: false,
    // Add missing properties with default values
    otpVerified: false,
    selectedProperty: null,
    paymentCompleted: false,
    paymentId: undefined,
  });

  const updateBuyerData = (data: Partial<BuyerData>) => {
    setBuyerData(prev => ({ ...prev, ...data }));
  };

  const clearBuyerData = () => {
    setBuyerData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      otp: '',
      termsAccepted: false,
      // Reset missing properties
      otpVerified: false,
      selectedProperty: null,
      paymentCompleted: false,
      paymentId: undefined,
    });
    setCurrentPhase(1); // Reset to first phase
  };

  const clearPasswordData = () => {
    setBuyerData(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }));
  };

  const nextPhase = () => {
    setCurrentPhase(prev => Math.min(prev + 1, 4)); // Max 4 phases
  };

  const prevPhase = () => {
    setCurrentPhase(prev => Math.max(prev - 1, 1)); // Min phase 1
  };

  const setPhase = (phase: number) => {
    setCurrentPhase(Math.max(1, Math.min(phase, 4))); // Ensure phase is between 1-4
  };

  return (
    <BuyerContext.Provider value={{
      buyerData,
      currentPhase,
      updateBuyerData,
      clearBuyerData,
      clearPasswordData,
      nextPhase,
      prevPhase,
      setPhase
    }}>
      {children}
    </BuyerContext.Provider>
  );
};