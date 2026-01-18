import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const Checkout: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plan: 'starter',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Checkout functionality will be implemented with payment integration');
  };

  return (
    <Layout>
      <section className="bg-gradient-to-r from-purple-600 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">💳 Checkout</h1>
          <p className="text-purple-100">Select your plan and get started</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card hover className={formData.plan === 'starter' ? 'border-2 border-purple-600' : ''}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Starter</h3>
                  <div className="text-4xl font-bold mb-4">R99<span className="text-lg">/mo</span></div>
                  <ul className="text-left space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
                    <li>✓ Access to 5 sectors</li>
                    <li>✓ Basic VaultMesh™</li>
                    <li>✓ Email support</li>
                    <li>✓ 1 user</li>
                  </ul>
                  <Button 
                    variant={formData.plan === 'starter' ? 'primary' : 'secondary'}
                    onClick={() => setFormData({ ...formData, plan: 'starter' })}
                    className="w-full"
                  >
                    Select Plan
                  </Button>
                </div>
              </Card>

              <Card hover className={formData.plan === 'pro' ? 'border-2 border-purple-600' : ''}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="text-4xl font-bold mb-4">R299<span className="text-lg">/mo</span></div>
                  <ul className="text-left space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
                    <li>✓ Access to all sectors</li>
                    <li>✓ Full VaultMesh™</li>
                    <li>✓ Priority support</li>
                    <li>✓ 5 users</li>
                  </ul>
                  <Button 
                    variant={formData.plan === 'pro' ? 'primary' : 'secondary'}
                    onClick={() => setFormData({ ...formData, plan: 'pro' })}
                    className="w-full"
                  >
                    Select Plan
                  </Button>
                </div>
              </Card>

              <Card hover className={formData.plan === 'enterprise' ? 'border-2 border-purple-600' : ''}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold mb-4">Custom</div>
                  <ul className="text-left space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
                    <li>✓ Unlimited sectors</li>
                    <li>✓ Custom VaultMesh™</li>
                    <li>✓ 24/7 support</li>
                    <li>✓ Unlimited users</li>
                  </ul>
                  <Button 
                    variant={formData.plan === 'enterprise' ? 'primary' : 'secondary'}
                    onClick={() => setFormData({ ...formData, plan: 'enterprise' })}
                    className="w-full"
                  >
                    Contact Sales
                  </Button>
                </div>
              </Card>
            </div>

            <Card>
              <h2 className="text-2xl font-bold mb-6">Complete Your Purchase</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Complete Purchase
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
