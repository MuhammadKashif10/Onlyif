// Utility to conditionally use mock data based on environment variable
export const USE_MOCKS = process.env.USE_MOCKS === 'true';

// Helper function to conditionally return mock data or make real API calls
export function withMockFallback<T>(
  mockData: () => Promise<T>,
  realApiCall: () => Promise<T>
): Promise<T> {
  return USE_MOCKS ? mockData() : realApiCall();
}

// Helper for synchronous mock data
export function withMockFallbackSync<T>(
  mockData: () => T,
  realApiCall: () => Promise<T>
): Promise<T> {
  return USE_MOCKS ? Promise.resolve(mockData()) : realApiCall();
}