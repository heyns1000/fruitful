import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import { useSectors } from '@/hooks/useSectors';

const Explore: React.FC = () => {
  const { sectors, isLoading } = useSectors();

  return (
    <Layout>
      <section className="bg-gradient-to-r from-purple-600 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Explore Sectors</h1>
          <p className="text-purple-100">Discover the FAA.ZONE™ ecosystem</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectors.map((sector) => (
                <Card key={sector.id} hover>
                  <div className="text-center">
                    <div className="text-5xl mb-4">{sector.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{sector.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {sector.description || `Explore ${sector.name} sector`}
                    </p>
                    <button className="btn-primary btn-sm">
                      View Details
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Explore;
