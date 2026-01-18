import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const BaobabTerminal: React.FC = () => {
  return (
    <Layout>
      <section className="bg-gradient-to-r from-purple-600 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🌳 Baobab Terminal</h1>
          <p className="text-purple-100">Threat Intelligence & Security Orchestration</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="text-center">
                  <div className="text-4xl mb-2">🛡️</div>
                  <h3 className="text-lg font-bold mb-2">Security Status</h3>
                  <Badge variant="success">Operational</Badge>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <h3 className="text-lg font-bold mb-2">Pulse Monitoring</h3>
                  <Badge variant="info">9s Interval</Badge>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <h3 className="text-lg font-bold mb-2">Threat Detection</h3>
                  <Badge variant="success">Active</Badge>
                </div>
              </Card>
            </div>

            <Card>
              <h2 className="text-2xl font-bold mb-4">Baobab Orchestration Engine</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The Baobab Portal Orchestration Engine provides real-time security monitoring, 
                threat intelligence, and automated response capabilities across the FAA.ZONE™ ecosystem.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Quantum Lock Resonance</span>
                  <Badge variant="success">99.9%</Badge>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Seedwave Alignment</span>
                  <Badge variant="success">Aligned</Badge>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Deployment Velocity</span>
                  <Badge variant="info">x10.5 Multiplier</Badge>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600 dark:text-gray-400">Dimensional Transit</span>
                  <Badge variant="success">Operational</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BaobabTerminal;
