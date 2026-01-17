import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

const OmniGrid: React.FC = () => {
  const [activeTerminal, setActiveTerminal] = useState('vaultmaster');
  const navigationButtons = [
    { to: 'https://homemart.africa', label: '🛍️ Homemart.africa', external: true },
    { to: ROUTES.HOME, label: '🏠 Portal Home', external: false },
    { to: ROUTES.DASHBOARD, label: '📊 Dashboard', external: false },
    { to: ROUTES.EXPLORE, label: '🔍 Explore', external: false },
    { to: ROUTES.VAULTMESH, label: '🔐 VaultMesh™', external: false },
    { to: ROUTES.SECTORS, label: '📦 Sectors', external: false },
    { to: ROUTES.TREATY, label: '📜 Treaty System™', external: false },
    { to: ROUTES.BAOBAB, label: '🌳 Baobab Terminal', external: false },
    { to: ROUTES.ADMIN, label: '⚙️ Admin Portal', external: false },
    { to: ROUTES.CHECKOUT, label: '💳 Checkout', external: false },
    { to: 'https://faa.zone', label: '🌍 FAA.ZONE™', external: true },
    { to: 'https://seedwave.faa.zone', label: '🌱 SeedWave', external: true },
    { to: 'https://hotstack.faa.zone', label: '🔥 HotStack', external: true },
    { to: 'https://signal.faa.zone', label: '📡 Signal', external: true },
    { to: 'https://vault.faa.zone', label: '🏦 Vault', external: true },
  ];

  const portalFeatures = [
    {
      icon: '🔐',
      title: 'Vault Access',
      description: 'Secure digital asset management with VaultDNA™',
    },
    {
      icon: '📜',
      title: 'Treaty System',
      description: 'Align interface to intention with TreatyCommerce™',
    },
    {
      icon: '🔄',
      title: 'VaultMesh™',
      description: 'Real-time ScrollClaims™ and PulseGrid™ synchronization',
    },
    {
      icon: '🌳',
      title: 'Baobab Security',
      description: 'Threat intelligence and orchestration dashboard',
    },
  ];

  const sectorTerminals = [
    { id: 'vaultmaster', label: '🦍 VaultMaster Terminal', sector: 'VaultMaster' },
    { id: 'cube-lattice', label: '🧱 Cube Lattice GPT', sector: 'Cube Lattice' },
    { id: 'global-view', label: '🌍 Global View GPT', sector: 'Global View' },
    { id: 'freight-ops', label: '🚚 Freight Ops GPT', sector: 'Freight & Logistics' },
    { id: 'loop-watch', label: '♻️ Loop Watch GPT', sector: 'Circular Economy' },
    { id: 'seedwave', label: '🌱 Seedwave GPT', sector: 'Agriculture' },
    { id: 'distribution', label: '📦 Distribution GPT', sector: 'Distribution' },
    { id: 'signal', label: '🔐 Signal GPT', sector: 'Communications' },
    { id: 'faa-brands', label: '📦 7038 FAA Brands', sector: 'Brand Management' },
  ];

  const handleTerminalChange = (terminalId: string) => {
    setActiveTerminal(terminalId);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              OmniGrid™
            </h1>
            <p className="text-xl md:text-2xl text-purple-100">
              Your Central Access Hub to the FAA.ZONE™ Ecosystem
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Navigation</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Access all portals and features from one central location
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {navigationButtons.map((button, index) => (
              button.external ? (
                <a
                  key={index}
                  href={button.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card hover className="text-center h-full">
                    <div className="text-3xl mb-2">{button.label.split(' ')[0]}</div>
                    <div className="text-sm font-semibold group-hover:text-purple-600 transition-colors">
                      {button.label.substring(button.label.indexOf(' ') + 1)}
                    </div>
                  </Card>
                </a>
              ) : (
                <Link key={index} to={button.to} className="group">
                  <Card hover className="text-center h-full">
                    <div className="text-3xl mb-2">{button.label.split(' ')[0]}</div>
                    <div className="text-sm font-semibold group-hover:text-purple-600 transition-colors">
                      {button.label.substring(button.label.indexOf(' ') + 1)}
                    </div>
                  </Card>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Portal Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              Portal Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Powerful tools for the connected ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portalFeatures.map((feature, index) => (
              <Card key={index} hover>
                <div className="text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Explorer */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ecosystem Explorer</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover the interconnected FAA.ZONE™ network
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card glass>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Active Repositories</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Repos</span>
                      <span className="font-bold text-purple-600">84</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Active Workflows</span>
                      <span className="font-bold text-purple-600">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Pulse Interval</span>
                      <span className="font-bold text-purple-600">9s</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Treaty Brands</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Brands</span>
                      <span className="font-bold text-purple-600">7,038</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Active Brands</span>
                      <span className="font-bold text-purple-600">6,891</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Growth</span>
                      <span className="font-bold text-green-600">+147</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sector Terminals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">🔐 Sector Terminals</h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered sector intelligence with Perplexity integration
            </p>
          </div>

          {/* Terminal Display */}
          <div className="w-full max-w-6xl mx-auto mb-10">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-sm text-gray-400">
                    {sectorTerminals.find(t => t.id === activeTerminal)?.sector} Terminal
                  </span>
                </div>
              </div>
              <div className="w-full h-[600px] bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <iframe
                  key={activeTerminal}
                  src={`https://www.perplexity.ai/?q=${encodeURIComponent(`Tell me about ${sectorTerminals.find(t => t.id === activeTerminal)?.sector} in the context of FAA.ZONE ecosystem`)}`}
                  className="w-full h-full"
                  title={`${sectorTerminals.find(t => t.id === activeTerminal)?.sector} Terminal`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </Card>
          </div>

          {/* Terminal Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {sectorTerminals.map((terminal) => (
              <button
                key={terminal.id}
                onClick={() => handleTerminalChange(terminal.id)}
                className={`p-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTerminal === terminal.id
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 shadow-md hover:shadow-xl'
                }`}
              >
                {terminal.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Powered by <span className="gradient-text">Homemart.africa</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              OmniGrid™ seamlessly integrates with Homemart.africa, providing unified access 
              to TreatyCommerce™, VaultMesh™, and the complete FAA.ZONE™ ecosystem.
            </p>
            <a
              href="https://homemart.africa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button className="btn-primary text-lg">
                Visit Homemart.africa →
              </button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OmniGrid;
