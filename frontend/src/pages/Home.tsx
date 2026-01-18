import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

const Home: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 to-purple-900 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Innovate. Connect. Thrive.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Catalyzing a Sector-Driven Ecosystem of Change
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to={ROUTES.OMNIGRID}>
                <Button size="lg" className="w-full sm:w-auto">
                  Explore OmniGrid
                </Button>
              </Link>
              <Link to={ROUTES.DASHBOARD}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-purple-600">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              The Fruitful™ Ecosystem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              A holistic platform for digital transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover>
              <div className="text-center">
                <div className="text-5xl mb-4">🔐</div>
                <h3 className="text-2xl font-bold mb-3">VaultMesh™</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Intelligent data orchestration with ScrollClaims™ and PulseGrid™ sync
                </p>
                <Link to={ROUTES.VAULTMESH}>
                  <Button variant="secondary" size="sm">
                    Learn More
                  </Button>
                </Link>
              </div>
            </Card>

            <Card hover>
              <div className="text-center">
                <div className="text-5xl mb-4">📜</div>
                <h3 className="text-2xl font-bold mb-3">Treaty System™</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Binding interface to intention with unwavering alignment
                </p>
                <Link to={ROUTES.TREATY}>
                  <Button variant="secondary" size="sm">
                    Learn More
                  </Button>
                </Link>
              </div>
            </Card>

            <Card hover>
              <div className="text-center">
                <div className="text-5xl mb-4">🌳</div>
                <h3 className="text-2xl font-bold mb-3">Baobab Terminal</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Threat intelligence and security orchestration dashboard
                </p>
                <Link to={ROUTES.BAOBAB}>
                  <Button variant="secondary" size="sm">
                    Learn More
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Ecosystem Links */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Part of the <span className="gradient-text">FAA.ZONE™</span> Ecosystem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Integrated with powerful platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <a 
              href="https://homemart.africa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <Card hover glass>
                <div className="text-center">
                  <div className="text-4xl mb-3">🛍️</div>
                  <h4 className="text-lg font-semibold group-hover:text-purple-600">
                    Homemart.africa
                  </h4>
                </div>
              </Card>
            </a>

            <a 
              href="https://faa.zone" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <Card hover glass>
                <div className="text-center">
                  <div className="text-4xl mb-3">🌍</div>
                  <h4 className="text-lg font-semibold group-hover:text-purple-600">
                    FAA.ZONE™
                  </h4>
                </div>
              </Card>
            </a>

            <a 
              href="https://seedwave.faa.zone" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <Card hover glass>
                <div className="text-center">
                  <div className="text-4xl mb-3">🌱</div>
                  <h4 className="text-lg font-semibold group-hover:text-purple-600">
                    SeedWave
                  </h4>
                </div>
              </Card>
            </a>

            <a 
              href="https://hotstack.faa.zone" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <Card hover glass>
                <div className="text-center">
                  <div className="text-4xl mb-3">🔥</div>
                  <h4 className="text-lg font-semibold group-hover:text-purple-600">
                    HotStack
                  </h4>
                </div>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Join the Fruitful™ Community?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Be part of the transformative journey towards a connected and thriving planet
          </p>
          <Link to={ROUTES.CHECKOUT}>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
