import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import { useRouter } from 'next/router';

export default function AdminOffers() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchOffers();
  }, [user]);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOffers(data.data || data || []);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveOffer = async (id: string) => {
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'ACCEPTED' })
      });

      if (response.ok) {
        fetchOffers();
        alert('Offer approved');
      }
    } catch (error) {
      console.error('Error approving offer:', error);
      alert('Failed to approve offer');
    }
  };

  const rejectOffer = async (id: string) => {
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'REJECTED' })
      });

      if (response.ok) {
        fetchOffers();
        alert('Offer rejected');
      }
    } catch (error) {
      console.error('Error rejecting offer:', error);
      alert('Failed to reject offer');
    }
  };

  if (loading) return <Layout><div className="text-center py-12">Loading offers...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Manage Offers</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Offer ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Price</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Transit Days</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Insurance</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No offers found
                    </td>
                  </tr>
                ) : (
                  offers.map((offer) => (
                    <tr key={offer.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{offer.id.substring(0, 8)}</td>
                      <td className="px-4 py-3 text-sm font-semibold">₹{offer.price?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">{offer.transitDays} days</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          offer.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                          offer.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          offer.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {offer.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {offer.insuranceIncluded ? '✓ Yes' : '✗ No'}
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        {offer.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => approveOffer(offer.id)}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectOffer(offer.id)}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
