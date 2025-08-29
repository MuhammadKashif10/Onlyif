// API Index - Export all API functions
export { propertiesApi } from './properties';
export { testimonialsApi } from './testimonials';
export { agentsApi } from './agents';
export { contactApi } from './contact';
export { offersApi } from './offers';
export { adminApi } from './admin';
export { sellerApi } from './seller';

// Re-export types for convenience
export type {
  Property,
  Agent,
  Testimonial,
  ContactFormData,
  FilterOptions,
  PaginationOptions,
  SearchOptions,
  PropertyStats,
  FilterOptionsData,
  TestimonialStats,
  AgentStats,
  ContactStats,
  ApiResponse,
  PaginatedResponse
} from '@/types/api';

// Remove this problematic line:
// export type { OfferRequest, OfferResponse } from './offers';

export * from './messages';
export * from './notifications';
export * from './listingVisibility';
export * from './corelogic';
export * from './assignments';
export * from './offers';
export * from './properties';
export * from './agents';
export * from './contact';
export * from './testimonials';
export * from './admin';
export * from './seller';
