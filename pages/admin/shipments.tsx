import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import { useRouter } from 'next/router';

export default function AdminShipments() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchShipments();
  }, [user]);

  const fetchShipments = async () => {
    try {
      const response = await fetch('/api/shipments', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setShipments(data.data || data || []);
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/shipments/${id}`, {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchShipments();
        alert('Shipment status updated');
      }
    } catch (error) {
      console.error('Error updating shipment:', error);
      alert('Failed to update shipment');
    }
  };

  if (loading) return <Layout><div className="text-center py-12">Loading shipments...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Manage Shipments</h1>
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
                  <th className="px-4 py-2 text-left text-sm font-semibold">Shipment #</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Current Location</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Est. Delivery</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No shipments found
                    </td>
                  </tr>
                ) : (
                  shipments.map((shipment) => (
                    <tr key={shipment.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{shipment.shipmentNumber}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          shipment.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          shipment.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
                          shipment.status === 'BOOKED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{shipment.currentLocation || '—'}</td>
                      <td className="px-4 py-3 text-sm">
                        {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        <select
                          onChange={(e) => updateStatus(shipment.id, e.target.value)}
                          className="px-2 py-1 border rounded text-xs"
                          defaultValue={shipment.status}
                        >
                          <option value="">Change Status</option>
                          <option value="BOOKED">Booked</option>
                          <option value="IN_TRANSIT">In Transit</option>
                          <option value="DELIVERED">Delivered</option>
                        </select>
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
