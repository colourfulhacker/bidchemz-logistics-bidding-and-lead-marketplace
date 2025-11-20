import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PartnerDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    activeOffers: 0,
    totalLeads: 0,
    walletBalance: 0,
  });
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'LOGISTICS_PARTNER') {
      router.push('/');
      return;
    }

    fetchDashboardData();
  }, [user, token]);

  const fetchDashboardData = async () => {
    try {
      const [offersRes, walletRes] = await Promise.all([
        fetch('/api/offers', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/wallet', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const offersData = await offersRes.json();
      const walletData = await walletRes.json();

      setStats({
        activeOffers: offersData.offers?.filter((o: any) => o.status === 'PENDING').length || 0,
        totalLeads: offersData.offers?.length || 0,
        walletBalance: walletData.wallet?.balance || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Partner Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Offers</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.activeOffers}</p>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Leads</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalLeads}</p>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Wallet Balance</h3>
            <p className="text-3xl font-bold text-green-600">₹{stats.walletBalance.toFixed(2)}</p>
            <Link href="/partner/wallet">
              <Button variant="secondary" className="mt-4 w-full">
                Recharge Wallet
              </Button>
            </Link>
          </Card>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Available Freight Requests</h2>
            <Link href="/partner/capabilities">
              <Button variant="secondary">Manage Capabilities</Button>
            </Link>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 text-center py-8">
              Freight requests matching your capabilities will appear here
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
