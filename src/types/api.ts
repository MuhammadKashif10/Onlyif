// API Types and Interfaces

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  beds: number;
  baths: number;
  size: number;
  yearBuilt: number;
  lotSize: number;
  propertyType: string;
  status: 'pending' | 'private' | 'public' | 'sold' | 'withdrawn';
  description: string;
  features: string[];
  images: string[];
  mainImage: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  agent: Agent;
  assignedAgent?: Agent; // New field for assigned agent
  similarProperties: string[];
  featured: boolean;
  dateListed: string;
  daysOnMarket: number;
  // New visibility-related fields
  hasRequiredMedia: boolean;
  isAdminApproved: boolean;
  canChangeVisibility: boolean;
  visibilityLastUpdated?: string;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  avatar: string;
  rating: number;
  reviews: number;
  experience: string;
  specializations: string[];
  languages: string[];
  bio: string;
  propertiesSold: number;
  averageDaysOnMarket: number;
  office: string;
  socialMedia: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  propertyType: string;
  location: string;
  date: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  newsletter?: boolean;
  id?: string;
  submittedAt?: string;
}

export interface FilterOptions {
  propertyType?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  beds?: number;
  baths?: number;
  sortBy?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface SearchOptions {
  query: string;
  filters?: FilterOptions;
  pagination?: PaginationOptions;
}

export interface PropertyStats {
  totalProperties: number;
  averagePrice: number;
  totalValue: number;
  featuredCount: number;
}

export interface FilterOptionsData {
  propertyTypes: string[];
  cities: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sizeRange: {
    min: number;
    max: number;
  };
}

export interface TestimonialStats {
  totalTestimonials: number;
  averageRating: number;
  fiveStarCount: number;
  propertyTypes: string[];
}

export interface AgentStats {
  totalAgents: number;
  averageRating: number;
  totalPropertiesSold: number;
  offices: string[];
}

export interface ContactStats {
  totalSubmissions: number;
  todaySubmissions: number;
  subjectCounts: Record<string, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  senderRole: 'buyer' | 'seller' | 'agent';
  receiverRole: 'buyer' | 'seller' | 'agent';
  messageText: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isRead: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface Conversation {
  id: string;
  type: 'buyer_agent' | 'agent_seller';
  participants: ConversationParticipant[];
  propertyId?: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  userId: string;
  role: 'buyer' | 'seller' | 'agent';
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface SendMessageRequest {
  conversationId: string;
  receiverId: string;
  messageText: string;
  attachments?: File[];
}

export interface CreateConversationRequest {
  type: 'buyer_agent' | 'agent_seller';
  participantIds: string[];
  propertyId?: string;
  initialMessage?: string;
}

// Admin-specific interfaces
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'agent';
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  propertiesCount?: number;
  totalSpent?: number;
}

export interface AdminListing {
  id: string;
  title: string;
  address: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'private' | 'public' | 'sold' | 'withdrawn';
  price: number;
  createdAt: string;
  views: number;
  unlocks: number;
}

export interface FlaggedContent {
  id: string;
  type: 'listing' | 'message' | 'user';
  contentId: string;
  reportedBy: {
    id: string;
    name: string;
    email: string;
  };
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'dismissed' | 'removed';
  createdAt: string;
  moderatedBy?: {
    id: string;
    name: string;
  };
  moderatedAt?: string;
  moderationReason?: string;
}

export interface PaymentRecord {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  type: 'property_unlock' | 'premium_listing' | 'virtual_tour' | 'professional_photos' | 'featured_property';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  propertyId?: string;
  transactionId: string;
}

export interface Assignment {
  id: string;
  type: 'buyer_agent' | 'seller_agent';
  buyer?: {
    id: string;
    name: string;
    email: string;
  };
  seller?: {
    id: string;
    name: string;
    email: string;
  };
  agent: {
    id: string;
    name: string;
    email: string;
  };
  property?: {
    id: string;
    title: string;
    address: string;
  };
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface TermsLog {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'buyer' | 'seller' | 'agent';
  };
  termsVersion: string;
  acceptedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AdminAnalytics {
  totalUsers: {
    total: number;
    buyers: number;
    sellers: number;
    agents: number;
  };
  activeListings: number;
  pendingListings: number;
  totalPayments: number;
  suspendedAccounts: number;
  userGrowth: Array<{
    date: string;
    buyers: number;
    sellers: number;
    agents: number;
  }>;
  listingsByStatus: Array<{
    status: string;
    count: number;
  }>;
  paymentsByMonth: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
}
