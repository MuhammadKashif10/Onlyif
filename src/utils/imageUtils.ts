interface ImagePlaceholders {
  [key: string]: string[];
}

const PROPERTY_PLACEHOLDERS: ImagePlaceholders = {
  'Single Family': [
    '/images/01.jpg',
    '/images/02.jpg',
    '/images/03.jpg'
  ],
  'Condo': [
    '/images/04.jpg',
    '/images/05.jpg',
    '/images/06.jpg'
  ],
  'Townhouse': [
    '/images/01.jpg',
    '/images/03.jpg',
    '/images/05.jpg'
  ],
  'Apartment': [
    '/images/02.jpg',
    '/images/04.jpg',
    '/images/06.jpg'
  ],
  'default': [
    '/images/01.jpg',
    '/images/02.jpg',
    '/images/03.jpg'
  ]
};

const ADDON_PLACEHOLDERS = [
  '/images/04.jpg',
  '/images/05.jpg',
  '/images/06.jpg'
];

/**
 * Validates if a URL is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Check for valid URL format
  try {
    new URL(url.startsWith('/') ? `https://example.com${url}` : url);
  } catch {
    return false;
  }
  
  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  return imageExtensions.test(url.split('?')[0]);
}

/**
 * Gets a random placeholder image for a specific property type
 */
export function getPropertyPlaceholder(propertyType?: string): string {
  const type = propertyType || 'default';
  const placeholders = PROPERTY_PLACEHOLDERS[type] || PROPERTY_PLACEHOLDERS.default;
  const randomIndex = Math.floor(Math.random() * placeholders.length);
  return placeholders[randomIndex];
}

/**
 * Gets a random placeholder image for add-on services
 */
export function getAddonPlaceholder(): string {
  const randomIndex = Math.floor(Math.random() * ADDON_PLACEHOLDERS.length);
  return ADDON_PLACEHOLDERS[randomIndex];
}

/**
 * Returns a safe image URL with fallback to placeholder
 */
export function getSafeImageUrl(imageUrl?: string, propertyType?: string): string {
  if (imageUrl && isValidImageUrl(imageUrl)) {
    return imageUrl;
  }
  return getPropertyPlaceholder(propertyType);
}

/**
 * Returns an array of safe image URLs with fallbacks
 */
export function getSafeImageArray(
  images: string[], 
  propertyType?: string, 
  minCount: number = 1
): string[] {
  const validImages = images.filter(img => img && isValidImageUrl(img));
  
  // If we have enough valid images, return them
  if (validImages.length >= minCount) {
    return validImages;
  }
  
  // Otherwise, fill with placeholders
  const result = [...validImages];
  const placeholders = PROPERTY_PLACEHOLDERS[propertyType || 'default'] || PROPERTY_PLACEHOLDERS.default;
  
  while (result.length < minCount) {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    const placeholder = placeholders[randomIndex];
    if (!result.includes(placeholder)) {
      result.push(placeholder);
    }
  }
  
  return result;
}