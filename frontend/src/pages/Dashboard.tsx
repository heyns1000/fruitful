import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { usePulse } from '@/hooks/usePulse';
import { api } from '@/services/api';
import { formatNumber, formatPrice } from '@/utils/helpers';
import type { SharePrice, SeedwaveData, EcosystemStatus } from '@/types/api.types';

const Dashboard: React.FC = () => {
  const { pulse, isLoading: pulseLoading } = usePulse();
  const [sharePrice, setSharePrice] = useState<SharePrice | null>(null);
  const [seedwave, setSeedwave] = useState<SeedwaveData | null>(null);
  const [ecosystem, setEcosystem] = useState<EcosystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sharePriceRes, seedwaveRes, ecosystemRes] = await Promise.all([
          api.getSharePrice(),
          api.getSeedwave(),
          api.getEcosystem(),
        ]);

        if (sharePriceRes.success && sharePriceRes.data) {
          setSharePrice(sharePriceRes.data);
        }
        if (seedwaveRes.success && seedwaveRes.data) {
          setSeedwave(seedwaveRes.data);
        }
        if (ecosystemRes.success && ecosystemRes.data) {
          setEcosystem(ecosystemRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && pulseLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-purple-100">Real-time metrics and insights</p>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Share Price */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  FAA™ Share Price
                </h3>
                <span className="text-2xl">📈</span>
              </div>
              {sharePrice ? (
                <>
                  <div className="text-3xl font-bold mb-2">
                    {formatPrice(sharePrice.current)}
                  </div>
                  <div className={`text-sm ${sharePrice.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {sharePrice.change >= 0 ? '↑' : '↓'} {formatPrice(Math.abs(sharePrice.change))} 
                    ({sharePrice.percentChange.toFixed(2)}%)
                  </div>
                </>
              ) : (
                <div className="text-gray-400">Loading...</div>
              )}
            </Card>

            {/* Seedwave Brands */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Treaty Brands
                </h3>
                <span className="text-2xl">🌱</span>
              </div>
              {seedwave ? (
                <>
                  <div className="text-3xl font-bold mb-2">
                    {formatNumber(seedwave.treatedBrands)}
                  </div>
                  <div className="text-sm text-green-600">
                    ↑ {formatNumber(seedwave.growth)} new
                  </div>
                </>
              ) : (
                <div className="text-gray-400">Loading...</div>
              )}
            </Card>

            {/* Active Repositories */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Active Repositories
                </h3>
                <span className="text-2xl">📦</span>
              </div>
              {ecosystem ? (
                <>
                  <div className="text-3xl font-bold mb-2">
                    {formatNumber(ecosystem.repositories)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {ecosystem.activeWorkflows} workflows
                  </div>
                </>
              ) : (
                <div className="text-gray-400">Loading...</div>
              )}
            </Card>

            {/* Pulse Status */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Pulse Status
                </h3>
                <span className="text-2xl">💓</span>
              </div>
              {pulse ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="success">Active</Badge>
                    <span className="text-2xl font-bold">{pulse.pulse}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {pulse.metrics.requestsPerSecond} req/s
                  </div>
                </>
              ) : (
                <div className="text-gray-400">Loading...</div>
              )}
            </Card>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ecosystem Status */}
            <Card>
              <h3 className="text-xl font-bold mb-6">Ecosystem Status</h3>
              {ecosystem ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <Badge variant={ecosystem.status === 'operational' ? 'success' : 'warning'}>
                      {ecosystem.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Repositories</span>
                    <span className="font-bold">{formatNumber(ecosystem.repositories)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Active Workflows</span>
                    <span className="font-bold">{ecosystem.activeWorkflows}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600 dark:text-gray-400">Pulse Interval</span>
                    <span className="font-bold text-purple-600">{ecosystem.pulseInterval}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Loading...</div>
              )}
            </Card>

            {/* Seedwave Growth */}
            <Card>
              <h3 className="text-xl font-bold mb-6">Seedwave Brand Growth</h3>
              {seedwave ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Total Brands</span>
                    <span className="font-bold">{formatNumber(seedwave.treatedBrands)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Active Brands</span>
                    <span className="font-bold">{formatNumber(seedwave.activeBrands)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600 dark:text-gray-400">Growth</span>
                    <span className="font-bold text-green-600">
                      +{formatNumber(seedwave.growth)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Loading...</div>
              )}
            </Card>
          </div>

          {/* Real-time Updates */}
          {pulse && (
            <div className="mt-6">
              <Card glass>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Live updates • Last updated: {new Date(pulse.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {pulse.metrics.activeConnections} active connections
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
