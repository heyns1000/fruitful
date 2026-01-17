import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';

const Treaty: React.FC = () => {
  return (
    <Layout>
      <section className="bg-gradient-to-r from-purple-600 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">📜 Treaty System™</h1>
          <p className="text-purple-100">Binding Interface to Intention</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-4">What is the Treaty System™?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The Treaty System™ is the foundational layer of FAA.ZONE™ that binds interface 
                to intention, ensuring unwavering alignment across all ecosystem interactions.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Unlike traditional eCommerce, TreatyCommerce™ is built on principles of 
                alignment, transparency, and mutual benefit.
              </p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card hover>
                <div className="text-center">
                  <div className="text-5xl mb-4">🦍</div>
                  <h3 className="text-xl font-bold mb-2">Gorilla Holds the Flame</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Symbol of strength, wisdom, and protection in our governance model
                  </p>
                </div>
              </Card>

              <Card hover>
                <div className="text-center">
                  <div className="text-5xl mb-4">⚖️</div>
                  <h3 className="text-xl font-bold mb-2">Aligned Governance</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Ensuring ethical operations and collective impact
                  </p>
                </div>
              </Card>

              <Card hover>
                <div className="text-center">
                  <div className="text-5xl mb-4">🤝</div>
                  <h3 className="text-xl font-bold mb-2">TreatyCommerce™</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Commerce built on alignment rather than mere transaction
                  </p>
                </div>
              </Card>

              <Card hover>
                <div className="text-center">
                  <div className="text-5xl mb-4">🛡️</div>
                  <h3 className="text-xl font-bold mb-2">Trust & Transparency</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Immutable contracts and verified interactions
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Treaty;
