import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const SeedwaveAdmin: React.FC = () => {
  return (
    <Layout>
      <section className="bg-gradient-to-r from-purple-600 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">⚙️ Seedwave Admin Portal</h1>
          <p className="text-purple-100">System Administration & Control</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card hover>
                <div className="text-center">
                  <div className="text-4xl mb-2">👥</div>
                  <h3 className="text-lg font-bold mb-2">User Management</h3>
                  <Button size="sm" variant="secondary">Manage</Button>
                </div>
              </Card>
              <Card hover>
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <h3 className="text-lg font-bold mb-2">Analytics</h3>
                  <Button size="sm" variant="secondary">View</Button>
                </div>
              </Card>
              <Card hover>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔧</div>
                  <h3 className="text-lg font-bold mb-2">Configuration</h3>
                  <Button size="sm" variant="secondary">Configure</Button>
                </div>
              </Card>
              <Card hover>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔐</div>
                  <h3 className="text-lg font-bold mb-2">Security</h3>
                  <Button size="sm" variant="secondary">Manage</Button>
                </div>
              </Card>
            </div>

            <Card>
              <h2 className="text-2xl font-bold mb-4">System Overview</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Welcome to the Seedwave Admin Portal. Manage users, configure system settings, 
                monitor performance, and control ecosystem operations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">7,038</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Brands</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">6,891</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Brands</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">84</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Repositories</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SeedwaveAdmin;
