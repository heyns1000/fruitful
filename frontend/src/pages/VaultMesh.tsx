import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { usePulse } from '@/hooks/usePulse';

const VaultMesh: React.FC = () => {
  const { pulse, isLoading } = usePulse();

  return (
    <Layout>
      <section className="bg-gradient-to-r from-purple-600 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🔐 VaultMesh™</h1>
          <p className="text-purple-100">Intelligent Data Orchestration Framework</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                VaultMesh™ is an intelligent data orchestration framework designed for segmentation, 
                synchronization, and secure deployment of high-value digital assets—referred to as scrolls—
                across decentralized networks.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl mb-2">🔐</div>
                  <div className="font-bold">VaultDNA™</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Immutable Identifiers
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl mb-2">📜</div>
                  <div className="font-bold">ScrollClaims™</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Enforceable Contracts
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl mb-2">🔄</div>
                  <div className="font-bold">PulseGrid™</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Real-time Sync
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold mb-4">Live Pulse Status</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : pulse ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pulse Interval</span>
                    <span className="font-bold">{pulse.pulse}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Requests/Second</span>
                    <span className="font-bold">{pulse.metrics.requestsPerSecond}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Active Connections</span>
                    <span className="font-bold">{pulse.metrics.activeConnections}</span>
                  </div>
                </div>
              ) : null}
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VaultMesh;
