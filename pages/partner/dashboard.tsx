import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
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
      const [offersRes, walletRes, quotesRes] = await Promise.all([
        fetch('/api/offers', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/wallet', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/quotes?status=MATCHING&status=OFFERS_AVAILABLE', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const offersData = await offersRes.json();
      const walletData = await walletRes.json();
      const quotesData = await quotesRes.json();

      setStats({
        activeOffers: offersData.offers?.filter((o: any) => o.status === 'PENDING').length || 0,
        totalLeads: offersData.offers?.length || 0,
        walletBalance: walletData.wallet?.balance || 0,
      });

      setQuotes(quotesData.quotes || []);
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
            <Link href="/partner/leads">
              <Button variant="primary">View All Leads</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {quotes.length === 0 ? (
              <EmptyState
                icon="🚚"
                title="No Active Leads"
                description="Freight requests matching your capabilities will appear here. Complete your partner profile to start receiving leads."
                actionLabel="Manage Capabilities"
                actionHref="/partner/capabilities"
              />
            ) : (
              quotes.slice(0, 5).map((quote: any) => (
                <div key={quote.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{quote.cargoName}</h3>
                        {quote.isHazardous && (
                          <Badge variant="danger">⚠️ {quote.hazardClass || 'Hazardous'}</Badge>
                        )}
                        <Badge variant={quote.status === 'MATCHING' ? 'warning' : 'success'}>
                          {quote.status === 'MATCHING' ? 'Matching' : 'Offers Available'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">From:</span> {quote.pickupCity}, {quote.pickupState}
                        </div>
                        <div>
                          <span className="font-medium">To:</span> {quote.deliveryCity}, {quote.deliveryState}
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span> {quote.quantity} {quote.quantityUnit}
                        </div>
                        <div>
                          <span className="font-medium">Ready Date:</span> {new Date(quote.cargoReadyDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Link href={`/partner/submit-offer?quoteId=${quote.id}`}>
                      <Button variant="primary" className="ml-4">
                        Submit Offer
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {quotes.length > 5 && (
            <div className="mt-4 text-center">
              <Link href="/partner/leads">
                <Button variant="secondary">View All {quotes.length} Leads</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
