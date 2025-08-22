'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import EnhancedNotificationPanel from '@/components/reusable/EnhancedNotificationPanel';

interface NavbarProps {
  logo?: string;
  logoText?: string;
  navigationItems?: Array<{
    label: string;
    href: string;
    isActive?: boolean;
  }>;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export default function Navbar({
  logo = '/logo.png',
  logoText = 'OnlyIf',
  navigationItems = [
    { label: 'Buy', href: '/browse' },
    { label: 'Sell', href: '/sell' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Agents', href: '/agents' },
  ],
  ctaText = 'Sign In',
  ctaHref = '/signin',
  className = ''
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInDropdownOpen, setIsSignInDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const signInDropdownRef = useRef<HTMLDivElement>(null);
  const signInButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const signInOptions = [
    { label: 'Sign In as Buyer', href: '/signin?type=buyer' },
    { label: 'Sign In as Seller', href: '/signin?type=seller' },
    { label: 'Sign In as Agent', href: '/signin?type=agent' },
  ];

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setIsSignInDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      menuButtonRef.current &&
      !menuButtonRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }

    if (
      signInDropdownRef.current &&
      !signInDropdownRef.current.contains(event.target as Node) &&
      signInButtonRef.current &&
      !signInButtonRef.current.contains(event.target as Node)
    ) {
      setIsSignInDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white shadow-sm'
    } ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1.5 group">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-xs">{logoText.charAt(0)}</span>
            </div>
            <span className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {logoText}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-5">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group ${
                  item.isActive ? 'text-blue-600' : ''
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Notifications for authenticated users */}
            {user && (
              <EnhancedNotificationPanel 
                userType={user.userType}
                showAsDropdown={true}
                className="mr-2"
              />
            )}

            {!user ? (
              <div className="relative" ref={signInDropdownRef}>
                <button
                  ref={signInButtonRef}
                  onClick={() => setIsSignInDropdownOpen(!isSignInDropdownOpen)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {ctaText}
                </button>
                
                {isSignInDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {signInOptions.map((option) => (
                      <Link
                        key={option.label}
                        href={option.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsSignInDropdownOpen(false)}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">Welcome, {user.name || 'User'}</span>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 font-medium transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden py-4 border-t border-gray-200">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 rounded ${
                  item.isActive ? 'text-blue-600 bg-blue-50' : ''
                }`}
                onClick={handleMenuClose}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Sign In Options */}
            {!user && (
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  {signInOptions.map((option) => (
                    <Link
                      key={option.label}
                      href={option.href}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      onClick={handleMenuClose}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Mobile User Menu */}
            {user && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                  <span className="text-gray-700 font-medium">{user.name || 'User'}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    handleMenuClose();
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
