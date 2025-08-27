'use client';

import { useEffect, useState } from 'react';
import { Navbar, Footer, AgentCardSkeleton, LoadingError } from '@/components';
import { agentsApi } from '@/api';
import HeroSection from '@/components/sections/HeroSection';

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [agentsData, topAgentsData, statsData] = await Promise.all([
          agentsApi.getAgents(),
          agentsApi.getTopAgents(3),
          agentsApi.getGeneralStats()
        ]);
        
        setAgents(agentsData.data || agentsData);
        setTopAgents(topAgentsData.data || topAgentsData);
        setStats(statsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <AgentCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <LoadingError onRetry={handleRetry} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection
        backgroundImage="/images/02.jpg"
        headline="Work with Expert Agents"
        subheadline="Connect with experienced real estate professionals in your area"
        primaryCtaText="Find an Agent"
        primaryCtaHref="#agent-search"
        secondaryCtaText="Become an Agent"
        secondaryCtaHref="/agents/join"
      />

      {/* Stats Section */}
      {stats && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalAgents}+</div>
                <div className="text-gray-600">Expert Agents</div>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalPropertiesSold}</div>
                <div className="text-gray-600">Properties Sold</div>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.averageRating}/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Agents Section */}
      {topAgents.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top Performing Agents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topAgents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="text-center">
                    <img
                      src={agent.avatar || '/images/default-avatar.jpg'}
                      alt={agent.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{agent.name}</h3>
                    <p className="text-gray-600 mb-2">{agent.title}</p>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-600">{agent.rating} ({agent.reviews} reviews)</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{agent.experience} experience</p>
                    <div className="space-y-2">
                      <a href={`tel:${agent.phone}`} className="block text-blue-600 hover:text-blue-800">
                        {agent.phone}
                      </a>
                      <a href={`mailto:${agent.email}`} className="block text-blue-600 hover:text-blue-800">
                        {agent.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Agents Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center">
                  <img
                    src={agent.avatar || '/images/default-avatar.jpg'}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h3>
                  <p className="text-gray-600 mb-2">{agent.title}</p>
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-600 text-sm">{agent.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{agent.office}</p>
                  <div className="space-y-1">
                    <a href={`tel:${agent.phone}`} className="block text-blue-600 hover:text-blue-800 text-sm">
                      {agent.phone}
                    </a>
                    <a href={`mailto:${agent.email}`} className="block text-blue-600 hover:text-blue-800 text-sm">
                      {agent.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}