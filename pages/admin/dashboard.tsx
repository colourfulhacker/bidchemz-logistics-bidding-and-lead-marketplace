import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalQuotes: 0,
    totalOffers: 0,
    totalShipments: 0,
    activePartners: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchAdminStats();
  }, [user]);

  const fetchAdminStats = async () => {
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Quotes</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalQuotes}</p>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Offers</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalOffers}</p>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Shipments</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalShipments}</p>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Partners</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.activePartners}</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">System Management</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">Pricing Configuration</h3>
              <p className="text-sm text-gray-600">Configure lead pricing tiers</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">Partner Verification</h3>
              <p className="text-sm text-gray-600">Review and verify partners</p>
            </div>
            <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">System Logs</h3>
              <p className="text-sm text-gray-600">View audit and webhook logs</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
