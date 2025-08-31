export const formatPropertyAddress = (address: any): string => {
  if (typeof address === 'string') {
    return address;
  }
  
  if (address && typeof address === 'object') {
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zipCode) parts.push(address.zipCode);
    return parts.join(', ') || 'Address not available';
  }
  
  return 'Address not available';
};