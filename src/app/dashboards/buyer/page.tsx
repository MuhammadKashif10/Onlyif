'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { buyerApi, type BuyerStats } from '@/api/buyer';
import { 
  Home, 
  Heart, 
  Eye, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Search, 
  Bell,
  Clock,
  MapPin,
  Bath,
  Bed,
  Square
} from 'lucide-react';

export default function BuyerDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buyerStats, setBuyerStats] = useState<BuyerStats>({ savedProperties: 0, viewedProperties: 0, scheduledViewings: 0, activeOffers: 0 });
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [viewedProperties, setViewedProperties] = useState<any[]>([]);
  const [scheduledViewings, setScheduledViewings] = useState<any[]>([]);
  const [activeOffers, setActiveOffers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Don't load data if still checking auth or no user
    if (authLoading) return;
    
    if (!user) {
      router.push('/signin');
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load buyer stats with fallback
        try {
          const stats = await buyerApi.getBuyerStats();
          setBuyerStats(stats || { savedProperties: 0, viewedProperties: 0, scheduledViewings: 0, activeOffers: 0 });
        } catch (err) {
          console.error('Failed to load buyer stats:', err);
          setBuyerStats({ savedProperties: 0, viewedProperties: 0, scheduledViewings: 0, activeOffers: 0 });
        }

        // Load saved properties with fallback
        try {
          const savedPropsResponse = await buyerApi.getSavedProperties({ limit: 6 });
          if (savedPropsResponse?.properties?.length > 0) {
            setSavedProperties(savedPropsResponse.properties.map(p => ({
              id: p.id,
              title: p.property?.title || 'Untitled Property',
              price: p.property?.price || 0,
              location: p.property?.location || 'Location not specified',
              bedrooms: p.property?.bedrooms || 0,
              bathrooms: p.property?.bathrooms || 0,
              sqft: p.property?.sqft || 0,
              image: p.property?.images?.[0] || '/api/placeholder/300/200',
              savedAt: p.savedAt
            })));
          } else {
            setSavedProperties([]);
          }
        } catch (err) {
          console.error('Failed to load saved properties:', err);
          setSavedProperties([]);
        }

        // Load viewed properties with fallback
        try {
          const viewedPropsResponse = await buyerApi.getViewedProperties({ limit: 6 });
          if (viewedPropsResponse?.properties?.length > 0) {
            setViewedProperties(viewedPropsResponse.properties.map(p => ({
              id: p.id,
              title: p.property?.title || 'Untitled Property',
              price: p.property?.price || 0,
              location: p.property?.location || 'Location not specified',
              bedrooms: p.property?.bedrooms || 0,
              bathrooms: p.property?.bathrooms || 0,
              sqft: p.property?.sqft || 0,
              image: p.property?.images?.[0] || '/api/placeholder/300/200',
              viewedAt: p.viewedAt,
              viewCount: p.viewCount || 1
            })));
          } else {
            setViewedProperties([]);
          }
        } catch (err) {
          console.error('Failed to load viewed properties:', err);
          setViewedProperties([]);
        }

        // Load scheduled viewings with fallback
        try {
          const viewingsResponse = await buyerApi.getScheduledViewings({ limit: 6 });
          setScheduledViewings(viewingsResponse?.viewings || []);
        } catch (err) {
          console.error('Failed to load scheduled viewings:', err);
          setScheduledViewings([]);
        }

        // Load active offers with fallback
        try {
          const offersResponse = await buyerApi.getActiveOffers({ limit: 6 });
          setActiveOffers(offersResponse?.offers || []);
        } catch (err) {
          console.error('Failed to load active offers:', err);
          setActiveOffers([]);
        }

        // Load recent activity with fallback
        try {
          const activity = await buyerApi.getRecentActivity(5);
          setRecentActivity(activity || []);
        } catch (err) {
          console.error('Failed to load recent activity:', err);
          setRecentActivity([]);
        }

      } catch (err) {
        console.error('Dashboard loading error:', err);
        setError('Failed to load dashboard data. Please try refreshing the page.');
        // Set empty defaults
        setBuyerStats({ savedProperties: 0, viewedProperties: 0, scheduledViewings: 0, activeOffers: 0 });
        setSavedProperties([]);
        setViewedProperties([]);
        setScheduledViewings([]);
        setActiveOffers([]);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, authLoading, router]);

  const handleViewAllSaved = () => {
    router.push('/dashboards/buyer/saved-properties');
  };

  const handleViewAllViewed = () => {
    router.push('/dashboards/buyer/viewed-properties');
  };

  const handleViewAllViewings = () => {
    router.push('/dashboards/buyer/scheduled-viewings');
  };

  const handleViewAllOffers = () => {
    router.push('/dashboards/buyer/active-offers');
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
          <Button onClick={() => router.push('/signin')}>Login</Button>
        </div>
      </div>
    );
  }

  // Show loading while fetching dashboard data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}! Here's your property search overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buyerStats.savedProperties}</div>
              <p className="text-xs text-muted-foreground">Properties you've saved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Viewed Properties</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buyerStats.viewedProperties}</div>
              <p className="text-xs text-muted-foreground">Properties you've viewed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Viewings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buyerStats.scheduledViewings}</div>
              <p className="text-xs text-muted-foreground">Upcoming viewings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buyerStats.activeOffers}</div>
              <p className="text-xs text-muted-foreground">Pending offers</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Saved Properties */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Saved Properties
                  </CardTitle>
                  <CardDescription>Properties you've marked as favorites</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleViewAllSaved}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {savedProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No saved properties yet</p>
                    <p className="text-sm text-gray-400">Start browsing properties and save your favorites!</p>
                    <Button className="mt-4" onClick={() => router.push('/browse')}>
                      Browse Properties
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedProperties.slice(0, 4).map((property) => (
                      <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <h4 className="font-semibold text-sm mb-1">{property.title}</h4>
                        <p className="text-lg font-bold text-blue-600 mb-1">${property.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mb-2">{property.location}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            {property.bedrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            {property.bathrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Square className="h-3 w-3" />
                            {property.sqft}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recently Viewed */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Recently Viewed
                  </CardTitle>
                  <CardDescription>Properties you've recently looked at</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleViewAllViewed}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {viewedProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No viewed properties yet</p>
                    <p className="text-sm text-gray-400">Start exploring properties to see your viewing history!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {viewedProperties.slice(0, 3).map((property) => (
                      <div key={property.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{property.title}</h4>
                          <p className="text-blue-600 font-bold">${property.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{property.location}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          Viewed {property.viewCount} time{property.viewCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Scheduled Viewings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Scheduled Viewings
                  </CardTitle>
                  <CardDescription>Your upcoming property visits</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleViewAllViewings}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {scheduledViewings.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">No scheduled viewings</p>
                    <p className="text-xs text-gray-400">Book a viewing when you find a property you like!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scheduledViewings.slice(0, 3).map((viewing) => (
                      <div key={viewing.id} className="border rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-1">{viewing.property.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{viewing.property.location}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {viewing.scheduledDate} at {viewing.scheduledTime}
                          </div>
                          <Badge variant={viewing.status === 'scheduled' ? 'default' : 'secondary'}>
                            {viewing.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Offers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Active Offers
                  </CardTitle>
                  <CardDescription>Your pending property offers</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleViewAllOffers}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {activeOffers.length === 0 ? (
                  <div className="text-center py-6">
                    <DollarSign className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">No active offers</p>
                    <p className="text-xs text-gray-400">Make an offer on a property you're interested in!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeOffers.slice(0, 3).map((offer) => (
                      <div key={offer.id} className="border rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-1">{offer.property.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{offer.property.location}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-green-600">${offer.offerAmount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Offer Amount</p>
                          </div>
                          <Badge variant={offer.status === 'pending' ? 'default' : 'secondary'}>
                            {offer.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-6">
                    <Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-1">No recent activity</p>
                    <p className="text-xs text-gray-400">Your activity will appear here as you use the platform!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}