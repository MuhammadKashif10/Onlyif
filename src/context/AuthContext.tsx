'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'buyer' | 'seller' | 'agent' | 'admin';
  role: 'buyer' | 'seller' | 'agent' | 'admin'; // Add role field for backend compatibility
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  sendOtp: (email?: string, phone?: string) => Promise<void>;
  verifyOtp: (email: string | undefined, phone: string | undefined, otp: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  type: 'buyer' | 'seller' | 'agent';
  // Agent-specific fields
  phone?: string;
  licenseNumber?: string;
  brokerage?: string;
  yearsOfExperience?: number;
  specialization?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing user session and token only in browser
    if (typeof window !== 'undefined') {
      const savedUser = sessionStorage.getItem('user');
      const savedToken = sessionStorage.getItem('token');
      
      if (savedUser && savedToken) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
        }
      }
    }
    setIsLoading(false);

    // Add event listeners for browser close/refresh
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Clear session data when browser is closing
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('user');
      }
    };

    const handleUnload = () => {
      // Clear session data when page is unloading
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('user');
      }
    };

    const handleVisibilityChange = () => {
      // Optional: Clear session when tab becomes hidden for extended period
      if (document.visibilityState === 'hidden') {
        // You can add a timeout here if needed
        setTimeout(() => {
          if (document.visibilityState === 'hidden') {
            sessionStorage.removeItem('user');
            setUser(null);
          }
        }, 30000); // 30 seconds of inactivity
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call real backend API instead of mock
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Store both user data and JWT token
      const userData = {
        ...data.data.user,
        type: data.data.user.role, // Map 'role' to 'type' for frontend compatibility
        role: data.data.user.role, // Keep 'role' for backend compatibility
      };
      
      setUser(userData);
      // Store user data and token separately
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('token', data.data.token);
      }
    } catch (err) {
      setError('Invalid email or password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the restricted admin login endpoint
      const response = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Admin login failed');
      }
  
      const data = await response.json();
      
      const userData = {
        ...data.data.user,
        type: data.data.user.role,
        role: data.data.user.role,
      };
      
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', data.data.token);
    } catch (err) {
      setError('Invalid admin credentials or unauthorized account');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare request body
      const requestBody: any = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.type, // Map 'type' to 'role' for backend
      };
  
      // Add phone field for all user types if provided
      if (userData.phone) {
        requestBody.phone = userData.phone;
      }
  
      // Add agent-specific fields if registering as agent
      if (userData.type === 'agent') {
        requestBody.licenseNumber = userData.licenseNumber;
        requestBody.brokerage = userData.brokerage;
        requestBody.yearsOfExperience = userData.yearsOfExperience;
        requestBody.specialization = userData.specialization;
      }
  
      // Call real backend API instead of mock
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
  
      const data = await response.json();
      
      const newUser = {
        ...data.data.user,
        type: data.data.user.role, // Map 'role' to 'type' for compatibility
      };
      
      setUser(newUser);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(newUser));
        sessionStorage.setItem('token', data.data.token);
      }
    } catch (err) {
      setError('Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    }
    // Clear both user data and token
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const sendOtp = async (email?: string, phone?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send OTP');
      }

      // OTP sent successfully
    } catch (err) {
      setError('Failed to send OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string | undefined, phone: string | undefined, otp: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed');
      }

      const data = await response.json();
      
      // Store user data and JWT token after successful OTP verification
      const userData = {
        ...data.data.user,
        type: data.data.user.role,
        role: data.data.user.role,
      };
      
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', data.data.token);
    } catch (err) {
      setError('OTP verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.type === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      login,
      adminLogin,
      logout,
      register,
      sendOtp,
      verifyOtp,
      isLoading,
      error,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}