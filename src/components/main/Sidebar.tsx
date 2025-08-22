'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  Heart, 
  MessageSquare, 
  Settings, 
  User,
  Building,
  FileText,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  userType: 'buyer' | 'seller' | 'agent';
  className?: string;
}

const buyerLinks = [
  { href: '/dashboards/buyer', label: 'Dashboard', icon: Home },
  { href: '/browse', label: 'Browse Properties', icon: Search },
  { href: '/dashboards/buyer/saved', label: 'Saved Properties', icon: Heart },
  { href: '/dashboards/buyer/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboards/buyer/account', label: 'Account Settings', icon: Settings },
];

const sellerLinks = [
  { href: '/dashboards/seller', label: 'Dashboard', icon: Home },
  { href: '/dashboards/seller/listings', label: 'My Listings', icon: Building },
  { href: '/dashboards/seller/offers', label: 'Offers', icon: FileText },
  { href: '/dashboards/seller/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboards/seller/account', label: 'Account Settings', icon: Settings },
];

const agentLinks = [
  { href: '/dashboards/agent', label: 'Dashboard', icon: Home },
  { href: '/dashboards/agent/clients', label: 'Clients', icon: Users },
  { href: '/dashboards/agent/listings', label: 'Listings', icon: Building },
  { href: '/dashboards/agent/leads', label: 'Leads', icon: User },
  { href: '/dashboards/agent/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboards/agent/account', label: 'Account Settings', icon: Settings },
];

export default function Sidebar({ userType, className = '' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const getLinks = () => {
    switch (userType) {
      case 'buyer':
        return buyerLinks;
      case 'seller':
        return sellerLinks;
      case 'agent':
        return agentLinks;
      default:
        return buyerLinks;
    }
  };

  const links = getLinks();

  return (
    <aside className={`bg-white shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {userType} Dashboard
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? link.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-blue-700' : 'text-gray-500'
                  }`} />
                  {!isCollapsed && (
                    <span className="font-medium">{link.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className={`flex items-center space-x-3 ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userType === 'buyer' ? 'John Doe' : userType === 'seller' ? 'Jane Smith' : 'Agent Name'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userType.charAt(0).toUpperCase() + userType.slice(1)}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}