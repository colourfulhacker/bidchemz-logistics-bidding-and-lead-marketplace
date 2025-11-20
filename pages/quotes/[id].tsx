import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import { useRouter } from 'next/router';

export default function QuoteDetails() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'transitDays'>('price');

  useEffect(() => {
    if (!user || !id) return;
    fetchQuote();
  }, [user, token, id]);

  const fetchQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setQuote(data.quote);
      } else {
        router.push('/quotes');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      router.push('/quotes');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to select this offer? This will charge the partner and create a shipment.')) {
      return;
    }

    try {
      const response = await fetch(`/api/offers/${offerId}/select`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Offer selected successfully! Shipment has been created.');
        fetchQuote();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to select offer');
      }
    } catch (error) {
      console.error('Error selecting offer:', error);
      alert('Failed to select offer');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  if (!quote) {
    return (
      <Layout>
        <div className="text-center py-12">Quote not found</div>
      </Layout>
    );
  }

  const sortedOffers = [...(quote.offers || [])].sort((a, b) => {
    if (sortBy === 'price') {
      return a.price - b.price;
    }
    return a.transitDays - b.transitDays;
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="secondary" onClick={() => router.back()}>
            ← Back to Requests
          </Button>
        </div>

        <Card className="mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {quote.quoteNumber}
              </h1>
              <Badge variant="primary">{quote.status.replace('_', ' ')}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Cargo</h3>
              <p className="text-gray-900">{quote.cargoName}</p>
              {quote.casNumber && <p className="text-sm text-gray-600">CAS: {quote.casNumber}</p>}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Quantity</h3>
              <p className="text-gray-900">{quote.quantity} {quote.quantityUnit}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Hazardous</h3>
              <p className="text-gray-900">{quote.isHazardous ? `Yes - ${quote.hazardClass}` : 'No'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">From</h3>
              <p className="text-gray-900">{quote.pickupCity}, {quote.pickupState}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">To</h3>
              <p className="text-gray-900">{quote.deliveryCity}, {quote.deliveryState}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Ready Date</h3>
              <p className="text-gray-900">{new Date(quote.cargoReadyDate).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Offers Received ({sortedOffers.length})
            </h2>
            <div className="flex gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="price">Price (Low to High)</option>
                <option value="transitDays">Transit Time</option>
              </select>
            </div>
          </div>

          {sortedOffers.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No offers received yet. Partners are reviewing your request.
            </div>
          ) : (
            <div className="space-y-4">
              {sortedOffers.map((offer: any) => (
                <div
                  key={offer.id}
                  className={`border rounded-lg p-4 ${
                    offer.isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">
                          {offer.partner?.companyName || offer.partner?.email}
                        </h3>
                        <Badge variant={offer.isSelected ? 'success' : 'default'}>
                          {offer.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <p className="font-semibold text-lg text-blue-600">
                            ₹{offer.price.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Transit Time:</span>
                          <p className="font-medium">{offer.transitDays} days</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Pickup Available:</span>
                          <p>{new Date(offer.pickupAvailableFrom).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Offer Valid Until:</span>
                          <p>{new Date(offer.offerValidUntil).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-4 text-sm">
                        {offer.insuranceIncluded && (
                          <span className="text-green-600">✓ Insurance Included</span>
                        )}
                        {offer.trackingIncluded && (
                          <span className="text-green-600">✓ Tracking Included</span>
                        )}
                        {offer.customsClearance && (
                          <span className="text-green-600">✓ Customs Clearance</span>
                        )}
                      </div>

                      {offer.remarks && (
                        <div className="mt-3 text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {offer.remarks}
                        </div>
                      )}
                    </div>

                    {!offer.isSelected && quote.status !== 'SELECTED' && offer.status === 'PENDING' && (
                      <Button
                        variant="primary"
                        onClick={() => handleSelectOffer(offer.id)}
                      >
                        Select Offer
                      </Button>
                    )}

                    {offer.isSelected && (
                      <Badge variant="success" size="lg">
                        SELECTED
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
