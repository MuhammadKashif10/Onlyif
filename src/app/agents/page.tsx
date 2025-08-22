import { Metadata } from 'next';
import { Navbar, Footer, AgentCardSkeleton, LoadingError } from '@/components';
import { agentsApi } from '@/api';
import HeroSection from '@/components/sections/HeroSection';

export const metadata: Metadata = {
  title: 'Our Agents | OnlyIf - Real Estate Platform',
  description: 'Meet our experienced real estate agents who are here to help you find your perfect home or sell your property.',
  keywords: 'real estate agents, property agents, home buying, home selling, OnlyIf',
};

export default async function AgentsPage() {
  try {
    const agents = await agentsApi.getAgents();
    const topAgents = await agentsApi.getTopAgents(3);
    const stats = await agentsApi.getAgentStats();

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

        {/* Top Agents Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Top Performing Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topAgents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
                  <p className="text-gray-600 mb-2">{agent.specializations[0]}</p>
                  <p className="text-sm text-gray-500 mb-4">{agent.experience} years experience</p>
                  <div className="flex justify-center items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(agent.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({agent.rating})</span>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Contact Agent
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Agents Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              All Our Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                  <p className="text-gray-600 mb-2 text-sm">{agent.specializations[0]}</p>
                  <p className="text-xs text-gray-500 mb-3">{agent.experience} years experience</p>
                  <div className="flex justify-center items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3 h-3 ${i < Math.floor(agent.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-600">({agent.rating})</span>
                  </div>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    Contact
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error loading agents:', error);
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingError 
            message="Failed to load agents"
            onRetry={() => window.location.reload()}
          />
        </div>
        <Footer />
      </div>
    );
  }
}